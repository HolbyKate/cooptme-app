import axios from 'axios';
import { Platform } from 'react-native';

const getBaseUrl = () => {
    if (__DEV__) {
        if (Platform.OS === 'android') {
            return 'http://192.168.31.156:3000/api';
        }
        return 'http://localhost:3000/api';
    }
    return 'http://192.168.31.149:3000/api'; // votre URL de production
};

const api = axios.create({
    baseURL: getBaseUrl(),
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Intercepteur pour logger les requêtes
api.interceptors.request.use(
    config => {
        console.log('🚀 Requête:', {
            url: config.url,
            method: config.method,
            data: config.data,
            baseURL: config.baseURL
        });
        return config;
    },
    error => {
        console.error('❌ Erreur requête:', error);
        return Promise.reject(error);
    }
);

// Intercepteur pour logger les réponses
api.interceptors.response.use(
    response => {
        console.log('✅ Réponse:', response.data);
        return response;
    },
    error => {
        console.error('❌ Erreur réponse:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        return Promise.reject(error);
    }
);

export default api;