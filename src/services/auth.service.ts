import fetchApi, { ApiError } from './api';
import { clearToken, getToken, setToken } from '@/lib/auth-token';
import type { AdminUser, AuthResponse, LoginDto } from '@/types';

const ADMIN_ROLES = ['superadmin', 'admin'];

export const authService = {
    async login(credentials: LoginDto): Promise<AuthResponse> {
        const response = await fetchApi<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        setToken(response.data.accessToken);
        return response.data;
    },

    logout(): void {
        clearToken();
    },

    isAuthenticated(): boolean {
        return !!getToken();
    },

    async getCurrentUser(): Promise<AdminUser | null> {
        if (!getToken()) {
            return null;
        }

        try {
            const response = await fetchApi<AdminUser>('/auth/me');
            return response.data;
        } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
                clearToken();
            }
            return null;
        }
    },

    isAdmin(user: AdminUser | null): boolean {
        if (!user?.isActive) return false;
        return ADMIN_ROLES.includes(user.role.toLowerCase());
    },
};
