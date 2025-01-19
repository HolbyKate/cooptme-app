import { AuthResponse, SocialLoginPayload } from '../types/auth';
import axios from 'axios';

const API_URL = 'YOUR_API_URL'; // Remplacez par votre URL d'API

class AuthService {
    async socialLogin(payload: SocialLoginPayload): Promise<AuthResponse> {
        try {
            const response = await axios.post(`${API_URL}/auth/social-login`, payload);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async validateToken(token: string): Promise<boolean> {
        try {
            const response = await axios.post(`${API_URL}/auth/validate-token`, { token });
            return response.data.valid;
        } catch (error) {
            return false;
        }
    }

    private handleError(error: any): Error {
        if (error.response) {
            throw new Error(error.response.data.message || 'Une erreur est survenue');
        }
        throw error;
    }
}

export const authService = new AuthService();