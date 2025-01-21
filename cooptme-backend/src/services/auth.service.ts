import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
    async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    async emailLogin(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
            throw new Error('Invalid credentials');
        }

        const isValid = await this.validatePassword(password, user.password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
        });

        return {
            token: this.generateToken(user),
            user: this.sanitizeUser(user)
        };
    }

    async googleLogin(token: string) {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if (!payload) throw new Error('Invalid token');

        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: payload.email },
                    { providerId: payload.sub, provider: 'google' }
                ]
            }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: payload.email!,
                    firstName: payload.given_name!,
                    lastName: payload.family_name!,
                    provider: 'google',
                    providerId: payload.sub,
                    photoUrl: payload.picture,
                    emailVerified: true
                }
            });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
        });

        return {
            token: this.generateToken(user),
            user: this.sanitizeUser(user)
        };
    }

    async linkedinLogin(code: string) {
        // Échanger le code contre un token
        const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', {
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
            client_id: process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET
        });

        const accessToken = tokenResponse.data.access_token;

        // Obtenir les informations de l'utilisateur
        const userResponse = await axios.get('https://api.linkedin.com/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const linkedinProfile = userResponse.data;
        const email = emailResponse.data.elements[0]['handle~'].emailAddress;

        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { providerId: linkedinProfile.id, provider: 'linkedin' }
                ]
            }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    firstName: linkedinProfile.localizedFirstName,
                    lastName: linkedinProfile.localizedLastName,
                    provider: 'linkedin',
                    providerId: linkedinProfile.id,
                    emailVerified: true
                }
            });
        }

        return {
            token: this.generateToken(user),
            user: this.sanitizeUser(user)
        };
    }

    private generateToken(user: any): string {
        return jwt.sign(
            {
                userId: user.id,
                email: user.email,
                roleId: user.roleId
            },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );
    }

    private sanitizeUser(user: any) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}