import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from '../navigation/DrawerNavigator';
import ContactsScreen from './Dashboard/ContactsScreen';
import ProfilesScreen from './Dashboard/ProfilesScreen';
import EventsScreen from './Dashboard/EventsScreen';
import CalendarScreen from './Dashboard/CalendarScreen';
import JobScreen from './Dashboard/JobScreen';
import ChatConversationScreen from './Chat/ChatConversationScreen';
import ScanScreen from './Scanner/ScanScreen';
import { RootStackParamList } from '../navigation/navigation';
import ChatScreen from './Chat/ChatScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function MainApp() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainApp" component={DrawerNavigator} />
            <Stack.Screen name="Contacts" component={ContactsScreen} />
            <Stack.Screen name="Profiles" component={ProfilesScreen} />
            <Stack.Screen name="Events" component={EventsScreen} />
            <Stack.Screen name="Calendar" component={CalendarScreen} />
            <Stack.Screen name="Job" component={JobScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Scan" component={ScanScreen} />
            <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
        </Stack.Navigator>
    );
}

