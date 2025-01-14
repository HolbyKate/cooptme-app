import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Image,
  Animated,
  Alert,
} from 'react-native';
import {
  Bell,
  Menu,
  UsersRound,
  UserCircle2,
  PartyPopper,
  MessageCircle,
  ScanLine,
  Briefcase,
  CalendarDays,
} from 'lucide-react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList, DrawerParamList } from '../types/navigation';
import { Video } from 'expo-av';
import { NavigatorScreenParams } from '@react-navigation/native';

type DashboardScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Dashboard'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type NavigationScreens = keyof MainTabParamList | keyof RootStackParamList;

type CardItem = {
  id: number;
  title: string;
  screen: NavigationScreens;
  icon: React.FC<any>;
    userId?: string;
    chatId?: string;
    name?: string;
    profileId?: string;
};

const cardItems: CardItem[] = [
  {
    id: 1,
    title: 'Contacts',
    screen: 'Contacts',
    icon: (props) => <UsersRound {...props} strokeWidth={1.5} />,
  },
  {
    id: 2,
    title: 'Profils',
    screen: 'Profiles',
    icon: (props) => <UserCircle2 {...props} strokeWidth={1.5} />,
  },
  {
    id: 3,
    title: 'Événements',
    screen: 'Events',
    icon: (props) => <PartyPopper {...props} strokeWidth={1.5} />,
  },
  {
    id: 4,
    title: 'Calendrier',
    screen: 'Calendar',
    icon: (props) => <CalendarDays {...props} strokeWidth={1.5} />,
  },
  {
    id: 5,
    title: 'Messages',
    screen: 'Chat',
    icon: (props) => <MessageCircle {...props} strokeWidth={1.5} />,
  },
  {
    id: 6,
    title: 'Emplois',
    screen: 'JobList',
    icon: (props) => <Briefcase {...props} strokeWidth={1.5} />,
  },
  {
    id: 7,
    title: 'Scanner',
    screen: 'Scan',
    icon: (props) => <ScanLine {...props} strokeWidth={1.5} />,
  }
];

export default function DashboardScreen(): JSX.Element {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const userName = "Cathy";
  const bellAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bellAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bellAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleNavigation = (screen: NavigationScreens, params?: object) => {
    try {
      switch (screen) {
        case 'Calendar':
          navigation.navigate('MainApp', {
            screen: 'MainTabs',
            params: {
              screen: 'Calendar'
            }
          });
          break;

        case 'Profiles':
          navigation.navigate('MainApp', {
            screen: 'MainTabs',
            params: {
              screen: 'Profiles'
            }
          });
          break;

        case 'Contacts':
        case 'Chat':
        case 'Scan':
          navigation.navigate('MainApp', {
            screen: 'MainTabs',
            params: {
              screen
            }
          });
          break;

        case 'Events':
        case 'JobList':
          navigation.navigate(screen);
          break;

        default:
          console.warn(`Route non gérée: ${screen}`);
      }
    } catch (error) {
      console.error(`Erreur de navigation vers ${screen}:`, error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4247BD', '#4c51c6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
          <Menu color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Image
          source={require('../../assets/logo_blue.png') || {}}
          style={styles.logo}
          resizeMode="contain"
        />
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Text style={styles.welcomeText}>Bonjour {userName},</Text>

        <View style={styles.notificationBar}>
          <Animated.View style={{
            transform: [{
              rotate: bellAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '15deg']
              })
            }]
          }}>
            <Bell color="#ff8f66" size={24} />
          </Animated.View>
          <Text style={styles.notificationText}>1 nouvelle notification</Text>
        </View>

        <View style={styles.menuGrid}>
          {cardItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleNavigation(item.screen)}
            >
              <View style={styles.iconContainer}>
                <item.icon color="#4247BD" size={32} />
              </View>
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
    backgroundColor: '#fef9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
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
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4247BD',
    marginBottom: 20,
  },
  notificationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationText: {
    fontSize: 14,
    color: '#4247BD',
    marginLeft: 8,
    fontWeight: '500',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 65,
    height: 65,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#FF8F66',
  },
  menuItemText: {
    fontSize: 16,
    color: '#4247BD',
    fontWeight: '600',
    textAlign: 'center',
  },
});