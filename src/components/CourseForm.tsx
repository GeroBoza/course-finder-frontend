'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { categoriesService } from '@/services/categories.service';
import { coursesService } from '@/services/courses.service';
import { organizationsService } from '@/services/organizations.service';
import type { Category, CreateCourseDto, Organization, UpdateCourseDto } from '@/types';
import Button from '@/components/Button';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CourseFormState {
    organizationId: string;
    name: string;
    description: string;
    academicYear: string;
    enrollmentUrl: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    categoryIds: number[];
}

export const emptyCourseForm: CourseFormState = {
    organizationId: '',
    name: '',
    description: '',
    academicYear: '',
    enrollmentUrl: '',
    startDate: '',
    endDate: '',
    isActive: true,
    categoryIds: [],
};

interface CourseFormProps {
    mode: 'create' | 'edit';
    courseId?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Converts ISO date string (or null) to YYYY-MM-DD for <input type="date"> */
const toDateInput = (dateStr: string | null): string => {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function FormSkeleton() {
    return (
        <div className="animate-pulse max-w-3xl">
            <div className="h-4 bg-gray-200 rounded w-20 mb-6" />
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="bg-white rounded-2xl p-8 space-y-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i}>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                        <div className="h-10 bg-gray-200 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CourseForm({ mode, courseId }: CourseFormProps) {
    const router = useRouter();

    const [form, setForm] = useState<CourseFormState>(emptyCourseForm);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const isEdit = mode === 'edit';

    // ── Load supporting data + course (in edit mode) ──────────────────────────
    useEffect(() => {
        const promises: [
            ReturnType<typeof organizationsService.getAll>,
            ReturnType<typeof categoriesService.getAll>,
            ...ReturnType<typeof coursesService.getById>[],
        ] = isEdit && courseId
            ? [
                  organizationsService.getAll(),
                  categoriesService.getAll(),
                  coursesService.getById(courseId),
              ]
            : [organizationsService.getAll(), categoriesService.getAll()];

        Promise.all(promises)
            .then(([orgs, cats, course]) => {
                setOrganizations(orgs as Organization[]);
                setCategories(cats as Category[]);

                if (course) {
                    const c = course as Awaited<ReturnType<typeof coursesService.getById>>;
                    setForm({
                        organizationId: c.organizationId.toString(),
                        name: c.name,
                        description: c.description ?? '',
                        academicYear: c.academicYear ?? '',
                        enrollmentUrl: c.enrollmentUrl ?? '',
                        startDate: toDateInput(c.startDate),
                        endDate: toDateInput(c.endDate),
                        isActive: c.isActive,
                        categoryIds: c.courseCategories?.map((cc) => cc.categoryId) ?? [],
                    });
                }
            })
            .catch(() =>
                setError(
                    isEdit
                        ? 'No se pudo cargar el curso para editar.'
                        : 'Error al cargar los datos del formulario.',
                ),
            )
            .finally(() => setLoadingData(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Form handlers ─────────────────────────────────────────────────────────
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const toggleCategory = (id: number) => {
        setForm((prev) => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(id)
                ? prev.categoryIds.filter((c) => c !== id)
                : [...prev.categoryIds, id],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!form.organizationId) {
            setError('Seleccioná una organización.');
            return;
        }

        setSubmitting(true);
        try {
            if (isEdit && courseId) {
                const dto: UpdateCourseDto = {
                    organizationId: parseInt(form.organizationId),
                    name: form.name.trim(),
                    description: form.description.trim(),
                    enrollmentUrl: form.enrollmentUrl.trim(),
                    isActive: form.isActive,
                    academicYear: form.academicYear.trim() || undefined,
                    startDate: form.startDate || undefined,
                    endDate: form.endDate || undefined,
                    categoryIds: form.categoryIds.length > 0 ? form.categoryIds : undefined,
                };
                await coursesService.update(courseId, dto);
                setSuccess(true);
                // Redirect after short delay so user sees the success banner
                setTimeout(() => router.push('/dashboard/courses'), 1500);
            } else {
                const dto: CreateCourseDto = {
                    organizationId: parseInt(form.organizationId),
                    name: form.name.trim(),
                    description: form.description.trim(),
                    enrollmentUrl: form.enrollmentUrl.trim(),
                    isActive: form.isActive,
                    ...(form.academicYear && { academicYear: form.academicYear.trim() }),
                    ...(form.startDate && { startDate: form.startDate }),
                    ...(form.endDate && { endDate: form.endDate }),
                    ...(form.categoryIds.length > 0 && { categoryIds: form.categoryIds }),
                };
                await coursesService.create(dto);
                setSuccess(true);
                setForm(emptyCourseForm);
            }
        } catch {
            setError(
                isEdit
                    ? 'Ocurrió un error al guardar los cambios. Revisá los datos e intentá nuevamente.'
                    : 'Ocurrió un error al crear el curso. Revisá los datos e intentá nuevamente.',
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    if (loadingData) return <FormSkeleton />;

    const title = isEdit ? 'Editar curso' : 'Agregar curso';
    const subtitle = isEdit
        ? 'Modificá los datos del curso y guardá los cambios.'
        : 'Completá los datos para publicar un nuevo curso.';
    const successMessage = isEdit
        ? '¡Cambios guardados! Redirigiendo...'
        : '¡Curso creado exitosamente!';
    const submitLabel = isEdit ? 'Guardar cambios' : 'Guardar curso';

    return (
        <div className="max-w-3xl animate-fade-in">
            {/* Page header */}
            <div className="mb-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver
                </button>
                <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
                <p className="text-gray-500 mt-1">{subtitle}</p>
            </div>

            {/* Success banner */}
            {success && (
                <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-5 py-4">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm font-medium">{successMessage}</p>
                    {!isEdit && (
                        <button
                            onClick={() => setSuccess(false)}
                            className="ml-auto text-green-600 hover:text-green-800"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            )}

            {/* Error banner */}
            {error && (
                <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl px-5 py-4">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 space-y-6">

                {/* Organización */}
                <div>
                    <label htmlFor="organizationId" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Organización <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="organizationId"
                        name="organizationId"
                        required
                        value={form.organizationId}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                        <option value="">Seleccioná una organización</option>
                        {organizations.map((org) => (
                            <option key={org.id} value={org.id}>
                                {org.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Nombre */}
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Nombre del curso <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ej: Curso de TypeScript Avanzado"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Descripción <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        required
                        rows={4}
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describí el contenido y objetivos del curso..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                    />
                </div>

                {/* URL de inscripción */}
                <div>
                    <label htmlFor="enrollmentUrl" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        URL de inscripción <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="url"
                        id="enrollmentUrl"
                        name="enrollmentUrl"
                        required
                        value={form.enrollmentUrl}
                        onChange={handleChange}
                        placeholder="https://ejemplo.com/inscripcion"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>

                {/* Año académico */}
                <div>
                    <label htmlFor="academicYear" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Año académico <span className="text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <input
                        type="text"
                        id="academicYear"
                        name="academicYear"
                        value={form.academicYear}
                        onChange={handleChange}
                        placeholder="Ej: 2025"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Fecha de inicio <span className="text-gray-400 font-normal">(opcional)</span>
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Fecha de fin <span className="text-gray-400 font-normal">(opcional)</span>
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={form.endDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>

                {/* Categorías */}
                {categories.length > 0 && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Categorías <span className="text-gray-400 font-normal">(opcional)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => {
                                const selected = form.categoryIds.includes(cat.id);
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => toggleCategory(cat.id)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                                            selected
                                                ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                                                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-700'
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Estado activo */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                        Publicar curso (activo)
                    </label>
                </div>

                {/* Form actions */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
                    >
                        Cancelar
                    </button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        className={submitting ? 'opacity-70 cursor-not-allowed' : ''}
                    >
                        {submitting ? (
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Guardando...
                            </span>
                        ) : (
                            submitLabel
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
