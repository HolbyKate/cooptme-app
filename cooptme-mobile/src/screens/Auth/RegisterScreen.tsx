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
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export default function RegisterScreen({ navigation }: Props) {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const { register, isLoading, isError } = useAuth();

    const validateForm = () => {
        if (!formData.firstName.trim() || !formData.lastName.trim() ||
            !formData.email.trim() || !formData.password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return false;
        }

        if (!formData.email.includes('@')) {
            Alert.alert('Erreur', 'Veuillez entrer un email valide');
            return false;
        }

        if (formData.password.length < 6) {
            Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        try {
            await register(
                formData.email,
                formData.password,
                formData.firstName,
                formData.lastName
            );
            // La navigation sera gérée par le contexte via AppNavigator
        } catch (error) {
            Alert.alert(
                'Erreur',
                isError || 'Impossible de créer le compte. Veuillez réessayer.'
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
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
                        value={formData.firstName}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
                        autoCapitalize="words"
                        testID="firstname-input"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Nom"
                        placeholderTextColor="#999"
                        value={formData.lastName}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
                        autoCapitalize="words"
                        testID="lastname-input"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        value={formData.email}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        testID="email-input"
                    />

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Mot de passe"
                            placeholderTextColor="#999"
                            value={formData.password}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            testID="password-input"
                        />
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setShowPassword(!showPassword)}
                            testID="toggle-password-visibility"
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
                        disabled={isLoading}
                        testID="register-button"
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.registerButtonText}>
                                Créer le compte
                            </Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>
                            Vous avez déjà un compte ?
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.replace('Login')}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            testID="login-link"
                        >
                            <Text style={styles.loginLink}>Se connecter</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4247BD',
    },
    keyboardAvoid: {
        flex: 1,
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
        fontFamily: 'Quicksand-Bold',
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
        fontFamily: 'Quicksand-Regular',
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
        fontFamily: 'Quicksand-Regular',
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
        fontFamily: 'Quicksand-Bold',
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
        fontFamily: 'Quicksand-Regular',
    },
    loginLink: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        fontFamily: 'Quicksand-Bold',
    },
});