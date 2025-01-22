import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { useEffect } from 'react';
import { setupNotifications } from './src/api/utils/notifications';

// Import des écrans
import HomeScreen from './src/screens/Auth/HomeScreen';
import LoginScreen from './src/screens/Auth/LoginScreen';
import ContactsScreen from './src/screens/Dashboard/ContactsScreen';
import CalendarScreen from './src/screens/Dashboard/CalendarScreen';
import ScanScreen from './src/screens/Scanner/ScanScreen';
import ChatScreen from './src/screens/Chat/ChatScreen';
import ChatConversationScreen from './src/screens/Chat/ChatConversationScreen';
import DrawerNavigator from '@/navigation/DrawerNavigator';
import ProfilesScreen from '@/screens/Dashboard/ProfilesScreen';
import JobScreen from '@/screens/Dashboard/JobScreen';
import EventsScreen from '@/screens/Dashboard/EventsScreen';
import { RootStackParamList } from './src/navigation/navigation';

// Définir les stacks
const Stack = createNativeStackNavigator<RootStackParamList>();

// Configuration de AppStack
function AppStack() {
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

// Configuration de AuthStack
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

// Configuration principale pour gérer Auth ou App
function RootNavigator() {
  const { isLoading, userToken } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4247BD" />
      </View>
    );
  }

  return userToken ? <AppStack /> : <AuthStack />;
}

// Application principale
export default function App() {
  useEffect(() => {
    setupNotifications().catch(console.error);
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
