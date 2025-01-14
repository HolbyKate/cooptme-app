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
                }}>
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="Login" component={LoginScreen}/>
                <Stack.Screen name="MainApp" component={MainAppScreen}/>
                <Stack.Screen name="Contacts" component={ContactsScreen} options={{headerShown: true}}/>
                <Stack.Screen name="Profiles" component={ProfilesScreen} options={{headerShown: true}}/>
                <Stack.Screen name="Events" component={EventsScreen}/>
                <Stack.Screen name="Calendar" component={CalendarScreen} options={{headerShown: true}}/>
                <Stack.Screen name="JobList" component={JobListScreen}/>
                <Stack.Screen name="Scan" component={ScanScreen}/>
                <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen}/>
                <Stack.Screen name="ChatConversation" component={ChatConversationScreen as React.ComponentType<any>}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}