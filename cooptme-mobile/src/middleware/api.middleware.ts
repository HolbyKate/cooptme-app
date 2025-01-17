import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from '../types';
import { Platform } from 'react-native';

const CONFIG = {
  API_URL: __DEV__
    ? Platform.OS === 'android'
      ? 'http://10.0.2.2:3000/api'  // Pour l'émulateur Android
      : 'http://localhost:3000/api'  // Pour iOS
    : 'https://votre-api-production.com/api',
  API_TIMEOUT: 30000,
  AUTH_ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GOOGLE: '/auth/google',
    APPLE: '/auth/apple',
    FORGOT_PASSWORD: '/auth/forgot-password'
  },
  STORAGE_KEYS: {
    USER_TOKEN: 'userToken',
    USER_DATA: 'userData'
  },
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL
};

export const apiClient = axios.create({
  baseURL: CONFIG.API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: CONFIG.API_TIMEOUT,
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('Erreur API détaillée:', {
      message: error.message,
      code: error.code,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers,
      },
      response: {
        status: error.response?.status,
        data: error.response?.data,
      }
    });

    if (error.message === 'Network Error') {
      throw new Error(
        'Impossible de se connecter au serveur. ' +
        'Vérifiez votre connexion internet et que le serveur est bien démarré. ' +
        'URL: ' + error.config?.url
      );
    }

    return Promise.reject(error);
  }
);

export { CONFIG };