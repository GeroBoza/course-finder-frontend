import type { AdminUser } from '@/types';

// Mock: simula validación de token devolviendo siempre un usuario admin.
// Reemplazar por llamada real a la API cuando el backend de auth esté disponible.
export const authService = {
    async getCurrentUser(): Promise<AdminUser | null> {
        await new Promise((resolve) => setTimeout(resolve, 300));

        return {
            id: 1,
            fullName: 'Admin CapaContinua',
            email: 'admin@capacontinua.com',
            role: 'admin',
            isActive: true,
        };
    },

    isAdmin(user: AdminUser | null): boolean {
        return user?.role === 'admin' && user.isActive === true;
    },
};
