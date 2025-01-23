import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Image,
    ScrollView,
    Alert,
} from 'react-native';
import {
    Home,
    Users,
    MessageCircle,
    Settings,
    HelpCircle,
    LogOut,
    User,
} from 'lucide-react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';

export default function CustomDrawer(props: any) {
    const { signOut } = useAuth(); // Utilisation du contexte d'authentification

    const menuItems = [
        {
            icon: Home,
            label: 'Accueil',
            screen: 'Dashboard',
        },
        {
            icon: User,
            label: 'Mon compte',
            screen: 'MyAccount',
        },
        {
            icon: Settings,
            label: 'Paramètres',
            screen: 'Settings',
        },
        {
            icon: HelpCircle,
            label: 'Aide',
            screen: 'Help',
        },
    ];

    const navigateToScreen = (screenName: string) => {
        props.navigation.navigate(screenName);
    };

    const handleLogout = () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel',
                },
                {
                    text: 'Déconnecter',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut(); // Nettoie les données utilisateur via AuthContext
                        props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'DrawerRoot' }]
                    });
                },
            },
        ]
    );
};

    return (
        <LinearGradient
            colors={['#4247BD', '#4c51c6']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={styles.drawerContent}
            >
                {/* En-tête avec le logo */}
                <View style={styles.header}>
                    <Image
                        source={require('../../assets/logo_transparent.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Menu */}
                <ScrollView style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={() => navigateToScreen(item.screen)}
                        >
                            <View style={styles.iconContainer}>
                                <item.icon color="#fef9f9" size={24} strokeWidth={1.5} />
                            </View>
                            <Text style={styles.menuText}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Bouton de déconnexion */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <View style={styles.iconContainer}>
                        <LogOut color="#fef9f9" size={24} strokeWidth={1.5} />
                    </View>
                    <Text style={styles.logoutText}>Déconnexion</Text>
                </TouchableOpacity>
            </DrawerContentScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    drawerContent: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 40 : 60,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 20,
    },
    logo: {
        width: 120,
        height: 40,
    },
    menuContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        marginVertical: 5,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        backgroundColor: 'rgba(254, 249, 249, 0.1)',
    },
    menuText: {
        color: '#fef9f9',
        fontSize: 16,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 20,
    },
    logoutText: {
        color: '#fef9f9',
        fontSize: 16,
        fontWeight: '500',
    },
});
