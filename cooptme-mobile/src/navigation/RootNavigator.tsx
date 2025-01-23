// gère l'authentiifcation
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';

// Auth Screens
import HomeScreen from '../screens/Auth/HomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import LoadingScreen from '../screens/LoadingScreen';

// Main Screens
import DrawerNavigator from './DrawerNavigator';

// Modal Screens
import ContactsScreen from '../screens/Dashboard/ContactsScreen';
import EventsScreen from '../screens/Dashboard/EventsScreen';
import CalendarScreen from '../screens/Dashboard/CalendarScreen';
import JobScreen from '../screens/Dashboard/JobScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import ChatConversationScreen from '../screens/Chat/ChatConversationScreen';
import ScanScreen from '../screens/Scanner/ScanScreen';

import type { RootStackParamList } from './types';
import ProfilesScreen from '@/screens/Dashboard/ProfilesScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const { isAuthenticated, isLoading, initializeAuth } = useAuth();

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        initializeAuth();
        setIsInitialized(true);
    }, []);

    // Afficher un écran de chargement pendant l'initialisation de l'authentification
    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <Stack.Group>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </Stack.Group>
                ) : (
                    <Stack.Group>
                        <Stack.Screen name="DrawerRoot" component={DrawerNavigator} />
                    </Stack.Group>
                )}

                {/* Routes modales (accessibles depuis n'importe où) */}
                <Stack.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
                    <Stack.Screen name="Contacts" component={ContactsScreen} />
                    <Stack.Screen name="Profiles" component={ProfilesScreen} />
                    <Stack.Screen name="Events" component={EventsScreen} />
                    <Stack.Screen name="Calendar" component={CalendarScreen} />
                    <Stack.Screen name="Job" component={JobScreen} />
                    <Stack.Screen name="Chat" component={ChatScreen} />
                    <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
                    <Stack.Screen name="Scan" component={ScanScreen} />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
