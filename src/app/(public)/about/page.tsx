import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Acerca de - CapaContinua',
    description:
        'Conocé más sobre CapaContinua, el buscador de cursos de instituciones de todo el país',
};

export default function AboutPage() {
    return (
        <div className="animate-fade-in">
            {/* Header */}
            <section className="relative bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 text-white py-16 md:py-20 overflow-hidden">
                <div
                    className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDMuMzE0LTIuNjg2IDYtNiA2cy02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNnoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-20"
                    aria-hidden
                />
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex flex-col items-center gap-4 mb-6">
                        <Image
                            src="/images/capacontinua_icon.svg"
                            alt=""
                            width={699}
                            height={509}
                            className="h-20 md:h-24 w-auto object-contain"
                        />
                        <span className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#c4a84a] to-[#e8dfc4] bg-clip-text text-transparent">
                            CapaContinua
                        </span>
                    </div>
                    <p className="text-xl md:text-2xl text-blue-200 max-w-2xl mx-auto leading-relaxed italic">
                        &ldquo;Acercarnos al conocimiento y fomentar el
                        aprendizaje&rdquo;
                    </p>
                </div>
            </section>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                            <strong className="text-gray-900">
                                CapaContinua
                            </strong>{' '}
                            es un buscador de cursos de instituciones de todo
                            el país. Reunimos en un solo lugar la oferta
                            formativa de universidades, centros de capacitación y
                            organizaciones educativas para que puedas encontrar
                            el curso ideal para tu desarrollo profesional.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Nuestra misión
                        </h2>
                        <p className="text-gray-700 mb-8 leading-relaxed">
                            Creemos que el aprendizaje no termina con un
                            título: es un proceso continuo que acompaña toda la
                            vida profesional. Nuestra misión es facilitar el
                            acceso a la educación continua, conectando a quienes
                            quieren seguir creciendo con las instituciones que
                            ofrecen formación de calidad en todo el país.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            ¿Qué ofrecemos?
                        </h2>
                        <ul className="list-none text-gray-700 mb-8 space-y-3">
                            {[
                                'Búsqueda avanzada de cursos por categoría, organización y año académico',
                                'Información detallada de cada curso: descripción, fechas, modalidad y organización',
                                'Acceso directo a las páginas de inscripción de cada curso',
                                'Exploración de organizaciones educativas y su catálogo de ofertas',
                            ].map((item) => (
                                <li key={item} className="flex gap-3">
                                    <span
                                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-[#b8962e] to-[#9a7b26]"
                                        aria-hidden
                                    />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            ¿Para quién es?
                        </h2>
                        <p className="text-gray-700 mb-8 leading-relaxed">
                            CapaContinua está pensado para profesionales que
                            buscan actualizar sus conocimientos, estudiantes
                            que quieren complementar su formación y cualquier
                            persona interesada en seguir aprendiendo. También
                            es una herramienta para instituciones que desean
                            dar visibilidad a sus cursos y llegar a más
                            personas.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Contacto
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Si sos una institución educativa y querés que tus
                            cursos aparezcan en CapaContinua, o si tenés alguna
                            consulta, escribinos. Estamos para ayudarte a
                            conectar tu oferta formativa con quienes la
                            necesitan.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
