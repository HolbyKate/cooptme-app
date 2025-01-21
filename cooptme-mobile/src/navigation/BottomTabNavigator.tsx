import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import CalendarScreen from '../screens/Dashboard/CalendarScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import ScanScreen from '../screens/Scanner/ScanScreen';
import { Home, UsersRound, CalendarDays, MessageCircle, ScanLine } from 'lucide-react-native';
import MyAccountScreen from '@/screens/User/MyAccountScreen';

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <BottomTab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#0066FF',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            }}
        >
            <BottomTab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarLabel: 'Accueil',
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                }}
            />
            <BottomTab.Screen
                name="MyAccount"
                component={MyAccountScreen}
                options={{
                    tabBarLabel: 'Mon compte',
                    tabBarIcon: ({ color, size }) => <UsersRound size={size} color={color} />,
                }}
            />
            <BottomTab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    tabBarLabel: 'Agenda',
                    tabBarIcon: ({ color, size }) => <CalendarDays size={size} color={color} />,
                }}
            />
            <BottomTab.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    tabBarLabel: 'Messages',
                    tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
                }}
            />
            <BottomTab.Screen
                name="Scan"
                component={ScanScreen}
                options={{
                    tabBarLabel: 'Scanner',
                    tabBarIcon: ({ color, size }) => <ScanLine size={size} color={color} />,
                }}
            />
        </BottomTab.Navigator>
    );
}
