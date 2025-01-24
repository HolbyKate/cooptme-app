export const GOOGLE_CONFIG = {
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};

export const LINKEDIN_CONFIG = {
    clientId: process.env.EXPO_PUBLIC_LINKEDIN_CLIENT_ID || '',
    redirectUri: 'your-scheme://oauth2/linkedin',
    scopes: ['r_liteprofile', 'r_emailaddress'],
};

// Vérification de la présence des variables d'environnement requises
const requiredEnvVars = [
    'EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID',
    'EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID',
    'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID',
    'EXPO_PUBLIC_LINKEDIN_CLIENT_ID'
];

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.warn(`⚠️ Variable d'environnement manquante: ${varName}`);
    }
});