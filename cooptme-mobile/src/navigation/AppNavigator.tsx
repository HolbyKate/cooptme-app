import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    Home,
    Calendar,
    Briefcase,
    Users,
    MessageCircle,
    UserCircle,
    Settings,
    HelpCircle,
    LogOut,
    QrCode,
    PartyPopper
} from 'lucide-react-native';

// Import des écrans
import HomeScreen from '../screens/Auth/HomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import EventsScreen from '../screens/Dashboard/EventsScreen';
import JobScreen from '../screens/Dashboard/JobScreen';
import ScanScreen from '../screens/Scanner/ScanScreen';
import ProfilesScreen from '../screens/Dashboard/ProfilesScreen';
import ChatConversationScreen from '../screens/Chat/ChatConversationScreen';
import ContactsScreen from '../screens/Dashboard/ContactsScreen';
import CalendarScreen from '../screens/Dashboard/CalendarScreen';
import MyAccountScreen from '../screens/User/MyAccountScreen';
import SettingsScreen from '../screens/Drawer/SettingsScreen';
import HelpScreen from '../screens/Drawer/HelpScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import { RootStackParamList, DrawerParamList, MainTabParamList } from './navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#4247BD',
                tabBarInactiveTintColor: '#999999',
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                headerShown: false
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                    tabBarLabel: 'Accueil'
                }}
            />
            <Tab.Screen
                name="Events"
                component={EventsScreen}
                options={{
                    tabBarIcon: ({ color }) => <PartyPopper size={24} color={color} />,
                    tabBarLabel: 'Événements'
                }}
            />
            <Tab.Screen
                name="Job"
                component={JobScreen}
                options={{
                    tabBarIcon: ({ color }) => <Briefcase size={24} color={color} />,
                    tabBarLabel: 'Emplois'
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
                    tabBarLabel: 'Agenda'
                }}
            />
            <Tab.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    tabBarIcon: ({ color }) => <MessageCircle size={24} color={color} />,
                    tabBarLabel: 'Messages'
                }}
            />
        </Tab.Navigator>
    );
}

function DrawerNavigator() {
    return (
        <Drawer.Navigator
            screenOptions={{
                drawerStyle: {
                    backgroundColor: '#FFFFFF',
                    width: 280,
                },
                drawerActiveBackgroundColor: '#4247BD20',
                drawerActiveTintColor: '#4247BD',
                drawerInactiveTintColor: '#666666',
            }}
        >
            <Drawer.Screen
                name="TabNavigator"
                component={TabNavigator}
                options={{
                    headerShown: false,
                    drawerIcon: ({ color }) => <Home size={24} color={color} />,
                    drawerLabel: 'Accueil'
                }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    drawerIcon: ({ color }) => <Settings size={24} color={color} />,
                    drawerLabel: 'Paramètres'
                }}
            />
            <Drawer.Screen
                name="Help"
                component={HelpScreen}
                options={{
                    drawerIcon: ({ color }) => <HelpCircle size={24} color={color} />,
                    drawerLabel: 'Aide'
                }}
            />
            <Drawer.Screen
                name="Logout"
                component={HomeScreen}
                options={{
                    drawerIcon: ({ color }) => <LogOut size={24} color={color} />,
                    drawerLabel: 'Déconnexion'
                }}
            />
        </Drawer.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                screenOptions={{
                    drawerStyle: {
                        backgroundColor: '#FFFFFF',
                        width: 280,
                    },
                    drawerActiveBackgroundColor: '#4247BD20',
                    drawerActiveTintColor: '#4247BD',
                    drawerInactiveTintColor: '#666666',
                }}
            >
                <Drawer.Screen
                    name="TabNavigator"
                    component={TabNavigator}
                    options={{
                        headerShown: false,
                        drawerIcon: ({ color }) => <Home size={24} color={color} />,
                        drawerLabel: 'Accueil'
                    }}
                />
                <Drawer.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        drawerIcon: ({ color }) => <Settings size={24} color={color} />,
                        drawerLabel: 'Paramètres'
                    }}
                />
                <Drawer.Screen
                    name="Help"
                    component={HelpScreen}
                    options={{
                        drawerIcon: ({ color }) => <HelpCircle size={24} color={color} />,
                        drawerLabel: 'Aide'
                    }}
                />
                <Drawer.Screen
                    name="Logout"
                    component={HomeScreen}
                    options={{
                        drawerIcon: ({ color }) => <LogOut size={24} color={color} />,
                        drawerLabel: 'Déconnexion'
                    }}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}