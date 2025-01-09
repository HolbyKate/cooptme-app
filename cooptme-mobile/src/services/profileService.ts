import _ from 'lodash';
import { apiClient } from '../middleware/api.middleware';
import type { Profile } from '../types/profile';
import type { LinkedInProfile } from '../types/linkedinProfile';
import { categories, CategoryTitle } from '../types/contacts';
import { mockData } from './mockData';
import axios from 'axios';
import { CONFIG } from '../config';

class ProfileService {
  private mockProfiles: LinkedInProfile[] = [];

  constructor() {
    this.generateMockProfiles(15);
  }

  // API Methods
  async getProfile(): Promise<Profile> {
    try {
      const response = await apiClient.get('/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de récupération du profil');
    }
  }

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    try {
      const response = await apiClient.put('/profile', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de mise à jour du profil');
    }
  }

  async uploadProfilePicture(imageUri: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile-picture.jpg',
      } as any);

      const response = await apiClient.post('/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.imageUrl;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors du téléchargement de l\'image');
    }
  }

  // LinkedIn Profile Methods
  async getLinkedInProfiles(): Promise<LinkedInProfile[]> {
    if (__DEV__) {
      return Promise.resolve(_.sortBy(this.mockProfiles, 'scannedAt').reverse());
    }

    try {
      const response = await apiClient.get('/linkedin-profiles');
      return response.data;
    } catch (error: any) {
      console.warn('Fallback to mock data due to API error:', error.message);
      return _.sortBy(this.mockProfiles, 'scannedAt').reverse();
    }
  }

  async getLinkedInProfileById(id: string): Promise<LinkedInProfile | null> {
    if (__DEV__) {
      const profile = this.mockProfiles.find((p) => p.id === id);
      return Promise.resolve(profile || null);
    }

    try {
      const response = await apiClient.get(`/linkedin-profiles/${id}`);
      return response.data;
    } catch (error: any) {
      console.warn(`Profil introuvable dans l'API, recherche dans les mocks : ${error.message}`);
      return this.mockProfiles.find((p) => p.id === id) || null;
    }
  }

  async scrapeAndSaveLinkedInProfile(profileUrl: string): Promise<void> {
    try {
      // Simuler le scraping
      const fakeProfileData: LinkedInProfile = this.generateFakeProfile(profileUrl);

      if (__DEV__) {
        // Ajouter au mock
        this.mockProfiles = [fakeProfileData, ...this.mockProfiles];
      } else {
        // Enregistrer via l'API
        await apiClient.post('/linkedin-profiles', fakeProfileData);
      }
    } catch (error: any) {
      throw new Error(
        error.message || 'Erreur lors du scraping et de l\'enregistrement du profil LinkedIn'
      );
    }
  }

  async syncLinkedInProfile(linkedInProfile: LinkedInProfile): Promise<void> {
    try {
      if (__DEV__) {
        const existingProfile = this.mockProfiles.find((p) => p.id === linkedInProfile.id);
        if (!existingProfile) {
          this.mockProfiles.unshift(linkedInProfile);
        }
        return Promise.resolve();
      }

      await apiClient.post('/profile/linkedin/sync', { profile: linkedInProfile });
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de synchronisation du profil LinkedIn');
    }
  }

  // Private methods for mock data
  private generateMockProfiles(count: number) {
    const locations = mockData.locations;

    for (let i = 0; i < count; i++) {
      const category = _.sample(categories);
      const jobTitle = _.sample(mockData.jobTitles[category?.title || 'IT']) || 'Other';
      const gender = Math.random() > 0.5 ? 'male' : 'female';
      const photoId = Math.floor(Math.random() * 100);

      this.mockProfiles.push({
        id: Math.random().toString(36).substr(2, 9),
        firstName:
          gender === 'male'
            ? _.sample(mockData.prenomsMale) ?? 'John'
            : _.sample(mockData.prenomsFemale) ?? 'Jane',
        lastName: _.sample(mockData.noms) ?? 'Doe',
        title: jobTitle,
        company: _.sample(mockData.enterprises) ?? '',
        location: _.sample(locations) ?? 'Paris',
        category: (category?.title || 'À qualifier') as CategoryTitle,
        profileUrl: `https://linkedin.com/in/profile-${i}`,
        scannedAt: new Date().toISOString(),
        photoId,
        gender,
      });
    }
  }

  private generateFakeProfile(profileUrl: string): LinkedInProfile {
    const category = _.sample(categories);
    const jobTitle = _.sample(mockData.jobTitles[category?.title || 'IT']) || 'Other';
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const photoId = Math.floor(Math.random() * 100);

    return {
      id: Math.random().toString(36).substr(2, 9),
      firstName:
        gender === 'male'
          ? _.sample(mockData.prenomsMale) ?? 'John'
          : _.sample(mockData.prenomsFemale) ?? 'Jane',
      lastName: _.sample(mockData.noms) ?? 'Doe',
      title: jobTitle,
      company: _.sample(mockData.enterprises) ?? 'Tech Corp',
      location: _.sample(mockData.locations) ?? 'Paris, France',
      category: category?.title || 'À qualifier' as CategoryTitle,
      profileUrl,
      scannedAt: new Date().toISOString(),
      photoId,
      gender,
    };
  }

  async saveProfile(profile: LinkedInProfile): Promise<void> {
    try {
      const response = await axios.post(`${CONFIG.API_URL}/profiles`, profile);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
      throw error;
    }
  }

  async getAccessToken(code: string): Promise<string> {
    try {
      const response = await apiClient.post('/auth/linkedin/token', { code });
      return response.data.accessToken;
    } catch (error) {
      console.error('Erreur lors de l\'obtention du token:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
