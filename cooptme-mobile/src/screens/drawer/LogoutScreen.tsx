// screens/LogoutScreen.tsx
import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { AuthContext } from '../../contexts/AuthContext';

type LogoutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LogoutScreen() {
    const navigation = useNavigation<LogoutScreenNavigationProp>();
    const { signOut } = useContext(AuthContext);

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await signOut();
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' as keyof RootStackParamList }],
                });
            } catch (error) {
                console.error('Erreur lors de la déconnexion:', error);
            }
        };

        handleLogout();
    }, [navigation, signOut]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#4247BD" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
});