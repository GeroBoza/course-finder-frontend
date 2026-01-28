import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="glass-effect border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link
                        href="/"
                        className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
                    >
                        Cursos Platform
                    </Link>
                    <div className="hidden md:flex space-x-1">
                        <Link
                            href="/"
                            className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 font-medium"
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/courses"
                            className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 font-medium"
                        >
                            Cursos
                        </Link>
                        <Link
                            href="/organizations"
                            className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 font-medium"
                        >
                            Organizaciones
                        </Link>
                        <Link
                            href="/about"
                            className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 font-medium"
                        >
                            Acerca de
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

