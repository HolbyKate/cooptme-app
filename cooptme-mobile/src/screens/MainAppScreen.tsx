import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Home, Users, MessageSquare, UserCircle, Settings, HelpCircle, LogOut } from 'lucide-react-native';

// Import des écrans principaux
import DashboardScreen from './DashboardScreen';
import ContactsScreen from './ContactsScreen';
import ChatScreen from './ChatScreen';
import ProfilesScreen from './ProfilesScreen';
import ScanScreen from './scanner/ScanScreen';


// Import des écrans du drawer
import SettingsScreen from '../screens/drawer/SettingsScreen';
import HelpScreen from '../screens/drawer/HelpScreen';
import LogoutScreen from '../screens/drawer/LogoutScreen';

// Import des types
import { TabParamList, DrawerParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#E0E0E0',
                    backgroundColor: '#FFFFFF',
                    height: 60,
                },
                tabBarActiveTintColor: '#4247BD',
                tabBarInactiveTintColor: '#666666',
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Contacts"
                component={ContactsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Profiles"
                component={ProfilesScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <UserCircle size={size} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}

function DrawerNavigator() {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: '#FFFFFF',
                    width: 280,
                },
                drawerLabelStyle: {
                    color: '#333333',
                    marginLeft: -16,
                },
                drawerActiveTintColor: '#4247BD',
                drawerInactiveTintColor: '#666666',
            }}
        >
            <Drawer.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{
                    drawerLabel: 'Accueil',
                    drawerIcon: ({ color }) => <Home size={24} color={color} />,
                }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    drawerIcon: ({ color }) => <Settings size={24} color={color} />,
                    drawerLabel: 'Paramètres',
                }}
            />
            <Drawer.Screen
                name="Help"
                component={HelpScreen}
                options={{
                    drawerIcon: ({ color }) => <HelpCircle size={24} color={color} />,
                    drawerLabel: 'Aide',
                }}
            />
            <Drawer.Screen
                name="Logout"
                component={LogoutScreen}
                options={{
                    drawerIcon: ({ color }) => <LogOut size={24} color={color} />,
                    drawerLabel: 'Déconnexion',
                }}
            />
        </Drawer.Navigator>
    );
}

export default function MainAppScreen() {
    return <DrawerNavigator />;
}