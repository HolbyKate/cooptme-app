import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Menu, MapPin, Building2, Filter } from 'lucide-react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, TabParamList } from '../types/navigation';
import { profileService } from '../services/profileService';
import { LinkedInProfile, Contact, CategoryTitle, categories } from '../types/index';

type ProfilesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Profiles'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function ProfilesScreen() {
  const navigation = useNavigation<ProfilesScreenNavigationProp>();
  const [profiles, setProfiles] = useState<LinkedInProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryTitle | 'All'>('All');

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const loadedProfiles = await profileService.getLinkedInProfiles();
      setProfiles(loadedProfiles);
    } catch (error) {
      console.error('Erreur lors du chargement des profils:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = selectedCategory === 'All'
    ? profiles
    : profiles.filter(profile => profile.category === selectedCategory);

  const renderProfileItem = ({ item }: { item: LinkedInProfile }) => (
    <TouchableOpacity
      style={styles.profileCard}
      onPress={() => navigation.navigate('ProfileDetail', { profileId: item.id })}
    >
      <View style={styles.profileHeader}>
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoPlaceholderText}>
            {item.firstName[0]}{item.lastName[0]}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.detailRow}>
            <Building2 size={16} color="#666" style={styles.icon} />
            <Text style={styles.company}>{item.company}</Text>
          </View>

          <View style={styles.detailRow}>
            <MapPin size={16} color="#666" style={styles.icon} />
            <Text style={styles.location}>{item.location}</Text>
          </View>
        </View>
      </View>
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoryFilter}
    >
      <TouchableOpacity
        style={[
          styles.filterChip,
          selectedCategory === 'All' && styles.filterChipSelected
        ]}
        onPress={() => setSelectedCategory('All')}
      >
        <Text style={[
          styles.filterChipText,
          selectedCategory === 'All' && styles.filterChipTextSelected
        ]}>Tous</Text>
      </TouchableOpacity>

      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.filterChip,
            selectedCategory === category.title && styles.filterChipSelected
          ]}
          onPress={() => setSelectedCategory(category.title)}
        >
          <Text style={[
            styles.filterChipText,
            selectedCategory === category.title && styles.filterChipTextSelected
          ]}>{category.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
        >
          <Menu color="#4247BD" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Profils LinkedIn</Text>
      </View>

      {renderCategoryFilter()}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4247BD" />
        </View>
      ) : (
        <FlatList
          data={filteredProfiles}
          renderItem={renderProfileItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucun profil trouvé</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  menuButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Quicksand-Bold',
    color: '#4247BD',
  },
  categoryFilter: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: '#4247BD',
  },
  filterChipText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  photoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  photoPlaceholderText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
    color: '#4247BD',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
  company: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    color: '#666',
  },
  location: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    color: '#666',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 12,
    color: '#4247BD',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    marginTop: 32,
  },
});