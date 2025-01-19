import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert
} from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as LinkedIn from 'expo-auth-session/providers/linkedin';
import { googleConfig, linkedInConfig, discovery } from '../config/oauth';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth.service';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  // Configuration Google OAuth
  const [, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    androidClientId: googleConfig.androidClientId,
    iosClientId: googleConfig.iosClientId,
    clientId: googleConfig.expoClientId
  });

  // Configuration LinkedIn OAuth
  const [, linkedInResponse, promptLinkedInAsync] = LinkedIn.useAuthRequest({
    clientId: linkedInConfig.clientId,
    redirectUri: linkedInConfig.redirectUri,
    scopes: linkedInConfig.scopes
  }, discovery);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const result = await promptGoogleAsync();

      if (result?.type === 'success') {
        const { authentication } = result;
        const response = await authService.socialLogin({
          type: 'google',
          token: authentication?.accessToken || '',
          email: ''
        });

        await signIn(response.token, response.email);
        navigation.replace('MainApp');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se connecter avec Google');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInLogin = async () => {
    try {
      setIsLoading(true);
      const result = await promptLinkedInAsync();

      if (result?.type === 'success') {
        const { access_token } = result.params;
        const response = await authService.socialLogin({
          type: 'linkedin',
          token: access_token,
          email: ''
        });

        await signIn(response.token);
        navigation.replace('MainApp');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se connecter avec LinkedIn');
      console.error(error);
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
      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleLogin}
      >
        <Text style={styles.googleButtonText}>Se connecter avec Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkedinButton}
        onPress={handleLinkedInLogin}
      >
        <Text style={styles.linkedinButtonText}>Se connecter avec LinkedIn</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4247BD'
  },
  googleButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center'
  },
  linkedinButton: {
    width: '100%',
    backgroundColor: '#0077B5',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center'
  },
  googleButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600'
  },
  linkedinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  }
});