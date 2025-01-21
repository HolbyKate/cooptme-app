import api from '../../config/axios';
import type { LinkedInProfile } from '../../../types';

export const profileService = {
    saveProfile: async (profile: LinkedInProfile) => {
        const response = await api.post('/profiles', profile);
        return response.data;
    },

    getProfiles: async () => {
        const response = await api.get('/profiles');
        return response.data;
    },

    syncProfile: async (profile: LinkedInProfile) => {
        const response = await api.put(`/profiles/${profile.id}`, profile);
        return response.data;
    },

    getAccessToken: async (code: string) => {
        const response = await api.post('/auth/linkedin/token', { code });
        return response.data;
    },

    getProfile: async (id: string) => {
        const response = await api.get(`/profiles/${id}`);
        return response.data;
    }
};
