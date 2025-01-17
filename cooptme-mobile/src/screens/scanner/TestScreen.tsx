import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { profileService } from "../../services/profileService";
import { LinkedInProfile } from "../../types/linkedinProfile";
import { CategoryTitle } from "../../types/contacts";

export default function TestScreen() {
  const [profiles, setProfiles] = useState<LinkedInProfile[]>([]);

  const testAddProfile = async () => {
    try {
      const testProfile: LinkedInProfile = {
        id: `test_${Date.now()}`,
        firstName: 'Test',
        lastName: 'User',
        title: 'Software Engineer',
        company: 'Test Company',
        location: 'Paris, France',
        profileUrl: `https://linkedin.com/in/test-${Date.now()}`,
        scannedAt: new Date().toISOString(),
        category: 'À qualifier' as CategoryTitle,
        photoId: Math.floor(Math.random() * 100),
        gender: Math.random() > 0.5 ? 'male' : 'female'
      };

      await profileService.syncProfile(testProfile);
      console.log('Profil test ajouté avec succès');

      // Recharger les profils
      loadProfiles();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du profil test:', error);
    }
  };

  const loadProfiles = async () => {
    try {
      const loadedProfiles = await profileService.getLinkedInProfiles(); // Changé de getProfiles à getLinkedInProfiles
      setProfiles(loadedProfiles);
      console.log('Profils chargés:', loadedProfiles);
    } catch (error) {
      console.error('Erreur lors du chargement des profils:', error);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Ajouter un profil test" onPress={testAddProfile} />

      <ScrollView style={styles.profileList}>
        <Text style={styles.title}>Profils enregistrés ({profiles.length})</Text>
        {profiles.map((profile) => (
          <View key={profile.id} style={styles.profileCard}>
            <Text style={styles.name}>{profile.firstName} {profile.lastName}</Text>
            <Text>{profile.title}</Text>
            <Text>{profile.company}</Text>
            <Text>{profile.location}</Text>
            <Text>Catégorie: {profile.category}</Text>
            <Text style={styles.date}>
              Scanné le: {new Date(profile.scannedAt).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileList: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    marginTop: 8,
    color: '#666',
  }
});