'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { coursesService } from '@/services/courses.service';
import { courseLeadsService } from '@/services/course-leads.service';
import type { Course } from '@/types';
import CategoryBadge from '@/components/CategoryBadge';
import Button from '@/components/Button';

export default function CourseDetailPage() {
    const params = useParams();
    const courseId = parseInt(params.id as string);
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
    });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await coursesService.getById(courseId);
                setCourse(data);
            } catch (error) {
                console.error('Error fetching course:', error);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourse();
        }
    }, [courseId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!course) return;

        setSubmitting(true);
        try {
            await courseLeadsService.create({
                courseId: course.id,
                fullName: formData.fullName,
                email: formData.email,
            });

            // Redirigir al enrollment_url si existe
            if (course.enrollmentUrl) {
                window.location.href = course.enrollmentUrl;
            } else {
                alert('¡Inscripción registrada exitosamente!');
            }
        } catch (error) {
            console.error('Error creating lead:', error);
            alert('Error al procesar la inscripción. Por favor, intenta nuevamente.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                    <div className="h-64 bg-gray-200 rounded mb-8"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <p className="text-center text-gray-600">Curso no encontrado</p>
            </div>
        );
    }

    const mainImage = course.images?.find((img) => img.isMain) || course.images?.[0];
    const categories = course.courseCategories?.map((cc) => cc.category).filter(Boolean) || [];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {mainImage && (
                    <div className="h-64 md:h-96 bg-gray-200 overflow-hidden">
                        <img
                            src={mainImage.imageUrl}
                            alt={course.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="p-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {course.name}
                    </h1>

                    {course.organization && (
                        <p className="text-xl text-gray-600 mb-4">
                            {course.organization.name}
                        </p>
                    )}

                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {categories.map((category) => (
                                <CategoryBadge key={category!.id} category={category!} />
                            ))}
                        </div>
                    )}

                    {course.description && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Descripción</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {course.description}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {course.academicYear && (
                            <div>
                                <span className="font-semibold">Año académico: </span>
                                <span>{course.academicYear}</span>
                            </div>
                        )}
                        {course.startDate && (
                            <div>
                                <span className="font-semibold">Fecha de inicio: </span>
                                <span>{new Date(course.startDate).toLocaleDateString()}</span>
                            </div>
                        )}
                        {course.endDate && (
                            <div>
                                <span className="font-semibold">Fecha de fin: </span>
                                <span>{new Date(course.endDate).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t pt-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            Iniciar Inscripción
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Nombre completo
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, fullName: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full"
                                onClick={() => {}}
                            >
                                {submitting ? 'Procesando...' : 'Iniciar inscripción'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

