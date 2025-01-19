import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import MainAppScreen from '../screens/MainAppScreen';
import EventsScreen from '../screens/EventsScreen';
import JobListScreen from '../screens/JobScreen';
import ScanScreen from '../screens/scanner/ScanScreen';
import ProfileDetailScreen from '../screens/ProfileDetailScreen';
import ProfilesScreen from '../screens/ProfilesScreen';
import ChatConversationScreen from '../screens/ChatConversationScreen';
import { RootStackParamList } from '../types/navigation';
import ContactsScreen from '../screens/ContactsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import MyAccountScreen from '../screens/MyAccountScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                    animation: 'slide_from_right',
                    animationDuration: 200,
                    presentation: 'card',
                }}
            >
                {/* Écrans d'authentification */}
                <Stack.Group>
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{
                            animationTypeForReplace: 'pop',
                        }}
                    />
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{
                            gestureEnabled: false,
                        }}
                    />
                </Stack.Group>

                {/* Application principale */}
                <Stack.Group screenOptions={{ gestureEnabled: false }}>
                    <Stack.Screen
                        name="MainApp"
                        component={MainAppScreen}
                    />
                </Stack.Group>

                {/* Écrans secondaires */}
                <Stack.Group screenOptions={{
                    presentation: 'card',
                    gestureEnabled: true,
                }}>
                    <Stack.Screen name="MyAccount" component={MyAccountScreen} />
                    <Stack.Screen name="Contacts" component={ContactsScreen} />
                    <Stack.Screen name="Profiles" component={ProfilesScreen} />
                    <Stack.Screen name="Events" component={EventsScreen} />
                    <Stack.Screen name="Calendar" component={CalendarScreen} />
                    <Stack.Screen name="JobList" component={JobListScreen} />
                    <Stack.Screen name="Scan" component={ScanScreen} />
                    <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
                    <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    );
}