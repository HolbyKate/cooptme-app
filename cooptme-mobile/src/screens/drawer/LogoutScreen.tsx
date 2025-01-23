import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { ArrowLeft, LogOut } from 'lucide-react-native';

export default function LogoutScreen() {
    const { signOut, isLoading } = useAuth();
    const navigation = useNavigation();

    const handleLogout = () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Déconnexion',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut();
                            // Reset la navigation vers Home (écran d'accueil)
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'Home' }],
                                })
                            );
                        } catch (error) {
                            console.error('Erreur lors de la déconnexion :', error);
                            Alert.alert(
                                'Erreur',
                                'Impossible de se déconnecter. Veuillez réessayer.'
                            );
                        }
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4247BD" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <ArrowLeft color="#4247BD" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>Déconnexion</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.content}>
                <View style={styles.messageContainer}>
                    <LogOut color="#4247BD" size={48} style={styles.icon} />
                    <Text style={styles.message}>
                        Êtes-vous sûr de vouloir vous déconnecter ?
                    </Text>
                    <Text style={styles.submessage}>
                        Vous pourrez toujours vous reconnecter plus tard.
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.cancelButtonText}>Annuler</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutText}>Se déconnecter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#4247BD',
        fontFamily: 'Quicksand-Bold',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
    },
    messageContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    icon: {
        marginBottom: 20,
    },
    message: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4247BD',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'Quicksand-Bold',
    },
    submessage: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        fontFamily: 'Quicksand-Regular',
    },
    buttonContainer: {
        gap: 12,
    },
    cancelButton: {
        padding: 15,
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#4B5563',
        fontWeight: '600',
        fontSize: 16,
        fontFamily: 'Quicksand-Bold',
    },
    logoutButton: {
        padding: 15,
        backgroundColor: '#FF6666',
        borderRadius: 10,
        alignItems: 'center',
    },
    logoutText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
        fontFamily: 'Quicksand-Bold',
    },
});