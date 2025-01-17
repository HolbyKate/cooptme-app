import axios from 'axios';
import { apiClient } from '../middleware/api.middleware';
import type { Profile } from '../types/profile';
import type { LinkedInProfile } from '../types/linkedinProfile';

class ProfileService {
  /**
   * Récupère tous les profils LinkedIn depuis l'API
   */
  async getLinkedInProfiles(): Promise<LinkedInProfile[]> {
    try {
      const response = await apiClient.get('/profiles'); // Assurez-vous que cette route retourne tous les profils
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des profils LinkedIn:', error);
      throw new Error(error.message || 'Erreur lors de la récupération des profils LinkedIn.');
    }
  }

  /**
   * Récupère les profils LinkedIn par catégorie
   */
  async getLinkedInProfilesByCategory(category: string): Promise<LinkedInProfile[]> {
    try {
      const response = await apiClient.get('/profiles', {
        params: { category },
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des profils par catégorie:', error);
      throw new Error(error.message || 'Erreur lors de la récupération des profils.');
    }
  }

  /**
   * Récupère un profil LinkedIn spécifique par ID
   */
  async getLinkedInProfileById(id: string): Promise<LinkedInProfile | null> {
    try {
      const response = await apiClient.get(`/profiles/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la récupération du profil avec l'ID ${id}:`, error);
      throw new Error(error.message || 'Erreur lors de la récupération du profil.');
    }
  }

  async saveProfile(profile: LinkedInProfile): Promise<void> {
    try {
      const response = await apiClient.post('/profiles', profile);
      if (!response.data.success) {
        throw new Error('Échec de la sauvegarde du profil');
      }
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
      throw new Error(error.message || 'Erreur lors de la sauvegarde du profil');
    }
  }

  async syncProfile(profile: LinkedInProfile): Promise<void> {
    try {
      const response = await apiClient.put(`/profiles/${profile.id}`, profile);
      if (!response.data.success) {
        throw new Error('Échec de la synchronisation du profil');
      }
    } catch (error: any) {
      console.error('Erreur lors de la synchronisation du profil:', error);
      throw new Error(error.message || 'Erreur lors de la synchronisation du profil');
    }
  }

  async getProfiles(): Promise<LinkedInProfile[]> {
    try {
      const response = await apiClient.get('/profiles');
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des profils:', error);
      throw new Error(error.message || 'Erreur lors de la récupération des profils');
    }
  }
}

export const profileService = new ProfileService();

