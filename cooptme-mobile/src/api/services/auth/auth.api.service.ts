import api from '../../config/axios';
import type { AuthResponse } from '../../../types';

export const authService = {
    googleLogin: async (accessToken: string): Promise<AuthResponse> => {
        try {
            console.log('🔑 Tentative de connexion Google avec accessToken');
            const response = await api.post('/auth/google', { accessToken });
            console.log('✅ Réponse Google:', response.data);
            if (!response.data.token) throw new Error('No token received');
            return response.data; // { token, email, role }
        } catch (error) {
            console.error('❌ Google login failed:', error);
            throw error;
        }
    },

    emailLogin: async (email: string, password: string): Promise<AuthResponse> => {
        try {
            console.log('🔑 Tentative de connexion email:', email);
            console.log('📡 URL:', `${api.defaults.baseURL}/auth/login`);

            const response = await api.post<AuthResponse>('/auth/login', {
                email,
                password
            });

            console.log('✅ Réponse serveur:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ Email login failed:', {
                message: error.message,
                response: error.response?.data,
                config: error.config
            });
            throw error;
        }
    },

    logout: async (): Promise<void> => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    },
};

export default authService;