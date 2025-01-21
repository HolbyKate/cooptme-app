import NetInfo from "@react-native-community/netinfo";
import { profileService } from "../services/profiles/profileService";
import type { LinkedInProfile } from "../../types";

export const syncManager = {
  async syncProfiles(): Promise<void> {
    try {
      const networkState = await NetInfo.fetch();
      if (!networkState.isConnected) return;

      const localProfiles = await profileService.getProfiles();
      for (const profile of localProfiles) {
        if (isLinkedInProfile(profile)) {
          const linkedInProfile: LinkedInProfile = {
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            profileUrl: profile.profileUrl || '',
            company: profile.company || '',
            title: profile.title || '',
            location: profile.location || ''
          };
          await profileService.syncProfile(linkedInProfile);
        } else {
          console.warn("Profile invalide détecté:", profile);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error);
    }
  },

  setupPeriodicSync(intervalMinutes: number = 15) {
    setInterval(this.syncProfiles, intervalMinutes * 60 * 1000);
  },
};

function isLinkedInProfile(profile: any): profile is LinkedInProfile {
    return (
        profile &&
        typeof profile === 'object' &&
        // Ajouter ici les vérifications nécessaires pour les propriétés de LinkedInProfile
        true
    );
}
