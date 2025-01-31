import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { createHash } from 'crypto';

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface LoginResponse {
    token: string;
    user: Omit<User, 'password' | 'resetPasswordToken' | 'resetPasswordExpires'>;
}

interface AuthError extends Error {
    status: number;
}

interface ResetTokenPayload {
    userId: string;
    iat?: number;
    exp?: number;
}

const SALT_ROUNDS = 12;
const RESET_TOKEN_EXPIRY = '1h';
const AUTH_TOKEN_EXPIRY = '1h';
const MIN_PASSWORD_LENGTH = 8;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

export class AuthService {
    private prisma: PrismaClient;
    private googleClient: OAuth2Client;
    private loginAttempts: Map<string, { count: number; lastAttempt: number }>;

    constructor() {
        if (!process.env.JWT_SECRET || !process.env.GOOGLE_CLIENT_ID) {
            throw new Error('Missing required environment variables');
        }
        this.prisma = new PrismaClient();
        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        this.loginAttempts = new Map();
    }

    async register(data: RegisterData): Promise<LoginResponse> {
        this.validatePassword(data.password);
        const emailHash = this.hashEmail(data.email);

        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: data.email.toLowerCase() },
                    { emailHash }
                ]
            }
        });

        if (existingUser) {
            throw this.createError(409, 'Email already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
        const user = await this.prisma.user.create({
            data: {
                ...data,
                email: data.email.toLowerCase(),
                emailHash,
                password: hashedPassword,
                provider: 'email',
                emailVerified: false
            }
        });

        return {
            token: this.generateToken(user),
            user: this.sanitizeUser(user)
        };
    }

    async emailLogin(email: string, password: string): Promise<LoginResponse> {
        const emailLower = email.toLowerCase();
        
        if (this.isLockedOut(emailLower)) {
            throw this.createError(429, 'Too many login attempts. Try again later.');
        }

        const user = await this.prisma.user.findUnique({
            where: { email: emailLower }
        });

        if (!user?.password || !(await bcrypt.compare(password, user.password))) {
            this.recordLoginAttempt(emailLower);
            throw this.createError(401, 'Invalid credentials');
        }

        this.loginAttempts.delete(emailLower);

        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
        });

        return {
            token: this.generateToken(user),
            user: this.sanitizeUser(user)
        };
    }

    async googleLogin(token: string): Promise<LoginResponse> {
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();
            if (!payload?.email) {
                throw this.createError(400, 'Invalid Google token');
            }

            const user = await this.upsertGoogleUser(payload);
            return {
                token: this.generateToken(user),
                user: this.sanitizeUser(user)
            };
        } catch (error) {
            throw this.createError(401, 'Google authentication failed');
        }
    }

    async requestPasswordReset(email: string): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            // Return void to prevent email enumeration
            return;
        }

        const resetToken = this.generateResetToken(user.id);
        const hashedToken = createHash('sha256').update(resetToken).digest('hex');

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: new Date(Date.now() + 3600000)
            }
        });

        // TODO: Send email with reset link
        console.log(`Reset link: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`);
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        this.validatePassword(newPassword);
        const payload = this.verifyResetToken(token);
        const hashedToken = createHash('sha256').update(token).digest('hex');

        const user = await this.prisma.user.findFirst({
            where: {
                id: payload.userId,
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { gt: new Date() }
            }
        });

        if (!user) {
            throw this.createError(400, 'Invalid or expired token');
        }

        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });
    }

    private validatePassword(password: string): void {
        if (password.length < MIN_PASSWORD_LENGTH) {
            throw this.createError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
        }
        // Add more password validation rules as needed
    }

    private hashEmail(email: string): string {
        return createHash('sha256').update(email.toLowerCase()).digest('hex');
    }

    private isLockedOut(email: string): boolean {
        const attempts = this.loginAttempts.get(email);
        if (!attempts) return false;

        const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
        if (timeSinceLastAttempt > LOGIN_LOCKOUT_TIME) {
            this.loginAttempts.delete(email);
            return false;
        }

        return attempts.count >= MAX_LOGIN_ATTEMPTS;
    }

    private recordLoginAttempt(email: string): void {
        const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
        attempts.count += 1;
        attempts.lastAttempt = Date.now();
        this.loginAttempts.set(email, attempts);
    }

    private async upsertGoogleUser(payload: jwt.JwtPayload): Promise<User> {
        const emailHash = this.hashEmail(payload.email!);
        const userData = {
            email: payload.email!,
            emailHash,
            firstName: payload.given_name || '',
            lastName: payload.family_name || '',
            provider: 'google',
            providerId: payload.sub,
            photoUrl: payload.picture,
            emailVerified: true,
            lastLoginAt: new Date()
        };

        return this.prisma.user.upsert({
            where: { email: payload.email! },
            update: userData,
            create: userData
        });
    }

    private generateToken(user: User): string {
        return jwt.sign(
            {
                userId: user.id,
                email: user.email,
                roleId: user.roleId
            },
            process.env.JWT_SECRET!,
            { 
                expiresIn: AUTH_TOKEN_EXPIRY,
                algorithm: 'HS256'
            }
        );
    }

    private generateResetToken(userId: string): string {
        return jwt.sign(
            { userId },
            process.env.JWT_SECRET!,
            { 
                expiresIn: RESET_TOKEN_EXPIRY,
                algorithm: 'HS256'
            }
        );
    }

    private verifyResetToken(token: string): ResetTokenPayload {
        try {
            return jwt.verify(token, process.env.JWT_SECRET!, { algorithms: ['HS256'] }) as ResetTokenPayload;
        } catch {
            throw this.createError(400, 'Invalid or expired token');
        }
    }

    private sanitizeUser(user: User): Omit<User, 'password' | 'resetPasswordToken' | 'resetPasswordExpires'> {
        const { password, resetPasswordToken, resetPasswordExpires, ...sanitizedUser } = user;
        return sanitizedUser;
    }

    private createError(status: number, message: string): AuthError {
        const error = new Error(message) as AuthError;
        error.status = status;
        return error;
    }
}
