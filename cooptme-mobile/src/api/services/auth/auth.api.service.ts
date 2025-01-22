import { authApi } from '../../config/axios';
import type { AuthResponse } from '../../../types/index';

export const authService = {
    async googleLogin(accessToken: string): Promise<AuthResponse> {
        try {
            console.log('🔑 Tentative de connexion Google avec accessToken');
            const response = await authApi.post<AuthResponse>('/auth/google', { accessToken });
            console.log('✅ Réponse Google:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Google login failed:', error);
            throw error;
        }
    },

    async emailLogin(email: string, password: string): Promise<AuthResponse> {
        try {
            console.log('🔑 Tentative de connexion email:', email);
            const response = await authApi.post<AuthResponse>('/auth/login', {
                email,
                password
            });
            return response.data;
        } catch (error) {
            console.error('❌ Email login failed:', error);
            throw error;
        }
    },

    async register(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }): Promise<AuthResponse> {
        try {
            console.log('📝 Tentative d\'inscription:', data.email);
            const response = await authApi.post<AuthResponse>('/auth/register', data);
            return response.data;
        } catch (error) {
            console.error('❌ Registration failed:', error);
            throw error;
        }
    },

    async logout(): Promise<void> {
        try {
            await authApi.post('/auth/logout');
        } catch (error) {
            console.error('❌ Logout failed:', error);
            throw error;
        }
    },

    async resetPassword(email: string): Promise<void> {
        try {
            await authApi.post('/auth/reset-password', { email });
        } catch (error) {
            console.error('❌ Reset password request failed:', error);
            throw error;
        }
    },

    async confirmResetPassword(token: string, newPassword: string): Promise<void> {
        try {
            await authApi.post('/auth/reset-password/confirm', {
                token,
                newPassword
            });
        } catch (error) {
            console.error('❌ Password reset confirmation failed:', error);
            throw error;
        }
    }
};