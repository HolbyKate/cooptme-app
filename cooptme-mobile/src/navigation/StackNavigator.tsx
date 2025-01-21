import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import ContactsScreen from '../screens/Dashboard/ContactsScreen';
import ProfilesScreen from '../screens/Dashboard/ProfilesScreen';
import EventsScreen from '../screens/Dashboard/EventsScreen';
import JobScreen from '../screens/Dashboard/JobScreen';
import { RootStackParamList } from '../navigation/navigation';
import CalendarScreen from '@/screens/Dashboard/CalendarScreen';
import ScanScreen from '@/screens/Scanner/ScanScreen';
import ChatScreen from '@/screens/Chat/ChatScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function MainApp() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Intégration du Drawer */}
            <Stack.Screen name="MainApp" component={DrawerNavigator} />

            {/* Écrans secondaires */}
            <Stack.Screen name="Contacts" component={ContactsScreen} />
            <Stack.Screen name="Profiles" component={ProfilesScreen} />
            <Stack.Screen name="Events" component={EventsScreen} />
            <Stack.Screen name="Calendar" component={CalendarScreen} />
            <Stack.Screen name="Job" component={JobScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Scan" component={ScanScreen} />
        </Stack.Navigator>
    );
}

