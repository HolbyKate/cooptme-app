import api from '../../config/axios';
import type { User } from '../../../types/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserService {
    async getCurrentUser(): Promise<User> {
        try {
            const response = await api.get<User>('/user/me');
            // Mettre à jour les données utilisateur en cache
            await AsyncStorage.setItem('userData', JSON.stringify(response.data));
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur lors de la récupération du profil');
        }
    }

    async updateProfile(userData: Partial<User>): Promise<User> {
        try {
            const response = await api.put<User>('/user/profile', userData);
            // Mettre à jour les données utilisateur en cache
            await AsyncStorage.setItem('userData', JSON.stringify(response.data));
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur lors de la mise à jour du profil');
        }
    }

    async getUserById(id: string): Promise<User> {
        try {
            const response = await api.get<User>(`/users/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur lors de la récupération de l\'utilisateur');
        }
    }

    async updateUserSettings(settings: any): Promise<void> {
        try {
            await api.put('/user/settings', settings);
        } catch (error: any) {
            throw new Error(error.message || 'Erreur lors de la mise à jour des paramètres');
        }
    }

    async deleteAccount(): Promise<void> {
        try {
            await api.delete('/user/account');
            await AsyncStorage.multiRemove(['userToken', 'userData']);
        } catch (error: any) {
            throw new Error(error.message || 'Erreur lors de la suppression du compte');
        }
    }
}

export const userService = new UserService();