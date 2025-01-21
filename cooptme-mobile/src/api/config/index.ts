export const CONFIG = {
    API_URL: __DEV__
        ? 'http://10.0.2.2:3000' // Pour Android Emulator
        : 'https://votre-api-prod.com',
    API_TIMEOUT: 10000,
    AUTH_ENDPOINTS: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        GOOGLE: '/auth/google',
        APPLE: '/auth/apple',
        FORGOT_PASSWORD: '/auth/forgot-password'
    },
    STORAGE_KEYS: {
        USER_TOKEN: 'userToken',
        USER_DATA: 'userData',
        LINKEDIN_AUTH: 'linkedinAuth',
        PROFILES: 'profiles'
    }
};

export default CONFIG;