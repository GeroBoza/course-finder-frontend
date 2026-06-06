'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import DashboardSidebar from '@/components/DashboardSidebar';
import type { AdminUser } from '@/types';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [user, setUser] = useState<AdminUser | null>(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const verifyAccess = async () => {
            if (!authService.isAuthenticated()) {
                router.replace('/login');
                return;
            }

            const currentUser = await authService.getCurrentUser();

            if (!authService.isAdmin(currentUser)) {
                authService.logout();
                router.replace('/login');
                return;
            }

            setUser(currentUser);
            setChecking(false);
        };

        verifyAccess();
    }, [router]);

    if (checking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-950 to-blue-900">
                <div className="text-center">
                    <div className="inline-block w-10 h-10 border-4 border-[#c4a84a] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-blue-200 text-sm font-medium">Verificando acceso...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardSidebar user={user} />
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm flex-shrink-0">
                    <p className="text-sm text-gray-500">
                        Bienvenido,{' '}
                        <span className="font-semibold text-gray-800">{user.fullName}</span>
                    </p>
                </header>
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
