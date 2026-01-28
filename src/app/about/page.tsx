import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Acerca de - Cursos Platform',
    description: 'Conocé más sobre nuestra plataforma de búsqueda de cursos',
};

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    Acerca de Cursos Platform
                </h1>

                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 mb-6 text-lg">
                        <strong>Cursos Platform</strong> es una plataforma diseñada para
                        ayudarte a encontrar el curso ideal para tu desarrollo profesional.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Nuestra Misión
                    </h2>
                    <p className="text-gray-700 mb-6">
                        Nuestro objetivo es facilitar el acceso a la educación continua,
                        conectando a estudiantes con instituciones de todo el país que
                        ofrecen cursos de calidad.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        ¿Qué ofrecemos?
                    </h2>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                        <li>
                            Búsqueda avanzada de cursos por categoría, organización y año
                            académico
                        </li>
                        <li>
                            Información detallada de cada curso, incluyendo descripción,
                            fechas y organización
                        </li>
                        <li>
                            Acceso directo a las páginas de inscripción de cada curso
                        </li>
                        <li>
                            Exploración de organizaciones educativas y sus ofertas
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Contacto
                    </h2>
                    <p className="text-gray-700">
                        Si sos una institución educativa y querés que tus cursos aparezcan
                        en nuestra plataforma, o si tenés alguna consulta, no dudes en
                        contactarnos.
                    </p>
                </div>
            </div>
        </div>
    );
}

