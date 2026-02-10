import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white mt-auto border-t border-green-800/50 overflow-hidden">
            <div
                className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDMuMzE0LTIuNjg2IDYtNiA2cy02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNnoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-20"
                aria-hidden
            />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <h3 className="text-2xl font-extrabold mb-4 bg-gradient-to-r from-green-300 to-green-100 bg-clip-text text-transparent">
                            DivulgAR
                        </h3>
                        <p className="text-green-100 leading-relaxed">
                            Encontrá el curso ideal para tu desarrollo
                            profesional
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white">
                            Enlaces
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/courses"
                                    className="text-green-100 hover:text-green-200 transition-colors duration-200 inline-block hover:translate-x-1 transform"
                                >
                                    Cursos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/organizations"
                                    className="text-green-100 hover:text-green-200 transition-colors duration-200 inline-block hover:translate-x-1 transform"
                                >
                                    Organizaciones
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-green-100 hover:text-green-200 transition-colors duration-200 inline-block hover:translate-x-1 transform"
                                >
                                    Acerca de
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white">
                            Contacto
                        </h4>
                        <p className="text-green-100 leading-relaxed">
                            Buscador de cursos de instituciones de todo el país
                        </p>
                    </div>
                </div>
                <div className="border-t border-green-800/50 mt-12 pt-8 text-center">
                    <p className="text-green-200/90">
                        &copy; 2024 Cursos Platform. Todos los derechos
                        reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
