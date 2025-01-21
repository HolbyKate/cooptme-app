import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    TextInput,
    ActivityIndicator,
    Alert,
    SafeAreaView,
} from 'react-native';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const handleRegister = async () => {
        try {
            if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
                Alert.alert('Erreur', 'Veuillez remplir tous les champs');
                return;
            }

            setIsLoading(true);

            // Ici, vous pouvez ajouter l'appel à votre API d'inscription
            // await authService.register({ firstName, lastName, email, password });

            // Pour l'instant, on simule juste la connexion
            await login(email, password);

            navigation.replace('MainApp', {
                screen: 'TabNavigator',
                params: { screen: 'Dashboard' }
            });
        } catch (error) {
            Alert.alert(
                'Erreur',
                'Impossible de créer le compte. Veuillez réessayer.'
            );
        } finally {
            setIsLoading(false);
        }
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
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <ArrowLeft color="#FFFFFF" size={24} />
            </TouchableOpacity>

            <Text style={styles.title}>Créer un compte</Text>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Prénom"
                    placeholderTextColor="#999"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Nom"
                    placeholderTextColor="#999"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Mot de passe"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff size={24} color="#999" />
                        ) : (
                            <Eye size={24} color="#999" />
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleRegister}
                >
                    <Text style={styles.registerButtonText}>
                        Créer le compte
                    </Text>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>
                        Vous avez déjà un compte ?
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.replace('Login')}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={styles.loginLink}>Se connecter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4247BD',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4247BD',
    },
    backButton: {
        margin: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 30,
    },
    form: {
        paddingHorizontal: 20,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#333333',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginBottom: 20,
    },
    passwordInput: {
        flex: 1,
        padding: 15,
        fontSize: 16,
        color: '#333333',
    },
    eyeButton: {
        padding: 15,
    },
    registerButton: {
        backgroundColor: '#FF8F66',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    loginText: {
        color: '#FFFFFF',
        marginRight: 5,
    },
    loginLink: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});