'use client';

import { FormEvent, Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import Button from '@/components/Button';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/dashboard';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        authService.getCurrentUser().then((user) => {
            if (authService.isAdmin(user)) {
                router.replace(redirect);
                return;
            }
            setChecking(false);
        });
    }, [router, redirect]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login({ email, password });

            if (!authService.isAdmin(response.user)) {
                authService.logout();
                setError('No tenés permisos para acceder al panel de administración.');
                return;
            }

            router.replace(redirect);
        } catch {
            setError('Credenciales inválidas. Verificá tu email y contraseña.');
        } finally {
            setLoading(false);
        }
    };

    if (checking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-950 to-blue-900">
                <div className="inline-block w-10 h-10 border-4 border-[#c4a84a] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <span className="text-3xl font-extrabold bg-gradient-to-r from-[#c4a84a] to-[#e8dfc4] bg-clip-text text-transparent">
                            CapaContinua
                        </span>
                    </Link>
                    <p className="text-blue-200 text-sm mt-2">
                        Panel de Administración
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-strong p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Iniciar sesión
                    </h1>
                    <p className="text-gray-500 text-sm mb-6">
                        Ingresá con tu cuenta de administrador
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="admin@capacontinua.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                autoComplete="current-password"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full justify-center"
                            disabled={loading}
                        >
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </Button>
                    </form>
                </div>

                <p className="text-center mt-6 text-blue-300 text-sm">
                    <Link href="/" className="hover:text-white transition-colors">
                        ← Volver al sitio público
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-950 to-blue-900">
                    <div className="inline-block w-10 h-10 border-4 border-[#c4a84a] border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <LoginForm />
        </Suspense>
    );
}
