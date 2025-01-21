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
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/navigation";
import { SharedHeader } from "../../components/SharedHeader";

type ProfilesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  url: string;
  company: string;
  job: string;
  category: string;
};

export default function ProfilesScreen() {
  const navigation = useNavigation<ProfilesScreenNavigationProp>();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les catégories et profils
  useEffect(() => {
    const loadCategoriesAndProfiles = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/profiles");
        const allProfiles: Profile[] = await response.json();

        // Charger les catégories uniques
        const uniqueCategories = Array.from(new Set(allProfiles.map((p) => p.category)));
        setCategories(["All", ...uniqueCategories]);

        setProfiles(allProfiles);
      } catch (error: any) {
        setError("Erreur lors du chargement des données.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoriesAndProfiles();
  }, []);

  // Charger les profils filtrés
  useEffect(() => {
    const loadFilteredProfiles = async () => {
      if (selectedCategory === "All") {
        const response = await fetch("http://localhost:3000/profiles");
        const allProfiles: Profile[] = await response.json();
        setProfiles(allProfiles);
      } else {
        const response = await fetch(`http://localhost:3000/profiles/${selectedCategory}`);
        const filteredProfiles: Profile[] = await response.json();
        setProfiles(filteredProfiles);
      }
    };

    loadFilteredProfiles();
  }, [selectedCategory]);

  const renderProfileItem = ({ item }: { item: Profile }) => (
    <TouchableOpacity
      style={styles.profileCard}
      onPress={() => navigation.navigate("ProfileDetail", { profileId: item.id.toString() })}
    >
      <Text style={styles.name}>
        {item.firstName} {item.lastName}
      </Text>
      <Text style={styles.title}>{item.job}</Text>
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

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <SharedHeader title="Profils" />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SharedHeader title="Profils" />
      <View style={styles.content}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          {categories.map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>

        {profiles.length === 0 ? (
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>Aucun profil trouvé.</Text>
          </View>
        ) : (
          <FlatList
            data={profiles}
            renderItem={renderProfileItem}
            keyExtractor={(item) => item.id.toString()}
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
    padding: 16,
  },
  picker: {
    marginBottom: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 16,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
    marginHorizontal: 20,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 18,
    color: "#FF6B6B",
    textAlign: "center",
    marginHorizontal: 20,
    lineHeight: 24,
  },
});
