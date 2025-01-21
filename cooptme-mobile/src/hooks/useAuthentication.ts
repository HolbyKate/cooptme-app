// src/hooks/useAuthentication.ts
import { useState } from 'react';
import { authService, authServiceApi } from '../api/services/auth/auth.api.service';
import { useAuth } from '../contexts/AuthContext';

export const useAuthentication = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signIn } = useAuth();

    const handleEmailLogin = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.login(email, password);
            await signIn(response.token);
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async (token: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.googleLogin(token);
            await signIn(response.token);
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleLinkedInLogin = async (token: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.linkedinLogin(token);
            await signIn(response.token);
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authServiceApi.register({ email, password });
            await signIn(response.token);
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        handleEmailLogin,
        handleGoogleLogin,
        handleLinkedInLogin,
        handleRegister
    };
};