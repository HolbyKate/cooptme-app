// services/profileService.ts
import _ from 'lodash';
import { apiClient } from '../middleware/api.middleware';
import type { Profile } from '../types/profile';
import type { LinkedInProfile } from '../types/linkedinProfile';
import { categories, CategoryTitle } from '../types/contacts';
import { mockData } from './mockData';

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
    // En mode développement, utiliser les données mockées
    if (__DEV__) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(_.sortBy(this.mockProfiles, 'scannedAt').reverse());
        }, 500);
      });
    }

    // En production, appeler l'API
    try {
      const response = await apiClient.get('/linkedin-profiles');
      return response.data;
    } catch (error: any) {
      console.warn('Fallback to mock data due to API error:', error);
      return _.sortBy(this.mockProfiles, 'scannedAt').reverse();
    }
  }

  async getLinkedInProfileById(id: string): Promise<LinkedInProfile | null> {
    if (__DEV__) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const profile = this.mockProfiles.find(p => p.id === id);
          resolve(profile || null);
        }, 300);
      });
    }

    try {
      const response = await apiClient.get(`/linkedin-profiles/${id}`);
      return response.data;
    } catch (error: any) {
      const mockProfile = this.mockProfiles.find(p => p.id === id);
      return mockProfile || null;
    }
  }

  async syncLinkedInProfile(linkedInProfile: LinkedInProfile): Promise<void> {
    if (__DEV__) {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.mockProfiles.unshift(linkedInProfile);
          resolve();
        }, 300);
      });
    }

    try {
      await apiClient.post('/profile/linkedin/sync', { profile: linkedInProfile });
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de synchronisation du profil LinkedIn');
    }
  }

  // Private methods for mock data
  private generateMockProfiles(count: number) {
    const locations = mockData.locations;

    for (let i = 0; i < count; i++) {
      const category = _.sample(categories)!;
      const jobTitle = _.sample(mockData.jobTitles[category.title]) || "Other";
      const gender = Math.random() > 0.5 ? 'male' : 'female';
      const photoId = Math.floor(Math.random() * 100);

      this.mockProfiles.push({
        id: Math.random().toString(36).substr(2, 9),
        firstName: gender === 'male'
          ? _.sample(mockData.prenomsMale) ?? 'John'
          : _.sample(mockData.prenomsFemale) ?? 'Jane',
        lastName: _.sample(mockData.noms) ?? 'Doe',
        title: jobTitle,
        company: _.sample(mockData.enterprises) ?? '',
        location: _.sample(locations) ?? 'Paris',
        category: category.title,
        profileUrl: `https://linkedin.com/in/profile-${i}`,
        scannedAt: new Date().toISOString(),
        photoId,
        gender
      });
    }
  }
}

export const profileService = new ProfileService();
