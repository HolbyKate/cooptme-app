import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Home, UsersRound, CalendarDays, MessageCircle, ScanLine } from 'lucide-react-native';
import DashboardScreen from './DashboardScreen';
import ContactsScreen from './ContactsScreen';
import CalendarScreen from './CalendarScreen';
import ChatScreen from './ChatScreen';
import ScanScreen from './scanner/ScanScreen';
import CustomDrawer from '../components/CustomDrawer';
import SettingsScreen from './drawer/SettingsScreen';
import HelpScreen from './drawer/HelpScreen';
import LogoutScreen from './drawer/LogoutScreen';
import MyAccountScreen from './MyAccountScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    height: Platform.OS === 'ios' ? 85 : 65,
                    paddingTop: 10,
                    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
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
                    tabBarIcon: ({ color, size }: { color: string, size: number }) => (
                        <Home size={size} color={color} strokeWidth={1.5} />
                    ),
                }}
            />
            <Tab.Screen
                name="Contacts"
                component={ContactsScreen}
                options={{
                    tabBarLabel: 'Contacts',
                    tabBarIcon: ({ color, size }: { color: string, size: number }) => (
                        <UsersRound size={size} color={color} strokeWidth={1.5} />
                    ),
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    tabBarLabel: 'Agenda',
                    tabBarIcon: ({ color, size }: { color: string, size: number }) => (
                        <CalendarDays size={size} color={color} strokeWidth={1.5} />
                    ),
                }}
            />
            <Tab.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    tabBarLabel: 'Messages',
                    tabBarIcon: ({ color, size }: { color: string, size: number }) => (
                        <MessageCircle size={size} color={color} strokeWidth={1.5} />
                    ),
                }}
            />
            <Tab.Screen
                name="Scan"
                component={ScanScreen}
                options={{
                    tabBarLabel: 'Scanner',
                    tabBarIcon: ({ color, size }: { color: string, size: number }) => (
                        <ScanLine size={size} color={color} strokeWidth={1.5} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function MainAppScreen() {
    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    width: 280,
                },
            }}
        >
            <Drawer.Screen
                name="TabNavigator"
                component={TabNavigator}
                options={{ title: 'Accueil' }}
            />
            <Drawer.Screen
                name="MyAccount"
                component={MyAccountScreen}
                options={{ title: 'Mon compte' }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Paramètres' }}
            />
            <Drawer.Screen
                name="Help"
                component={HelpScreen}
                options={{ title: 'Aide' }}
            />
            <Drawer.Screen
                name="Logout"
                component={LogoutScreen}
                options={{ title: 'Déconnexion' }}
            />
        </Drawer.Navigator>
    );
}