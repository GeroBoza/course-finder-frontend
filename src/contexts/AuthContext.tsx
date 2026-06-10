'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { authService } from '@/services/auth.service';
import type { AdminUser } from '@/types';

interface AuthContextValue {
    user: AdminUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    refreshAuth: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshAuth = useCallback(async () => {
        setIsLoading(true);

        try {
            if (!authService.isAuthenticated()) {
                setUser(null);
                return;
            }

            const currentUser = await authService.getCurrentUser();

            if (authService.isAdmin(currentUser)) {
                setUser(currentUser);
                return;
            }

            if (currentUser) {
                authService.logout();
            }
            setUser(null);
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
    }, []);

    useEffect(() => {
        refreshAuth();
    }, [refreshAuth]);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: user !== null,
            isLoading,
            refreshAuth,
            logout,
        }),
        [user, isLoading, refreshAuth, logout],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }

    return context;
}
