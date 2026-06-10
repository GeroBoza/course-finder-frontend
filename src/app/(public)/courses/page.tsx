'use client';

import CourseCard from '@/components/CourseCard';
import SearchBar from '@/components/SearchBar';
import { categoriesService } from '@/services/categories.service';
import { coursesService } from '@/services/courses.service';
import { organizationsService } from '@/services/organizations.service';
import type { Category, CoursesResponse, Organization } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function CoursesPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [coursesResponse, setCoursesResponse] =
        useState<CoursesResponse | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const hasLoadedInitialData = useRef(false);
    const hasLoadedCoursesOnce = useRef(false);

    // Cargar categorías y organizaciones solo una vez al inicio
    useEffect(() => {
        const fetchInitialData = async () => {
            if (hasLoadedInitialData.current) return;

            try {
                const [cats, orgs] = await Promise.all([
                    categoriesService.getAll(),
                    organizationsService.getAll(),
                ]);

                setCategories(cats);
                setOrganizations(orgs);
                hasLoadedInitialData.current = true;
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        };

        fetchInitialData();
    }, []);

    // Cargar cursos cuando cambian los searchParams
    useEffect(() => {
        const fetchCourses = async () => {
            const isFirstLoad = !hasLoadedCoursesOnce.current;

            // Solo mostrar loading completo en la primera carga de cursos
            if (isFirstLoad) {
                setInitialLoading(true);
            } else {
                // En cargas subsecuentes (cambio de filtros), solo mostrar skeletons de las cards
                setLoadingCourses(true);
            }

            try {
                const filters = {
                    categoryId: searchParams.get('categoryId')
                        ? parseInt(searchParams.get('categoryId')!)
                        : undefined,
                    organizationId: searchParams.get('organizationId')
                        ? parseInt(searchParams.get('organizationId')!)
                        : undefined,
                    academicYear: searchParams.get('academicYear') || undefined,
                    page: searchParams.get('page')
                        ? parseInt(searchParams.get('page')!)
                        : 1,
                    limit: 12,
                };

                const courses = await coursesService.getAll(filters);

                // Delay para simular la demora del backend (opcional, remover en producción)
                const DELAY_MS = 1500; // Ajusta este valor según necesites
                await new Promise((resolve) => setTimeout(resolve, DELAY_MS));

                setCoursesResponse(courses);
                hasLoadedCoursesOnce.current = true;
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setInitialLoading(false);
                setLoadingCourses(false);
            }
        };

        fetchCourses();
    }, [searchParams]);

    const handleFilterChange = (filterName: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(filterName, value);
        } else {
            params.delete(filterName);
        }
        params.delete('page'); // Reset to page 1 when filtering
        router.push(`/courses?${params.toString()}`, { scroll: false });
    };

    // Componente para el skeleton de una card de curso
    const CourseCardSkeleton = () => (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
            <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-12 flex-shrink-0"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-5"></div>
                <div className="flex gap-2 mb-5">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
        </div>
    );

    // Skeleton completo solo en la carga inicial
    if (initialLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <CourseCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    Todos los Cursos
                </h1>
                <div className="mb-6">
                    <SearchBar />
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h3 className="text-lg font-semibold mb-4">Filtros</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Categoría
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={searchParams.get('categoryId') || ''}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'categoryId',
                                        e.target.value,
                                    )
                                }
                            >
                                <option value="">Todas las categorías</option>
                                {categories.map((cat) => (
                                    <option
                                        key={cat.id}
                                        value={cat.id.toString()}
                                    >
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Organización
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={searchParams.get('organizationId') || ''}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'organizationId',
                                        e.target.value,
                                    )
                                }
                            >
                                <option value="">
                                    Todas las organizaciones
                                </option>
                                {organizations.map((org) => (
                                    <option
                                        key={org.id}
                                        value={org.id.toString()}
                                    >
                                        {org.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            {loadingCourses ? (
                // Mostrar skeletons mientras se cargan los nuevos cursos
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {[...Array(6)].map((_, i) => (
                        <CourseCardSkeleton key={i} />
                    ))}
                </div>
            ) : coursesResponse && coursesResponse.data.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {coursesResponse.data.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {coursesResponse.totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            {Array.from(
                                { length: coursesResponse.totalPages },
                                (_, i) => i + 1,
                            ).map((page) => {
                                const params = new URLSearchParams(
                                    searchParams.toString(),
                                );
                                params.set('page', page.toString());
                                return (
                                    <button
                                        key={page}
                                        onClick={() =>
                                            router.push(
                                                `/courses?${params.toString()}`,
                                                { scroll: false },
                                            )
                                        }
                                        className={`px-4 py-2 rounded-lg ${
                                            page === coursesResponse.page
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                        } transition-colors`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">
                        {coursesResponse
                            ? 'No se encontraron cursos con los filtros seleccionados.'
                            : 'Error al cargar los cursos'}
                    </p>
                </div>
            )}
        </div>
    );
}
