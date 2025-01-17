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
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { AuthContext } from '../contexts/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import * as WebBrowser from 'expo-web-browser';
import Svg, { Path } from 'react-native-svg';
import apiService, { API_URL } from '../services/api';

WebBrowser.maybeCompleteAuthSession();

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const googleConfig = {
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  expoClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};

const linkedInConfig = {
  clientId: process.env.EXPO_PUBLIC_LINKEDIN_CLIENT_ID || '',
  redirectUri: makeRedirectUri({
    scheme: 'your-scheme',
    path: 'linkedin-auth',
  }),
  scopes: ['r_liteprofile', 'r_emailaddress'],
};

const discovery = {
  authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
  tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
  revocationEndpoint: 'https://www.linkedin.com/oauth/v2/revoke',
};

const GoogleIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
    />
    <Path
      fill="#34A853"
      d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62z"
    />
    <Path
      fill="#FBBC05"
      d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29v-3.09h-3.98c-.82 1.62-1.29 3.44-1.29 5.38s.47 3.76 1.29 5.38l3.98-3.09z"
    />
    <Path
      fill="#EA4335"
      d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42c-2.07-1.94-4.78-3.13-8.02-3.13-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
    />
  </Svg>
);

const LinkedInIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Path
      fill="#FFFFFF"
      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    />
  </Svg>
);

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn } = useContext(AuthContext);
  const [name, setName] = useState('');

  // Google Auth
  const [request, response, promptGoogleAsync] = Google.useAuthRequest({
    androidClientId: googleConfig.androidClientId,
    iosClientId: googleConfig.iosClientId,
    webClientId: googleConfig.webClientId,
    clientId: googleConfig.expoClientId,
  });

  // LinkedIn Auth
  const [linkedInRequest, linkedInResponse, promptLinkedInAsync] = useAuthRequest(
    {
      clientId: linkedInConfig.clientId,
      scopes: linkedInConfig.scopes,
      redirectUri: linkedInConfig.redirectUri,
    },
    discovery
  );

  const navigateToMain = () => {
    navigation.replace('MainApp', {
      screen: 'MainTabs',
      params: { screen: 'Dashboard' }
    });
  };

  const handleEmailAuth = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      // Ajoutez ici une redirection immédiate
      console.log('Connexion réussie (mock)');
      navigateToMain(); // Navigue vers l'écran principal directement

    } catch (error) {
      console.error('Erreur simulée:', error);
      setErrorMessage('Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const result = await promptGoogleAsync();
      if (result?.type === 'success' && result.authentication) {
        const response = await apiService.auth.socialLogin({
          type: 'google',
          token: result.authentication.accessToken,
          email: ''
        });

        if (response.success && response.token) {
          await apiService.helpers.setToken(response.token);
          await signIn(response.token);
          navigateToMain();
        }
      }
    } catch (error: any) {
      console.error('Erreur Google:', error);
      setErrorMessage('Erreur de connexion avec Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const result = await promptLinkedInAsync();
      if (result?.type === 'success') {
        const { access_token } = result.params;
        const response = await apiService.auth.socialLogin({
          type: 'linkedin',
          token: access_token,
          email: ''
        });

        if (response.success && response.token) {
          await apiService.helpers.setToken(response.token);
          await signIn(response.token);
          navigateToMain();
        }
      }
    } catch (error: any) {
      console.error('Erreur LinkedIn:', error);
      setErrorMessage('Erreur de connexion avec LinkedIn');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMessage('Veuillez entrer votre email');
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiService.auth.forgotPassword(email);
      if (response.success) {
        setErrorMessage('Un email de réinitialisation a été envoyé');
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.error ||
        'Erreur lors de l\'envoi de l\'email'
      );
    } finally {
      setIsLoading(false);
    }
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
            <TextInput
              style={styles.input}
              placeholder="Nom complet"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#666"
              autoCapitalize="words"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#666"
            autoComplete="email"
          />

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#666"
            autoComplete="password"
          />

          {isLogin && (
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
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

          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>ou</Text>
            <View style={styles.separatorLine} />
          </View>

          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <View style={styles.socialButtonContent}>
              <GoogleIcon />
              <Text style={styles.googleButtonText}>
                Continuer avec Google
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, styles.linkedinButton]}
            onPress={handleLinkedInSignIn}
            disabled={isLoading}
          >
            <View style={styles.socialButtonContent}>
              <LinkedInIcon />
              <Text style={styles.linkedinButtonText}>
                Continuer avec LinkedIn
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              setIsLogin(!isLogin);
              setErrorMessage('');
              setEmail('');
              setPassword('');
              setName('');
            }}
          >
            <Text style={styles.switchButtonText}>
              {isLogin
                ? 'Vous n\'avez pas de compte ? Inscrivez-vous'
                : 'Déjà un compte ? Connectez-vous'}
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
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  separatorText: {
    color: '#FFFFFF',
    paddingHorizontal: 10,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    marginRight: 10,
  },
  socialButton: {
    width: '100%',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkedinButton: {
    backgroundColor: '#0077B5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  linkedinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -10,
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
});