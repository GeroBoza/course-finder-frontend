'use client';

import { useEffect, useState } from 'react';
import { categoriesService } from '@/services/categories.service';
import { coursesService } from '@/services/courses.service';
import { courseLeadsService } from '@/services/course-leads.service';
import { ApiError } from '@/services/api';
import type { Category, Course, CourseStats } from '@/types';

// ─── Metric card ──────────────────────────────────────────────────────────────

interface MetricCardProps {
    label: string;
    value: string;
    hint: string;
    icon: React.ReactNode;
    accent: string;
}

function MetricCard({ label, value, hint, icon, accent }: MetricCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-6">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {label}
                </p>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
                    {icon}
                </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-gray-900">{value}</p>
            <p className="mt-1 text-xs text-gray-400">{hint}</p>
        </div>
    );
}

function MetricSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-6 animate-pulse">
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="h-8 bg-gray-200 rounded w-16 mt-4" />
            <div className="h-3 bg-gray-200 rounded w-32 mt-2" />
        </div>
    );
}

function SkeletonRow() {
    return (
        <tr className="animate-pulse border-b border-gray-100">
            <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-40" /></td>
            <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-48" /></td>
            <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-28" /></td>
            <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-32" /></td>
        </tr>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardStatisticsPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loadingFilters, setLoadingFilters] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');

    const [stats, setStats] = useState<CourseStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(false);

    useEffect(() => {
        Promise.all([
            coursesService.getAll({ limit: 100, page: 1, includeInactive: true }),
            categoriesService.getAll(),
        ])
            .then(([res, cats]) => {
                setCourses(res.data);
                setCategories(cats);
            })
            .catch((err) => {
                setError(
                    err instanceof ApiError
                        ? err.message
                        : 'No se pudieron cargar los filtros.',
                );
            })
            .finally(() => setLoadingFilters(false));
    }, []);

    const handleCategoryChange = async (value: string) => {
        setSelectedCategoryId(value);
        setSelectedCourseId('');
        setStats(null);
        setError(null);
        setLoadingFilters(true);

        try {
            const res = await coursesService.getAll({
                categoryId: value ? parseInt(value) : undefined,
                limit: 100,
                page: 1,
                includeInactive: true,
            });
            setCourses(res.data);
        } catch (err) {
            setError(
                err instanceof ApiError
                    ? err.message
                    : 'No se pudieron cargar los cursos de esa categoría.',
            );
        } finally {
            setLoadingFilters(false);
        }
    };

    const handleCourseChange = async (value: string) => {
        setSelectedCourseId(value);
        setStats(null);
        setError(null);

        if (!value) return;

        setLoadingStats(true);
        try {
            setStats(await courseLeadsService.getStatsByCourse(parseInt(value)));
        } catch (err) {
            setError(
                err instanceof ApiError
                    ? err.message
                    : 'No se pudieron cargar las estadísticas del curso.',
            );
        } finally {
            setLoadingStats(false);
        }
    };

    const formatDateTime = (value: string) =>
        new Date(value).toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const conversionRate =
        stats && stats.viewCount > 0
            ? `${((stats.leadsCount / stats.viewCount) * 100).toFixed(1)}%`
            : '—';

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Estadísticas</h1>
                <p className="text-gray-500 mt-1">
                    Elegí un curso para ver sus visitas y quiénes iniciaron la inscripción
                </p>
            </div>

            {/* Error banner */}
            {error && (
                <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                    <button onClick={() => setError(null)} className="ml-auto hover:text-red-900">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Filters bar */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-soft px-5 py-4 mb-6 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[220px]">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Categoría
                    </label>
                    <select
                        value={selectedCategoryId}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 min-w-[260px]">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Curso
                    </label>
                    <select
                        value={selectedCourseId}
                        onChange={(e) => handleCourseChange(e.target.value)}
                        disabled={loadingFilters || courses.length === 0}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        <option value="">
                            {loadingFilters
                                ? 'Cargando cursos...'
                                : courses.length === 0
                                  ? 'No hay cursos en esta categoría'
                                  : 'Seleccioná un curso'}
                        </option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>{course.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Nothing selected yet */}
            {!selectedCourseId && !loadingStats && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-soft px-4 py-16">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="font-medium text-gray-500">
                            Elegí un curso para ver sus estadísticas
                        </p>
                    </div>
                </div>
            )}

            {/* Metrics */}
            {(loadingStats || stats) && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
                        {loadingStats ? (
                            [...Array(3)].map((_, i) => <MetricSkeleton key={i} />)
                        ) : stats ? (
                            <>
                                <MetricCard
                                    label="Visitas"
                                    value={stats.viewCount.toLocaleString('es-AR')}
                                    hint="Veces que se abrió la página del curso"
                                    accent="bg-blue-50 text-blue-600"
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    }
                                />
                                <MetricCard
                                    label="Solicitudes"
                                    value={stats.leadsCount.toLocaleString('es-AR')}
                                    hint="Personas que iniciaron la inscripción"
                                    accent="bg-green-50 text-green-600"
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    }
                                />
                                <MetricCard
                                    label="Conversión"
                                    value={conversionRate}
                                    hint="Solicitudes sobre visitas"
                                    accent="bg-amber-50 text-amber-600"
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    }
                                />
                            </>
                        ) : null}
                    </div>

                    <p className="text-xs text-gray-400 mb-6">
                        Las visitas se cuentan una vez por sesión y las solicitudes una vez
                        por persona, así que la conversión es aproximada.
                    </p>

                    {/* Leads table */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h2 className="font-bold text-gray-900">Solicitudes de inscripción</h2>
                            {stats && (
                                <p className="text-xs text-gray-500 mt-0.5">{stats.courseName}</p>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-4 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wide">
                                            Nombre
                                        </th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wide">
                                            Email
                                        </th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wide">
                                            Teléfono
                                        </th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wide whitespace-nowrap">
                                            Fecha
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loadingStats ? (
                                        [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
                                    ) : stats && stats.leads.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-16 text-center">
                                                <div className="flex flex-col items-center gap-3 text-gray-400">
                                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="font-medium text-gray-500">
                                                        Todavía nadie inició una inscripción en este curso.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        stats?.leads.map((lead) => (
                                            <tr key={lead.id} className="hover:bg-gray-50/70 transition-colors">
                                                <td className="px-4 py-4 font-semibold text-gray-900">
                                                    {lead.fullName}
                                                </td>
                                                <td className="px-4 py-4 text-gray-600">
                                                    <a
                                                        href={`mailto:${lead.email}`}
                                                        className="hover:text-blue-700 hover:underline"
                                                    >
                                                        {lead.email}
                                                    </a>
                                                </td>
                                                <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                                                    {lead.phone ?? '—'}
                                                </td>
                                                <td className="px-4 py-4 text-gray-500 text-xs whitespace-nowrap">
                                                    {formatDateTime(lead.createdAt)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {!loadingStats && stats && stats.leads.length > 0 && (
                            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500">
                                {stats.leads.length} solicitud{stats.leads.length !== 1 ? 'es' : ''} en total
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
