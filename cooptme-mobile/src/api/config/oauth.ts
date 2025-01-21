import { makeRedirectUri } from 'expo-auth-session';

export const googleConfig = {
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    expoClientId: "YOUR_EXPO_CLIENT_ID",
    scopes: ['profile', 'email']
};
