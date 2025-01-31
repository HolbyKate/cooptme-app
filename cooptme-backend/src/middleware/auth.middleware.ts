/**
 * Authentication utility functions for React Native applications.
 * Handles JWT token management and verification.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode as atob } from 'base-64';

interface DecodedToken {
  userId: string;
  email: string;
  exp: number;
  iat: number;
}

/**
 * Retrieves the authentication token from AsyncStorage.
 * @returns {Promise<string | null>} The authentication token or null if not found.
 */
export const getAuthToken = async () => {
  return await AsyncStorage.getItem("userToken");
};

export const verifyToken = (token: string) => {
  try {

    const [, payload] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload)) as DecodedToken;
    const currentTime = Date.now() / 1000;

    if (decodedPayload.exp < currentTime) {
      throw new Error("Token expiré");
    }

    return decodedPayload;
  } catch (error) {
    throw new Error("Token invalide");
  }
};

export const requireAuth = async () => {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Non authentifié");
  }
  return verifyToken(token);
};
