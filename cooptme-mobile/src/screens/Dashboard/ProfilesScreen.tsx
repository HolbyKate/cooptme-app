import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  Linking,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/navigation';
import { SharedHeader } from '../../components/SharedHeader';
import {
  Code2,
  Palette,
  Users2,
  GraduationCap,
  Heart,
  Scale,
  BrainCircuit,
  Building,
  LineChart,
  Megaphone,
  Box,
  Settings2,
  MoreHorizontal,
  Briefcase,
} from 'lucide-react-native';
import axios from '../../api/config/axios';

type Props = NativeStackScreenProps<RootStackParamList, 'Profiles'>;

type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  url: string;
  company: string;
  job: string;
  category: string;
  meetAt?: string;
};

type CategoryCard = {
  id: string;
  title: string;
  icon: any;
  color: string;
};

const categories: CategoryCard[] = [
  { id: 'Tech', title: 'Tech', icon: Code2, color: '#4247BD' },
  { id: 'Creative', title: 'Créatif', icon: Palette, color: '#FF8F66' },
  { id: 'Management', title: 'Management', icon: Users2, color: '#2E7D32' },
  { id: 'Education', title: 'Éducation', icon: GraduationCap, color: '#1976D2' },
  { id: 'Healthcare', title: 'Santé', icon: Heart, color: '#E91E63' },
  { id: 'Legal', title: 'Juridique', icon: Scale, color: '#795548' },
  { id: 'Consulting', title: 'Consulting', icon: BrainCircuit, color: '#9C27B0' },
  { id: 'Entrepreneurship', title: 'Entrepreneuriat', icon: Building, color: '#FF5722' },
  { id: 'Investing', title: 'Investissement', icon: LineChart, color: '#00BCD4' },
  { id: 'Sales', title: 'Ventes', icon: Briefcase, color: '#FFC107' },
  { id: 'Marketing', title: 'Marketing', icon: Megaphone, color: '#8BC34A' },
  { id: 'Product', title: 'Produit', icon: Box, color: '#3F51B5' },
  { id: 'Operations', title: 'Opérations', icon: Settings2, color: '#607D8B' },
  { id: 'Other', title: 'Autres', icon: MoreHorizontal, color: '#9E9E9E' },
];

const meetAtColors: { [key: string]: string } = {
  Holberton: '#007AFF',
  Actual: '#FF9500',
  'La mêlée': '#FF2D55',
  'La French Tech': '#4CD964',
  'Salon emploi': '#5856D6',
  'Aerospace Valley': '#FF3B30',
};

export default function ProfilesScreen() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/profiles');
        if (response.data.success) {
          setProfiles(response.data.data);
        } else {
          console.warn('Erreur lors de la récupération des profils:', response.data.error);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des profils:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, []);

  const handleCategoryPress = async (categoryId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/profiles/category/${categoryId}`);
      if (response.data.success) {
        setFilteredProfiles(response.data.data);
        setSelectedCategory(categoryId);
        setModalVisible(true);
      } else {
        console.warn('Erreur lors de la récupération des profils par catégorie:', response.data.error);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la catégorie:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProfileItem = ({ item }: { item: Profile }) => (
    <View style={styles.profileItem}>
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{item.firstName} {item.lastName}</Text>
          <Text style={styles.profileJob}>{item.job}</Text>
          <Text style={styles.profileCompany}>{item.company}</Text>
        </View>
        {item.meetAt && (
          <View style={styles.meetAtContainer}>
            <Image
              source={require('../../../assets/Badge.png')}
              style={styles.meetAtLogo}
              resizeMode="contain"
            />
            <Text style={styles.meetAtText}>{item.meetAt}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.urlButton}
        onPress={() => Linking.openURL(item.url)}
      >
        <Text style={styles.urlButtonText}>Voir le profil</Text>
      </TouchableOpacity>
    </View>
  );

  const filteredProfilesBySearch = profiles.filter(profile =>
    `${profile.firstName} ${profile.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4247BD" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SharedHeader title="Profils" />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une personne ou catégorie..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            const query = text.toLowerCase();

            const filtered = profiles.filter(profile =>
              `${profile.firstName} ${profile.lastName}`.toLowerCase().includes(query)
            );
            setFilteredProfiles(filtered);

            if (!text) setFilteredProfiles(profiles); // Réinitialiser si le champ est vide
          }}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Catégories */}
        <View style={styles.gridContainer}>
          {categories.map(category => {
            const profileCount = profiles.filter(p => p.category === category.id).length;
            return (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category.id)}
              >
                <View style={[styles.iconContainer, { borderColor: category.color }]}>
                  <category.icon color={category.color} size={32} />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.profileCount}>{profileCount} profils</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={filteredProfiles}
          renderItem={renderProfileItem}
          keyExtractor={item => item.id}
          nestedScrollEnabled={true}
          contentContainerStyle={styles.profilesList}
        />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedCategory && categories.find(c => c.id === selectedCategory)?.title}
                <Text style={styles.modalSubtitle}> ({filteredProfiles.length} profils)</Text>
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {filteredProfiles.length > 0 ? (
              <FlatList
                data={filteredProfiles}
                renderItem={renderProfileItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.profilesList}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Aucun profil dans cette catégorie</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 4,
  },
  profileCount: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: 'normal',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666666',
  },
  profilesList: {
    padding: 16,
  },
  profileItem: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  profileInfo: {
    flex: 1,
    marginRight: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  profileJob: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 2,
  },
  profileCompany: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 2,
  },
  meetAtContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  meetAtLogo: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  meetAtText: {
    fontSize: 12,
    color: '#4247BD',
    textAlign: 'center',
    fontWeight: '600',
  },
  urlButton: {
    backgroundColor: '#4247BD',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  urlButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});

