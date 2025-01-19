import { makeRedirectUri } from 'expo-auth-session';

export const googleConfig = {
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    expoClientId: "YOUR_EXPO_CLIENT_ID",
    scopes: ['profile', 'email']
};

export const linkedInConfig = {
    clientId: "YOUR_LINKEDIN_CLIENT_ID",
    redirectUri: makeRedirectUri({
        scheme: 'your-scheme',
        path: 'linkedin-auth'
    }),
    scopes: ['r_liteprofile', 'r_emailaddress']
};

export const discovery = {
    authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
    revocationEndpoint: 'https://www.linkedin.com/oauth/v2/revoke'
};