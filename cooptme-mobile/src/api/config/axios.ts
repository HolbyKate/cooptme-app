// src/api/config/axios.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.127.198:3000'; // Home: 192.168.31.156 //village: 192.168.23.27 Esquirol: 10.3.3.75. REDmi: 192.168.127.198

// API principale (auth, users)
export const authApi = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// API for profiles (Prisma)
export const profileApi = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// API pour les contacts
export const contactsApi = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// API pour les jobs
export const jobApi = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Utility function to add logging interceptors to API instances
// Logs both requests and responses for debugging purposes
const addLogInterceptor = (apiInstance: any, name: string) => {
    apiInstance.interceptors.request.use(
        (config: any) => {
            console.log(`🚀 Requête ${name}:`, {
                baseURL: config.baseURL,
                url: config.url,
                method: config.method,
                data: config.data,
            });
            return config;
        },
        (error: any) => {
            console.error(`❌ Erreur requête ${name}:`, error);
            return Promise.reject(error);
        }
    );

    apiInstance.interceptors.response.use(
        (response: any) => {
            console.log(`✅ Réponse ${name}:`, response.data);
            return response;
        },
        (error: any) => {
            console.error(`❌ Erreur réponse ${name}:`, {
                message: error.message,
                status: error.response?.status,
                response: error.response?.data,
            });
            return Promise.reject(error);
        }
    );
};

// Ajout des intercepteurs à chaque instance
addLogInterceptor(authApi, 'Auth');
addLogInterceptor(profileApi, 'Profile');
addLogInterceptor(contactsApi, 'Contacts');

export default authApi; // Export par défaut pour la rétrocompatibilité