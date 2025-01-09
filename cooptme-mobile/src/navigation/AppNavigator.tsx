import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import MainAppScreen from '../screens/MainAppScreen';
import EventsScreen from '../screens/EventsScreen';
import JobScreen from '../screens/JobsScreen';
import ScanScreen from '../screens/scanner/ScanScreen';
import ProfileDetailScreen from '../screens/ProfileDetailScreen';
import ChatConversationScreen from '../screens/ChatConversationScreen';
import { RootStackParamList } from '../types/navigation';

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
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="MainApp" component={MainAppScreen} />
                <Stack.Screen name="Events" component={EventsScreen} />
                <Stack.Screen name="JobList" component={JobScreen} />
                <Stack.Screen name="Scan" component={ScanScreen} />
                <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
                <Stack.Screen
                    name="ChatConversation"
                    component={ChatConversationScreen as React.ComponentType<any>}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}