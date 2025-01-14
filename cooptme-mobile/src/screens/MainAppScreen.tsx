import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Platform } from 'react-native';
import { UserCircle2, MessageSquare, Settings, HelpCircle, LogOut, Home, ScanLine, UsersRound, CalendarDays } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/AuthContext';

// Import des écrans
import DashboardScreen from '../screens/DashboardScreen';
import MyAccountScreen from '../screens/MyAccountScreen';
import ChatScreen from '../screens/ChatScreen';
import ScanScreen from '../screens/scanner/ScanScreen';
import SettingsScreen from './drawer/SettingsScreen';
import HelpScreen from './drawer/HelpScreen';
import ContactsScreen from './ContactsScreen';
import ProfilesScreen from './ProfilesScreen';
import CalendarScreen from './CalendarScreen';


// Import des types
import {  MainTabParamList, DrawerParamList } from '../types/navigation';


const Drawer = createDrawerNavigator<DrawerParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const EmptyComponent = () => <View />;

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#E0E0E0',
                    backgroundColor: '#FFFFFF',
                    height: Platform.OS === 'ios' ? 80 : 60,
                    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                },
                tabBarActiveTintColor: '#4247BD',
                tabBarInactiveTintColor: '#666666',
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarLabel: 'Accueil',
                    tabBarIcon: ({ color, size }) => (
                        <Home size={size} color={color} strokeWidth={1.5} />
                    ),
                }}
            />
            <Tab.Screen
                name="Contacts"
                component={ContactsScreen}
                options={{
                    tabBarLabel: 'Contacts',
                    tabBarIcon: ({ color, size }) => (
                        <UsersRound size={size} color={color} strokeWidth={1.5} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profiles"
                component={ProfilesScreen}
                options={{
                    tabBarLabel: 'Profils',
                    tabBarIcon: ({ color, size }) => (
                        <UserCircle2 size={size} color={color} strokeWidth={1.5} />
                    ),
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    tabBarLabel: 'Calendrier',
                    tabBarIcon: ({ color, size }) => (
                        <CalendarDays size={size} color={color} strokeWidth={1.5} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

function DrawerNavigator() {
    const { signOut } = useContext(AuthContext);
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            await signOut();
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' as never }],
            });
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: '#4247BD',
                    width: 280,
                    paddingTop: 50,
                },
                drawerLabelStyle: {
                    color: '#fef9f9',
                    marginLeft: 16,
                    fontSize: 16,
                },
                drawerItemStyle: {
                    borderRadius: 0,
                    marginVertical: 0,
                    paddingVertical: 5,
                },
                drawerActiveTintColor: '#ff8f66',
                drawerInactiveTintColor: 'rgba(254, 249, 249, 0.7)',
            }}
        >
            <Drawer.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{
                    drawerLabel: 'Dashboard',
                    drawerIcon: ({ color }) => <Home size={24} color={color} />,
                }}
            />
            <Drawer.Screen
                name="MyAccount"
                component={MyAccountScreen}
                options={{
                    drawerLabel: 'Mon Compte',
                    drawerIcon: ({ color }) => <UserCircle2 size={24} color={color} />,
                }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    drawerIcon: ({ color }) => <Settings size={24} color={color} strokeWidth={1.5} />,
                    drawerLabel: 'Paramètres',
                }}
            />
            <Drawer.Screen
                name="Help"
                component={HelpScreen}
                options={{
                    drawerIcon: ({ color }) => <HelpCircle size={24} color={color} strokeWidth={1.5} />,
                    drawerLabel: 'Aide',
                }}
            />
            <Drawer.Screen
                name="Logout"
                component={EmptyComponent}
                listeners={{
                    drawerItemPress: () => {
                        handleLogout();
                        return false;
                    },
                }}
                options={{
                    drawerIcon: ({ color }) => <LogOut size={24} color={color} strokeWidth={1.5} />,
                    drawerLabel: 'Déconnexion',
                    drawerItemStyle: {
                        marginTop: 'auto',
                        paddingBottom: 20,
                        borderTopWidth: 1,
                        borderTopColor: 'rgba(254, 249, 249, 0.2)',
                    },
                }}
            />
        </Drawer.Navigator>
    );
}

export default function MainAppScreen() {
    return <DrawerNavigator />;
}