import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View, StyleSheet } from 'react-native';
import { Home, UsersRound, CalendarDays, MessageCircle, ScanLine } from 'lucide-react-native';
import DashboardScreen from '../screens/DashboardScreen';
import ContactsScreen from '../screens/ContactsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ChatScreen from '../screens/ChatScreen';
import ScanScreen from '../screens/scanner/ScanScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    height: Platform.OS === 'ios' ? 80 : 60,
                    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
                    borderTopWidth: 1,
                    borderTopColor: '#E0E0E0',
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
                name="Calendar"
                component={CalendarScreen}
                options={{
                    tabBarLabel: 'Agenda',
                    tabBarIcon: ({ color, size }) => (
                        <CalendarDays size={size} color={color} strokeWidth={1.5} />
                    ),
                }}
            />
            <Tab.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    tabBarLabel: 'Messages',
                    tabBarIcon: ({ color, size }) => (
                        <MessageCircle size={size} color={color} strokeWidth={1.5} />
                    ),
                }}
            />
            <Tab.Screen
                name="Scan"
                component={ScanScreen}
                options={{
                    tabBarLabel: 'Scanner',
                    tabBarIcon: ({ color, size }) => (
                        <ScanLine size={size} color={color} strokeWidth={1.5} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}