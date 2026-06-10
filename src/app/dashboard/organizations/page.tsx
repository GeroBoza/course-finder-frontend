'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { organizationsService } from '@/services/organizations.service';
import type { Organization } from '@/types';
import Button from '@/components/Button';

// ─── Delete modal ─────────────────────────────────────────────────────────────

interface DeleteModalProps {
    org: Organization;
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}

function DeleteModal({ org, onConfirm, onCancel, loading }: DeleteModalProps) {
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
                        <h3 className="text-base font-bold text-gray-900">Eliminar organización</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            ¿Estás seguro de que querés eliminar{' '}
                            <span className="font-semibold text-gray-700">"{org.name}"</span>?
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
    org: Organization;
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    onDelete: () => void;
}

function ActionsMenu({ org, isOpen, onToggle, onClose, onDelete }: ActionsMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
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
                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-medium z-20 overflow-hidden animate-scale-in origin-top-right">
                    {/* Ver en sitio */}
                    <a
                        href={org.websiteUrl ?? undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            org.websiteUrl
                                ? 'text-gray-700 hover:bg-gray-50'
                                : 'text-gray-300 cursor-not-allowed pointer-events-none'
                        }`}
                    >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Ver sitio web
                    </a>

                    {/* Editar */}
                    <Link
                        href={`/dashboard/organizations/${org.id}/edit`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                    </Link>

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
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl flex-shrink-0" />
                    <div className="h-4 bg-gray-200 rounded w-40" />
                </div>
            </td>
            <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-full" /></td>
            <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-32" /></td>
            <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-40" /></td>
            <td className="px-4 py-4"><div className="h-8 bg-gray-200 rounded-lg w-8 ml-auto" /></td>
        </tr>
    );
}

// ─── Logo avatar ──────────────────────────────────────────────────────────────

function LogoAvatar({ org }: { org: Organization }) {
    const [imgError, setImgError] = useState(false);

    if (org.logoUrl && !imgError) {
        return (
            <div className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                <img
                    src={org.logoUrl}
                    alt={org.name}
                    className="max-w-full max-h-full object-contain p-1"
                    onError={() => setImgError(true)}
                />
            </div>
        );
    }

    return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-blue-700">
                {org.name.charAt(0).toUpperCase()}
            </span>
        </div>
    );
}

type CopyListState = 'idle' | 'copied' | 'error';

function formatOrganizationsForClipboard(organizations: Organization[]): string {
    if (organizations.length === 0) {
        return 'No hay organizaciones cargadas en la plataforma.';
    }

    return [...organizations]
        .sort((a, b) => a.name.localeCompare(b.name, 'es'))
        .map((org) => `- ${org.name}`)
        .join('\n');
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardOrganizationsPage() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copyListState, setCopyListState] = useState<CopyListState>('idle');

    const [searchName, setSearchName] = useState('');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Organization | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchOrganizations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await organizationsService.getAll();
            setOrganizations(data);
        } catch {
            setError('No se pudieron cargar las organizaciones.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrganizations();
    }, [fetchOrganizations]);

    const filteredOrgs = organizations.filter((o) =>
        o.name.toLowerCase().includes(searchName.toLowerCase()),
    );

    const handleCopyOrganizationsList = async () => {
        try {
            const text = formatOrganizationsForClipboard(organizations);
            await navigator.clipboard.writeText(text);
            setCopyListState('copied');
            window.setTimeout(() => setCopyListState('idle'), 3000);
        } catch {
            setCopyListState('error');
            window.setTimeout(() => setCopyListState('idle'), 4000);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeletingId(deleteTarget.id);
        try {
            await organizationsService.remove(deleteTarget.id);
            setOrganizations((prev) => prev.filter((o) => o.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (err) {
            const message =
                err instanceof Error && err.message
                    ? err.message
                    : 'No se pudo eliminar la organización. Intentá nuevamente.';
            setError(message);
            setDeleteTarget(null);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Organizaciones</h1>
                    <p className="text-gray-500 mt-1">
                        {!loading && `${filteredOrgs.length} organización${filteredOrgs.length !== 1 ? 'es' : ''} encontrada${filteredOrgs.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        type="button"
                        onClick={handleCopyOrganizationsList}
                        disabled={loading || organizations.length === 0}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-violet-900 bg-violet-50 border border-violet-200 rounded-xl hover:bg-violet-100 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {copyListState === 'copied' ? (
                            <>
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                ¡Copiado!
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copiar listado de organizaciones
                            </>
                        )}
                    </button>
                    <Button href="/dashboard/organizations/new" variant="primary" size="md">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Agregar organización
                    </Button>
                </div>
            </div>

            {copyListState === 'error' && (
                <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    No se pudo copiar el listado. Verificá los permisos del navegador e intentá de nuevo.
                </div>
            )}

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

            {/* Search bar */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-soft px-5 py-4 mb-6">
                <div className="flex items-end gap-4 flex-wrap">
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
                                placeholder="Ej: Universidad, Instituto..."
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
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wide">
                                    Organización
                                </th>
                                <th className="px-4 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wide">
                                    Descripción
                                </th>
                                <th className="px-4 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wide">
                                    Sitio web
                                </th>
                                <th className="px-4 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wide">
                                    Email de contacto
                                </th>
                                <th className="px-4 py-3 w-12" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                            ) : filteredOrgs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-gray-400">
                                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <p className="font-medium text-gray-500">
                                                {searchName
                                                    ? 'No se encontraron organizaciones con ese nombre.'
                                                    : 'No hay organizaciones registradas todavía.'}
                                            </p>
                                            {!searchName && (
                                                <Button href="/dashboard/organizations/new" variant="outline" size="sm">
                                                    Agregar la primera organización
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrgs.map((org) => (
                                    <tr key={org.id} className="hover:bg-gray-50/70 transition-colors group">
                                        {/* Nombre + logo */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <LogoAvatar org={org} />
                                                <span className="font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">
                                                    {org.name}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Descripción */}
                                        <td className="px-4 py-3.5 max-w-xs">
                                            {org.description ? (
                                                <p className="text-gray-600 line-clamp-2 text-xs leading-relaxed">
                                                    {org.description}
                                                </p>
                                            ) : (
                                                <span className="text-gray-400 text-xs">—</span>
                                            )}
                                        </td>

                                        {/* Sitio web */}
                                        <td className="px-4 py-3.5">
                                            {org.websiteUrl ? (
                                                <a
                                                    href={org.websiteUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 hover:underline text-xs truncate max-w-[160px] block transition-colors"
                                                >
                                                    {org.websiteUrl.replace(/^https?:\/\//, '')}
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-xs">—</span>
                                            )}
                                        </td>

                                        {/* Email */}
                                        <td className="px-4 py-3.5">
                                            {org.contactEmail ? (
                                                <a
                                                    href={`mailto:${org.contactEmail}`}
                                                    className="text-gray-600 hover:text-blue-700 text-xs transition-colors"
                                                >
                                                    {org.contactEmail}
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-xs">—</span>
                                            )}
                                        </td>

                                        {/* Acciones */}
                                        <td className="px-4 py-3.5 text-right">
                                            <ActionsMenu
                                                org={org}
                                                isOpen={openMenuId === org.id}
                                                onToggle={() =>
                                                    setOpenMenuId((prev) =>
                                                        prev === org.id ? null : org.id,
                                                    )
                                                }
                                                onClose={() => setOpenMenuId(null)}
                                                onDelete={() => setDeleteTarget(org)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                {!loading && filteredOrgs.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500">
                        Mostrando {filteredOrgs.length} de {organizations.length} organización{organizations.length !== 1 ? 'es' : ''}
                        {searchName && ' (filtrado)'}
                    </div>
                )}
            </div>

            {/* Delete modal */}
            {deleteTarget && (
                <DeleteModal
                    org={deleteTarget}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deletingId === deleteTarget.id}
                />
            )}
        </div>
    );
}
