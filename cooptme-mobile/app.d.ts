declare module 'react-native-gesture-handler' {
    export * from 'react-native-gesture-handler';
}

declare module '*.svg' {
    import React from 'react';
    import { SvgProps } from 'react-native-svg';
    const content: React.FC<SvgProps>;
    export default content;
}

declare module '*.png' {
    const value: any;
    export default value;
}

declare module '*.jpg' {
    const value: any;
    export default value;
}

declare module '*.json' {
    const value: any;
    export default value;
}

// Si vous utilisez des variables d'environnement
declare module '@env' {
    export const EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID: string;
    export const EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: string;
    export const EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: string;
    export const EXPO_PUBLIC_LINKEDIN_CLIENT_ID: string;
    export const EXPO_PUBLIC_AUTH0_DOMAIN: string;
    export const EXPO_PUBLIC_AUTH0_CLIENT_ID: string;
    export const EXPO_PUBLIC_AUTH0_AUDIENCE: string;
    export const EXPO_PUBLIC_AUTH0_REDIRECT_URI: string;
}
