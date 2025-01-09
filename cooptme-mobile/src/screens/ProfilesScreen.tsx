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
        <ActivityIndicator size="large" color="#4247BD" />
      </SafeAreaView>
    );
  }

  if (!loading && profiles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>Aucun profil trouvé.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={profiles}
        renderItem={renderProfileItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  listContainer: { padding: 20 },
  profileCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  title: { fontSize: 16, color: "#666" },
  company: { fontSize: 14, color: "#999" },
  emptyText: { textAlign: "center", fontSize: 16, color: "#666", marginTop: 20 },
});
