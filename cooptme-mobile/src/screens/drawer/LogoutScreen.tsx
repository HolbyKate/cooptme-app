import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function LogoutScreen() {
    const { signOut } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Déconnexion',
                    onPress: async () => {
                        try {
                            await signOut();
                        } catch (error) {
                            console.error('Erreur lors de la déconnexion :', error);
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Vous serez déconnecté.</Text>
            <TouchableOpacity onPress={handleLogout}>
                <Text style={{ color: 'red' }}>Se déconnecter</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        color: '#4247BD',
    },
    logoutButton: {
        padding: 15,
        backgroundColor: '#FF6666',
        borderRadius: 10,
    },
    logoutText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});


