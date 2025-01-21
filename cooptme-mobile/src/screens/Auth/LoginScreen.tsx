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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  // Configuration Google OAuth
  const [, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    androidClientId: googleConfig.androidClientId,
    iosClientId: googleConfig.iosClientId,
    clientId: googleConfig.expoClientId,
    scopes: ['profile', 'email'],
  });

  const handleEmailLogin = async () => {
  if (!email || !password) {
    Alert.alert('Erreur', 'Email et mot de passe sont obligatoires.');
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

    // Utilisez dispatch pour reset la navigation
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

      await login(response.email, '');
      console.log('✅ Connexion Google réussie');

      // Même approche que pour handleEmailLogin
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
  const handleRegisterPress = () => {
  console.log('Navigating to Register...');
  try {
    navigation.navigate('Register');
} catch (error) {
    console.error('Erreur de navigation :', error);
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

      <View style={styles.registerContainer}>
    <Text style={styles.registerText}>Vous n'avez pas de compte ?</Text>
    <TouchableOpacity onPress={handleRegisterPress}>
        <Text style={styles.registerLink}>Créer un compte</Text>
    </TouchableOpacity>
</View>
    </KeyboardAvoidingView>
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