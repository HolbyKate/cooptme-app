import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import {
  Home,
  UsersRound,
  CalendarDays,
  MessageCircle,
  ScanLine,
  User,
  UserRound,
} from 'lucide-react-native';

// Import des écrans
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ContactsScreen from './src/screens/ContactsScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import ScanScreen from './src/screens/scanner/ScanScreen';
import ChatScreen from './src/screens/ChatScreen';
import MyAccountScreen from './src/screens/MyAccountScreen';
import LogoutScreen from './src/screens/drawer/LogoutScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ChatConversationScreen from './src/screens/ChatConversationScreen';
import HelpScreen from './src/screens/drawer/HelpScreen';
import SettingsScreen from './src/screens/drawer/SettingsScreen';
import { RootStackParamList, DrawerParamList, MainTabParamList } from './src/types/navigation';

// Définir les stacks et navigateurs
const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Configuration du TabNavigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4247BD',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: { backgroundColor: '#FFFFFF', height: 65 },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="MyAccount"
        component={MyAccountScreen}
        options={{
          tabBarLabel: 'Mon Compte',
          tabBarIcon: ({ color, size }) => <UserRound size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarLabel: 'Agenda',
          tabBarIcon: ({ color, size }) => <CalendarDays size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarLabel: 'Scanner',
          tabBarIcon: ({ color, size }) => <ScanLine size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Configuration du DrawerNavigator
function DrawerNavigator() {
    return (
        <Drawer.Navigator
            initialRouteName="TabNavigator"
            screenOptions={{
                headerShown: false, // Désactiver les en-têtes par défaut
            }}
        >
            <Drawer.Screen
                name="TabNavigator"
                component={TabNavigator}
                options={{ drawerLabel: 'Accueil' }}
            />
            <Drawer.Screen
                name="MyAccount"
                component={MyAccountScreen}
                options={{ drawerLabel: 'Mon Compte' }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ drawerLabel: 'Paramètres' }}
            />
            <Drawer.Screen
                name="Help"
                component={HelpScreen}
                options={{ drawerLabel: 'Aide' }}
            />
            <Drawer.Screen
                name="Logout"
                component={LogoutScreen}
                options={{ drawerLabel: 'Déconnexion' }}
            />
        </Drawer.Navigator>
    );
}

// Configuration de AppStack
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainApp" component={DrawerNavigator} />
      <Stack.Screen
        name="ChatConversation"
        component={ChatConversationScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}

// Configuration de AuthStack
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ animation: 'slide_from_right' }}
      />
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

