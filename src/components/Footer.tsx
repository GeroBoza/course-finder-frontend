import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto border-t border-gray-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <h3 className="text-2xl font-extrabold mb-4 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                            Cursos Platform
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                            Encontrá el curso ideal para tu desarrollo profesional
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white">Enlaces</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/courses"
                                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200 inline-block hover:translate-x-1 transform"
                                >
                                    Cursos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/organizations"
                                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200 inline-block hover:translate-x-1 transform"
                                >
                                    Organizaciones
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200 inline-block hover:translate-x-1 transform"
                                >
                                    Acerca de
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white">Contacto</h4>
                        <p className="text-gray-300 leading-relaxed">
                            Buscador de cursos de instituciones de todo el país
                        </p>
                    </div>
                </div>
                <div className="border-t border-gray-700/50 mt-12 pt-8 text-center">
                    <p className="text-gray-400">
                        &copy; 2024 Cursos Platform. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}

