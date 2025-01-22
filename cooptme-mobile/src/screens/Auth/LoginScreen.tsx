import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import * as Google from 'expo-auth-session/providers/google';
import { googleConfig } from '../../api/config/oauth';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../api/services/auth/auth.api.service';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/navigation';
import { CommonActions } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  // Configuration Google OAuth
  const [request, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    androidClientId: googleConfig.androidClientId,
    iosClientId: googleConfig.iosClientId,
    clientId: googleConfig.expoClientId,
    scopes: ['profile', 'email'],
  });

  const navigateToDashboard = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'MainApp',
            state: {
              routes: [{ name: 'Dashboard' }]
            }
          }
        ]
      })
    );
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Erreur', 'Email et mot de passe sont obligatoires.');
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide.');
      return false;
    }
    return true;
  };

  const handleEmailLogin = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await authService.emailLogin(formData.email, formData.password);

      if (!response.token) {
        throw new Error('Token manquant dans la réponse');
      }

      await login(formData.email, formData.password);
      navigateToDashboard();
    } catch (error: any) {
      console.error('❌ Erreur de connexion:', error);

      let errorMessage = 'Impossible de se connecter. Veuillez réessayer.';
      
      if (error.response?.status === 404) {
        errorMessage = 'Email non trouvé.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Email ou mot de passe incorrect.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard.';
      }

      Alert.alert('Erreur de connexion', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const result = await promptGoogleAsync();

      if (result?.type === 'success' && result.authentication?.accessToken) {
        const response = await authService.googleLogin(result.authentication.accessToken);
        await login(response.user.email, '');
        navigateToDashboard();
      } else if (result?.type === 'cancel') {
        console.log('Connexion Google annulée par l\'utilisateur');
      }
    } catch (error: any) {
      console.error('❌ Erreur Google Login:', error);
      Alert.alert(
        'Erreur de connexion',
        'Impossible de se connecter avec Google. Veuillez réessayer.'
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Image
          source={require('../../../assets/logo_transparent.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          testID="email-input"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Mot de passe"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
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
          style={styles.loginButton}
          onPress={handleEmailLogin}
          testID="login-button"
        >
          <Text style={styles.loginButtonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          testID="google-login-button"
        >
          <Text style={styles.googleButtonText}>Se connecter avec Google</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Vous n'avez pas de compte ?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            testID="register-link"
          >
            <Text style={styles.registerLink}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4247BD',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4247BD',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333333',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
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
  loginButton: {
    width: '100%',
    backgroundColor: '#FF8F66',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  registerText: {
    color: '#FFFFFF',
    marginRight: 5,
  },
  registerLink: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});