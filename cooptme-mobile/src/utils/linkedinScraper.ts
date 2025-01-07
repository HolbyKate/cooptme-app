import AsyncStorage from "@react-native-async-storage/async-storage";
import profileService from "../services/profileService";

const LINKEDIN_AUTH_KEY = "linkedin_auth";
const STORAGE_KEY = "scanned_profiles";

export interface LinkedInAuth {
  isLoggedIn: boolean;
  cookies?: string;
}

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  location: string;
  scannedAt: string;
  profileUrl: string;
}

export const LINKEDIN_LOGIN_SCRIPT = `
  (function() {
    const nav = document.querySelector('.nav');
    if (nav) {
      const cookies = document.cookie;
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'LOGIN_SUCCESS',
        cookies: cookies
      }));
    }
  })();
`;

export const LINKEDIN_SCRAPING_SCRIPT = `
  (function() {
    try {
      const nameElement = document.querySelector('.text-heading-xlarge');
      const titleElement = document.querySelector('.text-body-medium');
      const companyElement = document.querySelector('.pv-text-details__right-panel-item-text');
      const locationElement = document.querySelector('.text-body-small');

      if (!nameElement || !titleElement) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'SCRAPING_ERROR',
          error: 'Profile elements not found'
        }));
        return;
      }

      const fullName = nameElement.textContent.trim();
      const nameParts = fullName.split(' ');

      const data = {
        type: 'PROFILE_DATA',
        profile: {
          id: 'li_' + Date.now(),
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' '),
          title: titleElement.textContent.trim(),
          company: companyElement ? companyElement.textContent.trim() : '',
          location: locationElement ? locationElement.textContent.trim() : '',
          profileUrl: window.location.href,
          scannedAt: new Date().toISOString()
        }
      };

      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    } catch (error) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'SCRAPING_ERROR',
        error: error.message
      }));
    }
  })();
`;

export const saveLinkedInAuth = async (auth: LinkedInAuth): Promise<void> => {
  try {
    await AsyncStorage.setItem(LINKEDIN_AUTH_KEY, JSON.stringify(auth));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'authentification:", error);
    throw error;
  }
};

export const getLinkedInAuth = async (): Promise<LinkedInAuth | null> => {
  try {
    const data = await AsyncStorage.getItem(LINKEDIN_AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'authentification:",
      error
    );
    return null;
  }
};

export const saveProfile = async (profile: LinkedInProfile): Promise<void> => {
  try {
    // Sauvegarde locale
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const profiles: LinkedInProfile[] = existingData ? JSON.parse(existingData) : [];

    const existingIndex = profiles.findIndex(p => p.profileUrl === profile.profileUrl);
    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.push(profile);
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));

    // Sauvegarde avec le nouveau service
    await profileService.syncProfile(profile);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du profil:', error);
    throw error;
  }
};

export const getProfiles = async (): Promise<LinkedInProfile[]> => {
  try {
    // Récupérer les profils avec le nouveau service
    try {
      const profiles = await profileService.getProfiles();
      if (profiles && profiles.length > 0) {
        // Mettre à jour le stockage local avec les données
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
        return profiles;
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des profils:",
        error
      );
    }

    // Si la récupération échoue ou ne retourne pas de données, utiliser le stockage local
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des profils:", error);
    return [];
  }
};
