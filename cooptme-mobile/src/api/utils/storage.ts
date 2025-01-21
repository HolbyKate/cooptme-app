import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/axios';

export const tokenUtils = {
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
    }
};