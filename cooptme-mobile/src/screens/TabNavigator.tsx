import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View } from 'react-native';
import { Home, UsersRound, UserRound, CalendarDays, MessageCircle, ScanLine } from 'lucide-react-native';
import { MainTabParamList } from '../types/navigation';
import MyAccountScreen from './MyAccountScreen';
import DashboardScreen from './DashboardScreen';
import CalendarScreen from './CalendarScreen';
import ChatScreen from './ChatScreen';
import ScanScreen from './scanner/ScanScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#E0E0E0',
                    backgroundColor: '#FF8F66',
                    height: Platform.OS === 'ios' ? 80 : 60,
                    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    position: 'relative',
                    zIndex: 999,
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
                name="MyAccount"
                component={MyAccountScreen}
                options={{
                    tabBarLabel: 'Mon compte',
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
};

export default TabNavigator;