// Ecran principal
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
  PartyPopper,
  Briefcase,
  MessageCircle,
  CalendarDays,
  QrCode
} from 'lucide-react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { CompositeNavigationProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { BottomTabParamList, DrawerParamList, RootStackParamList } from '../../navigation/types';

type DashboardScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Dashboard'>,
  CompositeNavigationProp<
    DrawerNavigationProp<DrawerParamList>,
    NativeStackNavigationProp<RootStackParamList>
  >
>;

type ModalScreens = Extract<keyof RootStackParamList, 'Contacts' | 'Profiles' | 'Events' | 'Calendar' | 'Job' | 'Chat' | 'Scan'>;

type NavigationDestination = {
  id: number;
  title: string;
  screenName: ModalScreens;
  icon: typeof UsersRound;
};

const cardItems: NavigationDestination[] = [
  { id: 1, title: 'Contacts', screenName: 'Contacts', icon: UsersRound },
  { id: 2, title: 'Profils', screenName: 'Profiles', icon: UserRound },
  { id: 3, title: 'Événements', screenName: 'Events', icon: PartyPopper },
  { id: 4, title: 'Calendrier', screenName: 'Calendar', icon: CalendarDays },
  { id: 5, title: 'Emplois', screenName: 'Job', icon: Briefcase },
  { id: 6, title: 'Chat', screenName: 'Chat', icon: MessageCircle },
];

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const userName = 'Cathy';
  const bellAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bellAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(bellAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        })
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const handleNavigation = (destination: NavigationDestination) => {
    try {
      navigation.navigate(destination.screenName as never);
    } catch (error) {
      console.error('Erreur de navigation:', error);
      Alert.alert('Erreur', 'Navigation impossible');
    }
  };

  return (
    <ScreenWrapper
      headerProps={{
        title: 'Dashboard',
        rightContent: (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Menu color="#FFFFFF" size={24} />
          </TouchableOpacity>
        )
      }}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Bonjour {userName},</Text>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => navigation.navigate('Scan' as never)}
          >
            <QrCode color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.notificationBar}>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: bellAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '15deg']
                  })
                }
              ]
            }}
          >
            <Bell color="#FF8F66" size={24} />
          </Animated.View>
          <Text style={styles.notificationText}>1 nouvelle notification</Text>
        </View>

        <View style={styles.menuGrid}>
          {cardItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleNavigation(item)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <item.icon color="#FF8F66" size={24} />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
}

/** Styles **/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4247BD'
  },
  scanButton: {
    width: 58,
    height: 58,
    borderRadius: 24,
    backgroundColor: '#FF8F66',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
  notificationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4247BD',
    padding: 18,
    borderRadius: 15,
    marginBottom: 30
  },
  notificationText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 12
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  menuItem: {
    width: '48%',
    aspectRatio: 1.1,
    marginBottom: 15,
    padding: 12,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2
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
    borderColor: '#FF8F66'
  },
  menuItemText: {
    fontSize: 14,
    color: '#4247BD',
    fontWeight: '600',
    textAlign: 'center'
  }
});

