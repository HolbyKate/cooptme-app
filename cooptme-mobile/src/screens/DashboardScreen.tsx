import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  Bell,
  Menu,
  UsersRound,
  UserRound,
  ScanLine,
  PartyPopper,
  Briefcase,
  MessageCircle,
  CalendarDays,
  QrCode,
} from 'lucide-react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { DashboardScreenNavigationProp, MainTabParamList } from '../types/navigation';
import { ScreenWrapper } from '../components/ScreenWrapper';

interface NavigationDestination {
  id: number;
  title: string;
  screen: keyof MainTabParamList;
  icon: React.FC<any>;
}

const cardItems: NavigationDestination[] = [
  {
    id: 1,
    title: "Contacts",
    screen: "Contacts",
    icon: UsersRound,
  },
  {
    id: 2,
    title: "Profils",
    screen: "Profiles",
    icon: UserRound,
  },
  {
    id: 3,
    title: "Événements",
    screen: "Events",
    icon: PartyPopper,
  },
  {
    id: 4,
    title: "Calendrier",
    screen: "Calendar",
    icon: CalendarDays,
  },
  {
    id: 5,
    title: "Emplois",
    screen: "JobList",
    icon: Briefcase,
  },
  {
    id: 6,
    title: "Chat",
    screen: "Chat",
    icon: MessageCircle,
  },
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

  const handleNavigation = (destination: NavigationDestination | "Scan") => {
    try {
      if (destination === "Scan") {
        navigation.navigate("Scan");
        return;
      }

      if (destination.screen === 'Profiles') {
        navigation.navigate('Profiles', { userId: undefined });
      } else if (destination.screen === 'Calendar') {
        navigation.navigate('Calendar', { selectedDate: undefined });
      } else {
        navigation.navigate(destination.screen);
      }
    } catch (error) {
      console.error(`Erreur de navigation vers ${typeof destination === 'string' ? destination : destination.screen}:`, error);
      Alert.alert(
        'Erreur de Navigation',
        'Impossible d\'accéder à cette section pour le moment.'
      );
    }
  };

  const rightContent = (
    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
      <Menu color="#FFFFFF" size={24} />
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper
      headerProps={{
        title: "Dashboard",
        rightContent: rightContent
      }}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Bonjour {userName},</Text>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => handleNavigation("Scan")}
          >
            <QrCode color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>

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
              onPress={() => handleNavigation(item)}
            >
              <View style={styles.iconContainer}>
                <item.icon color="#4247BD" size={32} />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4247BD',
  },
  scanButton: {
    width: 58,
    height: 58,
    borderRadius: 24,
    backgroundColor: '#FF8F66',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  notificationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4247BD',
    padding: 18,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 25,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 12,
    fontWeight: '500',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    aspectRatio: 1.1,
    marginBottom: 8,
    padding: 12,
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
    width: 55,
    height: 55,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#FF8F66',
  },
  menuItemText: {
    fontSize: 14,
    color: '#4247BD',
    fontWeight: '600',
    textAlign: 'center',
  },
});