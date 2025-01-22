// src/api/config/axios.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.23.27:3000';

// API principale (auth, users)
export const authApi = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// API pour les profiles (Prisma)
export const profileApi = axios.create({
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

// API pour les événements
export const eventApi = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Intercepteur global pour les logs
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
addLogInterceptor(jobApi, 'Job');
addLogInterceptor(eventApi, 'Event');

export default authApi; // Export par défaut pour la rétrocompatibilité