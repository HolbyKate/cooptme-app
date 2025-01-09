import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Switch,
    Platform,
    Image,
} from 'react-native';
import { ArrowLeft, Bell, Lock, Globe, Moon, HelpCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
    const navigation = useNavigation();
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#4247BD', '#4c51c6']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <ArrowLeft color="#FFFFFF" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Paramètres</Text>
                <Image
                    source={require('../../../assets/logo_blue.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </LinearGradient>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, {color: '#ff8f66'}]}>Général</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <View style={styles.iconContainer}>
                                <Bell color="#4247BD" size={24} strokeWidth={1.5} />
                            </View>
                            <Text style={styles.settingText}>Notifications</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: '#767577', true: '#4247BD' }}
                            thumbColor={notificationsEnabled ? '#fef9f9' : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <View style={styles.iconContainer}>
                                <Moon color="#4247BD" size={24} strokeWidth={1.5} />
                            </View>
                            <Text style={styles.settingText}>Mode sombre</Text>
                        </View>
                        <Switch
                            value={darkModeEnabled}
                            onValueChange={setDarkModeEnabled}
                            trackColor={{ false: '#767577', true: '#4247BD' }}
                            thumbColor={darkModeEnabled ? '#fef9f9' : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <View style={styles.iconContainer}>
                                <Globe color="#4247BD" size={24} strokeWidth={1.5} />
                            </View>
                            <Text style={styles.settingText}>Langue</Text>
                        </View>
                        <Text style={styles.settingValue}>Français</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, {color: '#ff8f66'}]}>Sécurité</Text>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <View style={styles.iconContainer}>
                                <Lock color="#4247BD" size={24} strokeWidth={1.5} />
                            </View>
                            <Text style={styles.settingText}>Modifier le mot de passe</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, {color: '#ff8f66'}]}>Aide</Text>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <View style={styles.iconContainer}>
                                <HelpCircle color="#4247BD" size={24} strokeWidth={1.5} />
                            </View>
                            <Text style={styles.settingText}>Centre d'aide</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fef9f9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 20 : 40,
        paddingBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        flex: 1,
    },
    logo: {
        width: 100,
        height: 40,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4247BD',
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(66, 71, 189, 0.1)',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(66, 71, 189, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    settingValue: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
});