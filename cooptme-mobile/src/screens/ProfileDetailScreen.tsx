import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { profileService } from '../services/profileService';
import { LinkedInProfile } from '../types/linkedinProfile';

type ProfileDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProfileDetail'>;

type ProfileDetailScreenRouteProp = {
  params: {
    profileId: string;
  };
};

export default function ProfileDetailScreen() {
  const navigation = useNavigation<ProfileDetailScreenNavigationProp>();
  const route = useRoute<any>();
  const { profileId } = route.params;
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const loadedProfile = await profileService.getProfileById(profileId);
        setProfile(loadedProfile);
      } catch (error) {
        setError('Erreur lors du chargement du profil');
        console.error('Erreur lors du chargement du profil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [profileId]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4247BD" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft color="#4247BD" size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Profil non trouvé'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft color="#4247BD" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>
              {profile.firstName[0]}
              {profile.lastName[0]}
            </Text>
          </View>
          <Text style={styles.name}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text style={styles.function}>{profile.title}</Text>
          <Text style={styles.company}>{profile.company}</Text>
          <Text style={styles.location}>{profile.location}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    padding: 20,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E8E8E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  photoPlaceholderText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 36,
    color: "#4247BD",
  },
  name: {
    fontFamily: "Quicksand-Bold",
    fontSize: 24,
    color: "#333",
    marginBottom: 8,
  },
  function: {
    fontFamily: "Quicksand-Regular",
    fontSize: 18,
    color: "#666",
    marginBottom: 12,
  },
  company: {
    fontFamily: "Quicksand-Regular",
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  location: {
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
    color: "#999",
  },
});