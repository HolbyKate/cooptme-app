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
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import * as Google from 'expo-auth-session/providers/google';
import { googleConfig } from '../api/config/oauth';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../api/services/auth/auth.api.service';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez entrer un email et un mot de passe');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔑 Tentative de connexion pour:', email);

      const response = await authService.emailLogin(email, password);
      console.log('📨 Réponse reçue:', response);

      if (!response.token) {
        throw new Error('Token manquant dans la réponse');
      }

      await login(email, password);
      console.log('✅ Connexion réussie');
      navigation.replace('MainApp');
    } catch (error: any) {
      console.error('❌ Erreur détaillée:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      let errorMessage = 'Impossible de se connecter. Veuillez réessayer.';
      if (error.response?.status === 404) {
        errorMessage = 'Email non trouvé';
      } else if (error.response?.status === 401) {
        errorMessage = 'Email ou mot de passe incorrect';
      }

      Alert.alert('Erreur de connexion', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Configuration Google OAuth
  const [, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    androidClientId: googleConfig.androidClientId,
    iosClientId: googleConfig.iosClientId,
    clientId: googleConfig.expoClientId,
    scopes: ['profile', 'email'],
  });

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      console.log('🔑 Tentative de connexion Google');
      const result = await promptGoogleAsync();

      if (result?.type === 'success') {
        const { authentication } = result;
        console.log('📱 Token Google obtenu');

        const response = await authService.googleLogin(authentication?.accessToken || '');
        console.log('📨 Réponse serveur reçue');

        await login(response.email, '');  // Mot de passe vide pour login Google
        console.log('✅ Connexion Google réussie');
        navigation.replace('MainApp');
      }
    } catch (error: any) {
      console.error('❌ Erreur Google Login:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      Alert.alert('Erreur', 'Impossible de se connecter avec Google');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4247BD" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo_transparent.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Mot de passe"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
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

      <TouchableOpacity style={styles.loginButton} onPress={handleEmailLogin}>
        <Text style={styles.loginButtonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Text style={styles.googleButtonText}>Se connecter avec Google</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Vous n'avez pas de compte ?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signupLink}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    backgroundColor: '#0066CC',
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
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    color: '#FFFFFF',
    marginRight: 5,
  },
  signupLink: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});