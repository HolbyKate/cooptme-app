/**
 * AuthController: Handles user authentication-related requests.
 *
 * This controller defines endpoints for user authentication using email/password login
 * and Google OAuth. It interacts with the `AuthService` to perform the actual
 * authentication logic.
 *
 * Endpoints:
 * - `login`: Authenticates users via email and password.
 * - `googleAuth`: Authenticates users using a Google OAuth token.
 */
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

// Initialize the authentication service
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
// Handles Google OAuth login requests
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