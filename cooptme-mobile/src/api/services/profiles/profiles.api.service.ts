import { Profile } from '@/types';
import axiosInstance from '../../config/axios';

class ProfilesApiService {
    async getAllProfiles() {
        try {
            console.log('📱 Récupération de tous les profils...');
            const response = await axiosInstance.get('/profiles');
            console.log(`✅ ${response.data.length} profils récupérés`);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des profils:', error);
            throw error;
        }
    }

    async getProfilesByCategory(category: string) {
        try {
            console.log(`📱 Récupération des profils de la catégorie ${category}...`);
            const response = await axiosInstance.get(`/profiles/category/${category}`);
            console.log(`✅ ${response.data.length} profils récupérés pour ${category}`);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des profils par catégorie:', error);
            throw error;
        }
    }
    async saveProfile(profile: Profile) {
        try {
            const response = await axiosInstance.post('/profiles', profile);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde du profil:', error);
            throw error;
        }
    }
}

export const profilesApiService = new ProfilesApiService();
