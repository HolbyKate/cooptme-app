import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { profileService } from "../services/profileService";
import { LinkedInProfile } from "../types/linkedinProfile";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SharedHeader } from '../components/SharedHeader';

type ProfilesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfilesScreen() {
  const navigation = useNavigation<ProfilesScreenNavigationProp>();
  const [profiles, setProfiles] = useState<LinkedInProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true);
        const loadedProfiles = await profileService.getLinkedInProfiles();
        setProfiles(loadedProfiles);
      } catch (error) {
        console.error("Erreur lors du chargement des profils :", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, []);

  const renderProfileItem = ({ item }: { item: LinkedInProfile }) => (
    <TouchableOpacity
      style={styles.profileCard}
      onPress={() => navigation.navigate("ProfileDetail", { profileId: item.id })}
    >
      <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.company}>{item.company}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <SharedHeader title="Profils" />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4247BD" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SharedHeader title="Profils" />
      <View style={styles.content}>
        {profiles.length === 0 ? (
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>Aucun profil trouvé.</Text>
          </View>
        ) : (
          <FlatList
            data={profiles}
            renderItem={renderProfileItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
    color: "#999999",
  },
  emptyText: {
    fontSize: 18,
    color: "#4247BD",
    textAlign: "center",
    fontFamily: "Quicksand-Regular",
    marginHorizontal: 20,
    lineHeight: 24,
  },
});
