'use client';

import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
    const { isAuthenticated, isLoading } = useAuth();

    return (
        <nav className="glass-effect border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link
                        href="/"
                        className="flex items-center hover:opacity-90 transition-opacity duration-200"
                    >
                        <Image
                            src="/images/capacontinua_icon.svg"
                            alt="CapaContinua"
                            width={750}
                            height={600}
                            className="h-10 w-auto md:h-12 object-contain"
                            priority
                        />
                    </Link>

                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex space-x-1">
                            <Link
                                href="/"
                                className="px-4 py-2 text-md uppercase text-gray-700 hover:text-[#8f7324] hover:bg-[#f5f0e1] rounded-lg transition-all duration-200 font-medium"
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/courses"
                                className="px-4 py-2 text-md uppercase text-gray-700 hover:text-[#8f7324] hover:bg-[#f5f0e1] rounded-lg transition-all duration-200 font-medium"
                            >
                                Cursos
                            </Link>
                            <Link
                                href="/organizations"
                                className="px-4 py-2 text-md uppercase text-gray-700 hover:text-[#8f7324] hover:bg-[#f5f0e1] rounded-lg transition-all duration-200 font-medium"
                            >
                                Organizaciones
                            </Link>
                            <Link
                                href="/about"
                                className="px-4 py-2 text-md uppercase text-gray-700 hover:text-[#8f7324] hover:bg-[#f5f0e1] rounded-lg transition-all duration-200 font-medium"
                            >
                                Acerca de
                            </Link>
                        </div>

                        {!isLoading && isAuthenticated && (
                            <Link
                                href="/dashboard"
                                className="ml-2 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white bg-gradient-to-r from-[#b8962e] to-[#9a7b26] hover:from-[#9a7b26] hover:to-[#7d631e] rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                ADMIN
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
