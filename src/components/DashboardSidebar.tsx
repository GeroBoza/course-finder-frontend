'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { AdminUser } from '@/types';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        label: 'Cursos',
        href: '/dashboard/courses',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
        children: [
            { label: 'Ver cursos', href: '/dashboard/courses' },
            { label: 'Agregar curso', href: '/dashboard/courses/new' },
            { label: 'Importar cursos', href: '/dashboard/courses/import' },
        ],
    },
    {
        label: 'Organizaciones',
        href: '/dashboard/organizations',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
        children: [
            { label: 'Ver organizaciones', href: '/dashboard/organizations' },
            { label: 'Agregar organización', href: '/dashboard/organizations/new' },
        ],
    },
];

interface DashboardSidebarProps {
    user: AdminUser;
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.replace('/login');
    };

    const isActive = (href: string) =>
        href === '/dashboard' ? pathname === href : pathname.startsWith(href);

    return (
        <aside className="w-64 h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white flex flex-col shadow-xl flex-shrink-0">
            {/* Logo / Header */}
            <div className="px-6 py-6 border-b border-blue-800/60 flex-shrink-0">
                <Link href="/dashboard" className="block">
                    <span className="text-lg font-extrabold bg-gradient-to-r from-[#c4a84a] to-[#e8dfc4] bg-clip-text text-transparent leading-tight">
                        CapaContinua
                    </span>
                    <p className="text-xs text-blue-300 mt-0.5 font-medium uppercase tracking-widest">
                        Panel de Administración
                    </p>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <div key={item.href}>
                        <Link
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive(item.href)
                                    ? 'bg-blue-700/70 text-white shadow-sm'
                                    : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>

                        {item.children && isActive(item.href) && (
                            <div className="ml-4 mt-1 space-y-0.5 border-l border-blue-700/50 pl-3">
                                {item.children.map((child) => (
                                    <Link
                                        key={child.href}
                                        href={child.href}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                            pathname === child.href
                                                ? 'text-[#c4a84a] font-semibold'
                                                : 'text-blue-300 hover:text-white hover:bg-blue-800/40'
                                        }`}
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        {child.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* User info */}
            <div className="px-4 py-4 border-t border-blue-800/60 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#b8962e] to-[#9a7b26] flex items-center justify-center flex-shrink-0 shadow">
                        <span className="text-white text-sm font-bold">
                            {user.fullName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
                        <p className="text-xs text-blue-300 truncate">{user.email}</p>
                    </div>
                </div>
                <div className="mt-3 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-xs text-blue-300 hover:text-white transition-colors duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver al sitio
                    </Link>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-xs text-blue-300 hover:text-white transition-colors duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </aside>
    );
}
