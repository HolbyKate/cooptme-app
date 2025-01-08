import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Bell, Users, UserCircle, Calendar, MessageSquare, QrCode, Briefcase, Home } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, TabParamList } from '../types/navigation';
import { NavigatorScreenParams } from '@react-navigation/native';

type DashboardScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Dashboard'>,
  NativeStackNavigationProp<RootStackParamList>
>;

// Définir un type plus précis pour les écrans de destination
type NavigationScreens = keyof RootStackParamList | keyof TabParamList;

type CardItem = {
  id: number;
  title: string;
  screen: NavigationScreens;
  icon: any;
  params?: object;
};

const cardItems: CardItem[] = [
  { id: 1, title: 'Contacts', screen: 'Contacts', icon: Users },
  { id: 2, title: 'Profils', screen: 'Profiles', icon: UserCircle },
  { id: 3, title: 'Événements', screen: 'Events', icon: Calendar },
  { id: 4, title: 'Messages', screen: 'Chat', icon: MessageSquare },
  { id: 5, title: 'Emplois', screen: 'JobList', icon: Briefcase },
  { id: 6, title: 'Scanner', screen: 'Scan', icon: QrCode }
];

const tabItems: CardItem[] = [
  { id: 1, icon: Home, screen: 'Dashboard', title: 'Accueil' },
  { id: 2, icon: Users, screen: 'Contacts', title: 'Contacts' },
  { id: 3, icon: MessageSquare, screen: 'Chat', title: 'Messages' },
  { id: 4, icon: UserCircle, screen: 'Profiles', title: 'Profils' },
];

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  const handleNavigation = (screen: NavigationScreens, params?: object) => {
    if (screen === 'Contacts' || screen === 'Chat' || screen === 'Profiles' || screen === 'Dashboard') {
      navigation.navigate('MainApp', {
        screen: screen,
        params: params
      } as NavigatorScreenParams<TabParamList>);
    } else {
      // Ajout du type casting approprié et des paramètres
      navigation.navigate(screen as keyof RootStackParamList, params as never);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.notificationBar}>
          <Bell color="#4247BD" size={20} />
          <Text style={styles.notificationText}>1 nouvelle notification</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.menuGrid}>
          {cardItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleNavigation(item.screen, item.params)}
            >
              <item.icon color="#4247BD" size={32} />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  notificationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 20,
    width: '90%',
  },
  notificationText: {
    fontSize: 14,
    color: '#4247BD',
    marginLeft: 8,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  menuItem: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuItemText: {
    fontSize: 16,
    color: '#4247BD',
    marginTop: 8,
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});