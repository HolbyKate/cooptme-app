// Creation de contexte d'authentifictaion
import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../api/config/axios';
import { authService } from '../api/services/auth/auth.api.service';

type AuthContextType = {
  signIn: (token: string, email: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  userToken: string | null;
  userEmail: string | null;
  isLoading: boolean;
  isError: string | null;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const initializeAuth = async () => {
  try {
    setIsLoading(true);
    setIsAuthenticated(false);
    const [savedToken, savedEmail] = await Promise.all([
      AsyncStorage.getItem('userToken'),
      AsyncStorage.getItem('userEmail'),
    ]);

    if (savedToken) {
      setUserToken(savedToken);
      setUserEmail(savedEmail);
      setIsAuthenticated(true);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    } else {
      setUserToken(null);
      setUserEmail(null);
      setIsAuthenticated(false);
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
    await cleanAuth();
  } finally {
    setIsLoading(false);
  }
};

  // Fonction utilitaire pour nettoyer l'état d'authentification
  const cleanAuth = async (): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.removeItem('userToken'),
      AsyncStorage.removeItem('userEmail'),
    ]);
    delete axiosInstance.defaults.headers.common['Authorization'];
    setUserToken(null);
    setUserEmail(null);
    setIsAuthenticated(false);
  } catch (error) {
    console.error('Error cleaning auth:', error);
    throw error;
  }
};

  const signIn = React.useCallback(async (token: string, email: string) => {
  try {
    setIsError(null);
    if (!token || !email) throw new Error('Token ou email manquant');

    await Promise.all([
      AsyncStorage.setItem('userToken', token),
      AsyncStorage.setItem('userEmail', email),
    ]);

    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUserToken(token);
    setUserEmail(email);
    setIsAuthenticated(true);
  } catch (error) {
    console.error('Error during sign-in:', error);
    setIsError(error instanceof Error ? error.message : 'Erreur de connexion');
    throw error;
  }
}, []);

  const login = async (email: string, password: string) => {
  try {
    setIsLoading(true);
    setIsError(null);
    const response = await authService.emailLogin(email, password);

    if (!response.token) throw new Error("Aucun token retourné par le serveur");

    await signIn(response.token, email);
  } catch (error: any) {
    console.error('Error during login:', error);
    const errorMessage =
      error?.response?.data?.message ||
      error.message ||
      'Une erreur inconnue est survenue';
    setIsError(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  const googleLogin = async (token: string) => {
    try {
      setIsLoading(true);
      setIsError(null);
      const response = await authService.googleLogin(token);
      await signIn(response.token, response.user.email);
    } catch (error: any) {
      setIsError(error.message || 'Erreur de connexion Google');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setIsLoading(true);
      setIsError(null);
      const response = await authService.register({ email, password, firstName, lastName });
      await signIn(response.token, email);
    } catch (error: any) {
      setIsError(error.message || 'Erreur d\'inscription');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await cleanAuth();
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
        googleLogin,
        register,
        signOut,
        initializeAuth,
        userToken,
        userEmail,
        isLoading,
        isError,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
