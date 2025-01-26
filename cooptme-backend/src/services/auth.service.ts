import { PrismaClient } from '@prisma/client';
import type { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

// Types
interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface LoginResponse {
    token: string;
    user: Omit<User, 'password'>;
}

interface AuthError extends Error {
    status?: number;
}

interface UserWithReset extends User {
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
}

// Configuration
const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const SALT_ROUNDS = 12;

export class AuthService {
    /**
     * Register a new user.
     */
    async register(data: RegisterData): Promise<LoginResponse> {
        try {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email.toLowerCase() },
            });

            if (existingUser) {
                throw this.createError(409, 'Un compte existe déjà avec cet email.');
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

            // Create the user
            const user = await prisma.user.create({
                data: {
                    email: data.email.toLowerCase(),
                    password: hashedPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    provider: 'email',
                    emailVerified: false,
                },
            });

            return {
                token: this.generateToken(user),
                user: this.sanitizeUser(user),
            };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Login a user with email and password.
     */
    async emailLogin(email: string, password: string): Promise<LoginResponse> {
        try {
            const user = await prisma.user.findUnique({
                where: { email: email.toLowerCase() },
            });

            if (!user || !user.password) {
                throw this.createError(401, 'Email ou mot de passe incorrect.');
            }

            const isValid = await this.validatePassword(password, user.password);
            if (!isValid) {
                throw this.createError(401, 'Email ou mot de passe incorrect.');
            }

            // Update last login timestamp
            await prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() },
            });

            return {
                token: this.generateToken(user),
                user: this.sanitizeUser(user),
            };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Login or register a user using Google OAuth.
     */
    async googleLogin(token: string): Promise<LoginResponse> {
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                throw this.createError(400, 'Token Google invalide.');
            }

            let user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: payload.email },
                        { providerId: payload.sub, provider: 'google' },
                    ],
                },
            });

            if (user) {
                // Update existing user data
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        lastLoginAt: new Date(),
                        photoUrl: payload.picture || user.photoUrl,
                    },
                });
            } else {
                // Create a new user
                user = await prisma.user.create({
                    data: {
                        email: payload.email,
                        firstName: payload.given_name || '',
                        lastName: payload.family_name || '',
                        provider: 'google',
                        providerId: payload.sub,
                        photoUrl: payload.picture,
                        emailVerified: true,
                        createdAt: new Date(),
                        lastLoginAt: new Date(),
                    },
                });
            }

            return {
                token: this.generateToken(user),
                user: this.sanitizeUser(user),
            };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Request a password reset for a user.
     */
    async requestPasswordReset(email: string): Promise<void> {
    try {
        // Vérifiez si l'utilisateur existe
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            throw this.createError(404, 'Aucun compte associé à cet email.');
        }

        // Générer un token JWT pour la réinitialisation
        const resetToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' } // Valable 1 heure
        );

        console.log('Generated Reset Token:', resetToken); // Debugging

        // Mettre à jour l'utilisateur avec le token et sa date d'expiration
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: new Date(Date.now() + 3600000), // 1 heure
            },
        });

        // TODO: Envoyer un email avec le lien de réinitialisation contenant le resetToken
        console.log(`Envoyez ce lien au client : https://cooptme.com/reset-password?token=${resetToken}`);
    } catch (error) {
        throw this.handleError(error);
    }
}

/**
 * Reset a user's password using a valid reset token.
 */
async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        if (!decoded || !decoded.userId) {
            throw this.createError(400, 'Token invalide ou expiré.');
        }

        const user = await prisma.user.findFirst({
            where: {
                id: decoded.userId,
                resetPasswordToken: token,
                resetPasswordExpires: { gt: new Date() },
            },
        }) as UserWithReset | null;

        if (!user) {
            throw this.createError(400, 'Token invalide ou expiré.');
        }

        // Hachez le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        // Mettre à jour le mot de passe et nettoyer les champs liés au reset
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });

        console.log('Mot de passe réinitialisé avec succès.');
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw this.createError(400, 'Token invalide ou expiré.');
        }
        throw this.handleError(error);
    }
}

    /**
     * Validate a plain text password against a hashed password.
     */
    private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    /**
     * Generate a JWT token for a user.
     */
    private generateToken(user: User): string {
        return jwt.sign(
            {
                userId: user.id,
                email: user.email,
                roleId: user.roleId,
            },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' },
        );
    }

    /**
     * Remove sensitive information from a user object.
     */
    private sanitizeUser(user: User): Omit<User, 'password'> {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }

    /**
     * Create an error object with status.
     */
    private createError(status: number, message: string): AuthError {
        const error = new Error(message) as AuthError;
        error.status = status;
        return error;
    }

    /**
     * Handle and log errors.
     */
    private handleError(error: any): AuthError {
        console.error('Auth Service Error:', error);

        if (error.status) {
            return error;
        }

        const authError = new Error(error.message || 'Une erreur est survenue') as AuthError;
        authError.status = error.status || 500;
        return authError;
    }
}
