import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Menu } from 'lucide-react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';

type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  function: string;
  meetingPlace: string;
  photo: string | null;
};

const contacts: Contact[] = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dubois',
    function: 'Développeuse Full Stack',
    meetingPlace: 'Holberton School',
    photo: null,
  },
];

export default function ContactsScreen() {
  const navigation = useNavigation();

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity style={styles.contactCard}>
      <View style={styles.photoContainer}>
        {item.photo ? (
          <Image source={{ uri: item.photo }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>
              {item.firstName[0]}
              {item.lastName[0]}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.name}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.function}>{item.function}</Text>
        <Text style={styles.meetingPlace}>{item.meetingPlace}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
          <Menu color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Contacts</Text>
        <Image
          source={require('../../assets/logo_blue.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#4c51c6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  logo: {
    width: 100,
    height: 40,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
  contactCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FF8F66',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  photoContainer: {
    marginRight: 15,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  photoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4247BD',
  },
  contactInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  function: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  meetingPlace: {
    fontSize: 12,
    color: '#999',
  },
});
