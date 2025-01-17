import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://192.168.31.149:3000/api';

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

// Request interceptor to add token
api.interceptors.request.use(
  config => {
    console.log('🚀 Request:', {
      url: config.url,
      method: config.method,
      data: config.data
    });
    return config;
  },
  error => {
    console.log('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse
api.interceptors.response.use(
  response => {
    console.log('✅ Response:', response.data);
    return response;
  },
  error => {
    console.log('❌ Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
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
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    },

    register: async (data: RegisterData): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>('/auth/register', data);
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    },

    socialLogin: async (data: SocialLoginData): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>('/auth/social-login', data);
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
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
      await api.post('/auth/logout');
    },
  },

  jobs: {
    fetchJobs: async (searchParams?: JobSearchParams): Promise<JobOffer[]> => {
      const queryParams = new URLSearchParams();
      if (searchParams?.term) queryParams.append('term', searchParams.term);
      if (searchParams?.location) queryParams.append('location', searchParams.location);

      const response = await api.get<JobOffer[]>(`/jobs?${queryParams}`);
      return response.data;
    },

    uploadJobsCSV: async (file: FormData): Promise<{ success: boolean }> => {
      const response = await api.post('/jobs/upload', file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
  },

  user: {
    getCurrentUser: async (): Promise<User> => {
      const response = await api.get<User>('/user/me');
      return response.data;
    },

    updateProfile: async (userData: Partial<User>): Promise<User> => {
      const response = await api.put<User>('/user/profile', userData);
      return response.data;
    },
  },

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