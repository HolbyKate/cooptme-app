import React, {
  createContext,
  useContext as reactUseContext,
  useEffect as reactUseEffect,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../api/config/axios';

type AuthContextType = {
  signIn: (token: string, email: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  userToken: string | null;
  userEmail: string | null;
  isLoading: boolean;
  isAuthenticated: boolean; // Ajout d'un état pour suivre l'authentification
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = reactUseContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication state from AsyncStorage
  reactUseEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('userToken');
        const savedEmail = await AsyncStorage.getItem('userEmail');
        if (savedToken) {
          setUserToken(savedToken);
          setUserEmail(savedEmail);
          setIsAuthenticated(true);
          // Configure axios avec le token
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // En cas d'erreur, on nettoie tout
        await signOut();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Tentative de connexion pour:', email);
      const response = await axiosInstance.post('/auth/login', { email, password });

      if (response.data.token) {
        await signIn(response.data.token, email);
      } else {
        throw new Error('Token non reçu du serveur');
      }
    } catch (error: any) {
      console.error('Erreur login:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  };

  const signIn = async (token: string, email: string) => {
    try {
      if (!token || !email) {
        throw new Error('Token or email is missing');
      }
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userEmail', email);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUserToken(token);
      setUserEmail(email);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during sign-in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userEmail');
      delete axiosInstance.defaults.headers.common['Authorization'];
      setUserToken(null);
      setUserEmail(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during sign-out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        login,
        signOut,
        userToken,
        userEmail,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
