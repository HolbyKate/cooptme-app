import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await authService.emailLogin(email, password);
            res.json(result);
        } catch (error) {
            res.status(401).json({ error: 'Authentication failed' });
        }
    }

    async googleAuth(req: Request, res: Response) {
        try {
            const { token } = req.body;
            const result = await authService.googleLogin(token);
            res.json(result);
        } catch (error) {
            res.status(401).json({ error: 'Google authentication failed' });
        }
    }
}