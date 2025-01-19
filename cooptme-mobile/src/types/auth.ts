export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    photoUrl?: string;
    provider: 'google' | 'linkedin' | 'email';
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface SocialLoginPayload {
    type: 'google' | 'linkedin';
    token: string;
    email: string;
}

export interface LoginError {
    message: string;
    code?: string;
}