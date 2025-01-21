import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';

// Import des écrans
import HomeScreen from '../screens/Auth/HomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import DrawerNavigator from './DrawerNavigator';
import ContactsScreen from '../screens/Dashboard/ContactsScreen';
import ProfilesScreen from '../screens/Dashboard/ProfilesScreen';
import EventsScreen from '../screens/Dashboard/EventsScreen';
import CalendarScreen from '../screens/Dashboard/CalendarScreen';
import JobScreen from '../screens/Dashboard/JobScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import ChatConversationScreen from '../screens/Chat/ChatConversationScreen';
import ScanScreen from '../screens/Scanner/ScanScreen';
import LoadingScreen from '../screens/LoadingScreen';

import type { RootStackParamList } from './navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    // Routes non authentifiées
                    <>
                        <Stack.Screen
                            name="Home"
                            component={HomeScreen}
                        />
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                        />
                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                        />
                    </>
                ) : (
                    // Routes authentifiées
                    <>
                        <Stack.Screen
                            name="MainApp"
                            component={DrawerNavigator}
                        />
                        {/* Modals et écrans accessibles depuis n'importe où */}
                        <Stack.Group screenOptions={{ presentation: 'modal' }}>
                            <Stack.Screen name="Contacts" component={ContactsScreen} />
                            <Stack.Screen name="Profiles" component={ProfilesScreen} />
                            <Stack.Screen name="Events" component={EventsScreen} />
                            <Stack.Screen name="Calendar" component={CalendarScreen} />
                            <Stack.Screen name="Job" component={JobScreen} />
                            <Stack.Screen name="Chat" component={ChatScreen} />
                            <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
                            <Stack.Screen name="Scan" component={ScanScreen} />
                        </Stack.Group>
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}