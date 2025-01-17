import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name } = req.body;
        console.log('Register attempt for:', email);

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                error: 'Cet email est déjà utilisé'
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                provider: 'email'
            }
        });

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'votre-secret',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de l\'inscription'
        });
    }
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Login attempt:', req.body);
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !user.password) {
            res.status(401).json({
                success: false,
                error: 'Email ou mot de passe incorrect'
            });
            return;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(401).json({
                success: false,
                error: 'Email ou mot de passe incorrect'
            });
            return;
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'votre-secret',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la connexion'
        });
    }
});

// Forgot Password
router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        console.log('Forgot password attempt for:', email);

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            res.status(404).json({
                success: false,
                error: 'Aucun compte associé à cet email'
            });
            return;
        }

        const resetToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'votre-secret',
            { expiresIn: '1h' }
        );

        res.json({
            success: true,
            message: 'Email de réinitialisation envoyé'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de l\'envoi de l\'email'
        });
    }
});

export default router;