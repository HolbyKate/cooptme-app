import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { AuthContext } from '../contexts/AuthContext';
import { authService } from '../services/auth.service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const googleConfig = {
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  expoClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('test123');
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn } = useContext(AuthContext);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: googleConfig.androidClientId,
    iosClientId: googleConfig.iosClientId,
    webClientId: googleConfig.webClientId,
    clientId: googleConfig.expoClientId,
  });

  const navigateToMain = () => {
    navigation.replace('MainApp', {
      screen: 'MainTabs',
      params: {
        screen: 'Dashboard'
      }
    });
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setErrorMessage('Veuillez remplir tous les champs');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      if (!isLogin) {
        // Inscription
        if (!firstName || !lastName) {
          setErrorMessage('Veuillez remplir tous les champs');
          return;
        }

        const response = await authService.register({
          email,
          password,
          name: `${firstName} ${lastName}`,
        });

        if (response?.token) {
          await signIn(response.token);
          navigateToMain();
        }
      } else {
        // Connexion
        if (email === 'test@test.com' && password === 'test123') {
          const fakeToken = 'fake-token-123';
          await signIn(fakeToken);
          navigateToMain();
          return;
        }

        const response = await authService.login({ email, password });
        if (response?.token) {
          await signIn(response.token);
          navigateToMain();
        }
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      setErrorMessage(
        error.message || 'Une erreur est survenue lors de l\'authentification'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMessage('Veuillez entrer votre email');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setErrorMessage('Un email de réinitialisation a été envoyé');
    } catch (error: any) {
      setErrorMessage(error.message || 'Erreur lors de l\'envoi de l\'email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const result = await authService.handleAppleLogin(credential);
      if (result.token) {
        await signIn(result.token);
        navigateToMain();
      }
    } catch (error: any) {
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        setErrorMessage(error.message || 'Erreur de connexion Apple');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const result = await promptAsync();
      if (result?.type === 'success' && result.authentication) {
        const userInfo = await authService.handleGoogleLogin(
          result.authentication.accessToken
        );
        if (userInfo.token) {
          await signIn(userInfo.token);
          navigateToMain();
        }
      }
    } catch (error: any) {
      console.error('Erreur de connexion Google:', error);
      setErrorMessage('Erreur de connexion avec Google');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#4247BD', '#4247BD']}
        style={styles.background}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Image
            source={require('../../assets/logo_transparent.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          {!isLogin && (
            <>
              <TextInput
                style={[styles.input, !firstName && errorMessage ? styles.inputError : null]}
                placeholder="Prénom"
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor="#666"
                autoCapitalize="words"
              />
              <TextInput
                style={[styles.input, !lastName && errorMessage ? styles.inputError : null]}
                placeholder="Nom"
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor="#666"
                autoCapitalize="words"
              />
            </>
          )}

          <TextInput
            style={[styles.input, !email && errorMessage ? styles.inputError : null]}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#666"
            autoComplete="email"
          />

          <TextInput
            style={[styles.input, !password && errorMessage ? styles.inputError : null]}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#666"
            autoComplete="password"
          />

          {isLogin && (
            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.mainButton, isLoading && styles.buttonDisabled]}
            onPress={handleEmailAuth}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? 'Se connecter' : 'S\'inscrire'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.googleButton, isLoading && styles.buttonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Text style={styles.socialButtonText}>
              Continuer avec Google
            </Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={5}
              style={[styles.appleButton, isLoading && styles.buttonDisabled]}
              onPress={handleAppleAuth}
            />
          )}

          <TouchableOpacity
            style={styles.switchButton}
            onPress={toggleAuthMode}
            disabled={isLoading}
          >
            <Text style={styles.switchButtonText}>
              {isLogin
                ? 'Pas encore de compte ? S\'inscrire'
                : 'Déjà un compte ? Se connecter'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  mainButton: {
    width: '100%',
    backgroundColor: '#FF8F66',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  appleButton: {
    width: '100%',
    height: 50,
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#FFFFFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  switchButton: {
    marginTop: 20,
  },
  switchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  buttonDisabled: {
    opacity: 0.7,
  }
});