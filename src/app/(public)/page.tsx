import Button from '@/components/Button';
import CategoryBadge from '@/components/CategoryBadge';
import CourseCarousel from '@/components/CourseCarousel';
import SearchBar from '@/components/SearchBar';
import { categoriesService } from '@/services/categories.service';
import { coursesService } from '@/services/courses.service';
import Link from 'next/link';

export default async function Home() {
    const [coursesResponse, categories] = await Promise.all([
        coursesService.getAll({ limit: 9 }),
        categoriesService.getAll(),
    ]);

    const featuredCourses = coursesResponse.data.slice(0, 6);

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 text-white py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDMuMzE0LTIuNjg2IDYtNiA2cy02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNnoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                            Encontrá el curso ideal para tu{' '}
                            <span className="bg-gradient-to-r from-[#c4a84a] to-[#e8dfc4] bg-clip-text text-transparent">
                                desarrollo profesional
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 text-blue-200 max-w-3xl mx-auto leading-relaxed">
                            Buscador de cursos de instituciones de todo el país
                        </p>
                        <div className="max-w-2xl mx-auto mb-14">
                            <SearchBar />
                        </div>
                        <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
                            "CapaContinua es acercarnos al conocimiento y
                            fomentar el aprendizaje"
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Courses */}
            <section className="py-20 bg-gradient-to-b from-white to-blue-100/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            Cursos Destacados
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Descubrí los cursos más populares y mejor valorados.
                        </p>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Calidad certificada
                        </p>
                    </div>
                    <CourseCarousel courses={featuredCourses} />
                    <div className="text-center mt-16">
                        <Link href="/courses">
                            <Button
                                variant="primary"
                                size="lg"
                                className="px-8 py-4 text-lg"
                            >
                                Explorar todos los cursos
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 bg-gradient-to-b from-blue-200/60 to-blue-100/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            Categorías
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Explorá cursos por categoría y encontrá lo que
                            buscás
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/courses?categoryId=${category.id}`}
                                className="transform hover:scale-110 transition-transform duration-200"
                            >
                                <CategoryBadge
                                    category={category}
                                    className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white transition-all duration-300 text-lg px-6 py-3 shadow-md hover:shadow-lg"
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
