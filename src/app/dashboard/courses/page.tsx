'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { categoriesService } from '@/services/categories.service';
import { coursesService } from '@/services/courses.service';
import type { Category, Course } from '@/types';
import CategoryBadge from '@/components/CategoryBadge';
import Button from '@/components/Button';

// ─── Delete confirmation modal ────────────────────────────────────────────────

interface DeleteModalProps {
    course: Course;
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}

function DeleteModal({ course, onConfirm, onCancel, loading }: DeleteModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-strong w-full max-w-md mx-4 p-6 animate-scale-in">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-base font-bold text-gray-900">Eliminar curso</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            ¿Estás seguro de que querés eliminar{' '}
                            <span className="font-semibold text-gray-700">"{course.name}"</span>?
                            Esta acción no se puede deshacer.
                        </p>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                        )}
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Actions dropdown ─────────────────────────────────────────────────────────

interface ActionsMenuProps {
    course: Course;
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    onToggleActive: () => void;
    onDelete: () => void;
    togglingActive: boolean;
}

function ActionsMenu({
    course,
    isOpen,
    onToggle,
    onClose,
    onToggleActive,
    onDelete,
    togglingActive,
}: ActionsMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose]);

    return (
        <div ref={menuRef} className="relative inline-block">
            <button
                onClick={onToggle}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                title="Acciones"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-medium z-20 overflow-hidden animate-scale-in origin-top-right">
                    {/* Ver en sitio */}
                    <a
                        href={`/courses/${course.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Ver en el sitio
                    </a>

                    {/* Editar */}
                    <Link
                        href={`/dashboard/courses/${course.id}/edit`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                    </Link>

                    {/* Activar / Desactivar */}
                    <button
                        onClick={() => { onToggleActive(); onClose(); }}
                        disabled={togglingActive}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {course.isActive ? (
                            <>
                                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                                Desactivar
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Activar
                            </>
                        )}
                    </button>

                    <div className="border-t border-gray-100 my-0.5" />

                    {/* Eliminar */}
                    <button
                        onClick={() => { onDelete(); onClose(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
    return (
        <tr className="animate-pulse border-b border-gray-100">
            <td className="px-4 py-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1.5" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
            </td>
            <td className="px-4 py-4">
                <div className="flex gap-1.5">
                    <div className="h-6 bg-gray-200 rounded-full w-16" />
                    <div className="h-6 bg-gray-200 rounded-full w-16" />
                </div>
            </td>
            <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
            <td className="px-4 py-4"><div className="h-6 bg-gray-200 rounded-full w-20" /></td>
            <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-24" /></td>
            <td className="px-4 py-4"><div className="h-8 bg-gray-200 rounded-lg w-8 ml-auto" /></td>
        </tr>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [searchName, setSearchName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

    // UI state
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    const fetchCourses = useCallback(async (categoryId?: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await coursesService.getAll({
                categoryId,
                limit: 100,
                page: 1,
            });
            setCourses(res.data);
        } catch {
            setError('No se pudieron cargar los cursos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        Promise.all([
            coursesService.getAll({ limit: 100, page: 1 }),
            categoriesService.getAll(),
        ])
            .then(([res, cats]) => {
                setCourses(res.data);
                setCategories(cats);
            })
            .catch(() => setError('No se pudieron cargar los datos.'))
            .finally(() => setLoading(false));
    }, []);

    const handleCategoryChange = (value: string) => {
        setSelectedCategoryId(value);
        fetchCourses(value ? parseInt(value) : undefined);
    };

    // Client-side name filter
    const filteredCourses = courses.filter((c) =>
        c.name.toLowerCase().includes(searchName.toLowerCase()),
    );

    const handleToggleActive = async (course: Course) => {
        setTogglingId(course.id);
        try {
            const updated = await coursesService.update(course.id, {
                isActive: !course.isActive,
            });
            setCourses((prev) =>
                prev.map((c) => (c.id === course.id ? { ...c, isActive: updated.isActive } : c)),
            );
        } catch {
            // silently ignore — could add a toast here
        } finally {
            setTogglingId(null);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeletingId(deleteTarget.id);
        try {
            await coursesService.remove(deleteTarget.id);
            setCourses((prev) => prev.filter((c) => c.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch {
            setError('No se pudo eliminar el curso. Intentá nuevamente.');
            setDeleteTarget(null);
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateStr: string | null) =>
        dateStr ? new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Cursos</h1>
                    <p className="text-gray-500 mt-1">
                        {!loading && `${filteredCourses.length} curso${filteredCourses.length !== 1 ? 's' : ''} encontrado${filteredCourses.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <Button href="/dashboard/courses/new" variant="primary" size="md">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Agregar curso
                </Button>
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
                {/* Search by name */}
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Buscar por nombre
                    </label>
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            placeholder="Ej: TypeScript, Diseño..."
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {searchName && (
                            <button
                                onClick={() => setSearchName('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Category filter */}
                <div className="min-w-[200px]">
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

                {/* Reset */}
                {(searchName || selectedCategoryId) && (
                    <button
                        onClick={() => { setSearchName(''); handleCategoryChange(''); }}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 pb-0.5 transition-colors self-end mb-0.5"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Limpiar
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wide">
                                    Curso
                                </th>
                                <th className="px-4 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wide">
                                    Categorías
                                </th>
                                <th className="px-4 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wide whitespace-nowrap">
                                    Año académico
                                </th>
                                <th className="px-4 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wide">
                                    Estado
                                </th>
                                <th className="px-4 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wide">
                                    Inicio
                                </th>
                                <th className="px-4 py-3 w-12" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                            ) : filteredCourses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-gray-400">
                                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="font-medium text-gray-500">
                                                {searchName || selectedCategoryId
                                                    ? 'No se encontraron cursos con esos filtros.'
                                                    : 'No hay cursos cargados todavía.'}
                                            </p>
                                            {!searchName && !selectedCategoryId && (
                                                <Button href="/dashboard/courses/new" variant="outline" size="sm">
                                                    Agregar el primer curso
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCourses.map((course) => {
                                    const categories = course.courseCategories
                                        ?.map((cc) => cc.category)
                                        .filter(Boolean) ?? [];

                                    return (
                                        <tr
                                            key={course.id}
                                            className="hover:bg-gray-50/70 transition-colors group"
                                        >
                                            {/* Nombre + organización */}
                                            <td className="px-4 py-4 max-w-xs">
                                                <p className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-800 transition-colors">
                                                    {course.name}
                                                </p>
                                                {course.organization && (
                                                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                                                        {course.organization.name}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Categorías */}
                                            <td className="px-4 py-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {categories.length > 0 ? (
                                                        categories.slice(0, 2).map((cat) => (
                                                            <CategoryBadge
                                                                key={cat!.id}
                                                                category={cat!}
                                                                className="text-xs px-2.5 py-1"
                                                            />
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">—</span>
                                                    )}
                                                    {categories.length > 2 && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                                            +{categories.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Año académico */}
                                            <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                                                {course.academicYear ?? '—'}
                                            </td>

                                            {/* Estado */}
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        course.isActive
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-500'
                                                    }`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${course.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
                                                    />
                                                    {course.isActive ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>

                                            {/* Fecha inicio */}
                                            <td className="px-4 py-4 text-gray-600 whitespace-nowrap text-xs">
                                                {formatDate(course.startDate)}
                                            </td>

                                            {/* Acciones */}
                                            <td className="px-4 py-4 text-right">
                                                <ActionsMenu
                                                    course={course}
                                                    isOpen={openMenuId === course.id}
                                                    onToggle={() =>
                                                        setOpenMenuId((prev) =>
                                                            prev === course.id ? null : course.id,
                                                        )
                                                    }
                                                    onClose={() => setOpenMenuId(null)}
                                                    onToggleActive={() => handleToggleActive(course)}
                                                    onDelete={() => setDeleteTarget(course)}
                                                    togglingActive={togglingId === course.id}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table footer with count */}
                {!loading && filteredCourses.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500">
                        Mostrando {filteredCourses.length} de {courses.length} curso{courses.length !== 1 ? 's' : ''}
                        {(searchName || selectedCategoryId) && ' (filtrado)'}
                    </div>
                )}
            </div>

            {/* Delete confirmation modal */}
            {deleteTarget && (
                <DeleteModal
                    course={deleteTarget}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deletingId === deleteTarget.id}
                />
            )}
        </div>
    );
}
