import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import { useAuth } from '../contexts/AuthContext';

export type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    Dashboard: undefined;
};

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const { isAuthenticated } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Dashboard" component={DashboardScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}