import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// URL de base dynamique selon la plateforme
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000/api';
    }
    return 'http://localhost:3000/api';
  }
  return 'http://192.168.31.149:3000/api';
};

export const API_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface SocialLoginData {
  type: 'google' | 'apple' | 'linkedin';
  token: string;
  email: string;
  name?: string;
}

export interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  contractType: string;
  salary?: string;
  postedDate: string;
  url?: string;
}

export interface JobSearchParams {
  term?: string;
  location?: string;
}

// Initialiser le token au démarrage
const initializeApi = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error initializing API:', error);
  }
};

initializeApi();

// Request interceptor
api.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('🚀 Request:', {
        url: config.url,
        method: config.method,
        data: config.data,
        baseURL: config.baseURL
      });
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  error => {
    console.log('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => {
    console.log('✅ Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.log('❌ Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      if (response.data.token) {
        await apiService.helpers.setToken(response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    },

    register: async (data: RegisterData): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>('/auth/register', data);
      if (response.data.token) {
        await apiService.helpers.setToken(response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    },

    socialLogin: async (data: SocialLoginData): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>('/auth/social-login', data);
      if (response.data.token) {
        await apiService.helpers.setToken(response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    },

    forgotPassword: async (email: string): Promise<{ success: boolean }> => {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    },

    logout: async (): Promise<void> => {
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      await apiService.helpers.clearToken();
      await api.post('/auth/logout');
    },
  },

  // ... rest of your API methods remain the same ...

  helpers: {
    setToken: async (token: string) => {
      await AsyncStorage.setItem('userToken', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    clearToken: async () => {
      await AsyncStorage.removeItem('userToken');
      delete api.defaults.headers.common['Authorization'];
    },

    getToken: async () => {
      return await AsyncStorage.getItem('userToken');
    },
  },
};

export default apiService;