'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { organizationsService } from '@/services/organizations.service';
import type { CreateOrganizationDto, UpdateOrganizationDto } from '@/types';
import Button from '@/components/Button';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrganizationFormState {
    name: string;
    description: string;
    websiteUrl: string;
    contactEmail: string;
    logoUrl: string;
}

const emptyForm: OrganizationFormState = {
    name: '',
    description: '',
    websiteUrl: '',
    contactEmail: '',
    logoUrl: '',
};

interface OrganizationFormProps {
    mode: 'create' | 'edit';
    organizationId?: number;
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function FormSkeleton() {
    return (
        <div className="animate-pulse max-w-3xl">
            <div className="h-4 bg-gray-200 rounded w-20 mb-6" />
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="bg-white rounded-2xl p-8 space-y-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i}>
                        <div className="h-4 bg-gray-200 rounded w-28 mb-2" />
                        <div className="h-10 bg-gray-200 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Field component ──────────────────────────────────────────────────────────

interface FieldProps {
    id: string;
    label: string;
    required?: boolean;
    optional?: boolean;
    hint?: string;
    children: React.ReactNode;
}

function Field({ id, label, required, optional, hint, children }: FieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
                {label}{' '}
                {required && <span className="text-red-500">*</span>}
                {optional && <span className="text-gray-400 font-normal">(opcional)</span>}
            </label>
            {children}
            {hint && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OrganizationForm({ mode, organizationId }: OrganizationFormProps) {
    const router = useRouter();

    const [form, setForm] = useState<OrganizationFormState>(emptyForm);
    const [loadingData, setLoadingData] = useState(mode === 'edit');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [logoPreviewError, setLogoPreviewError] = useState(false);

    const isEdit = mode === 'edit';

    // ── Load organization in edit mode ────────────────────────────────────────
    useEffect(() => {
        if (!isEdit || !organizationId) return;

        organizationsService
            .getById(organizationId)
            .then((org) => {
                setForm({
                    name: org.name,
                    description: org.description ?? '',
                    websiteUrl: org.websiteUrl ?? '',
                    contactEmail: org.contactEmail ?? '',
                    logoUrl: org.logoUrl ?? '',
                });
            })
            .catch(() => setError('No se pudo cargar la organización para editar.'))
            .finally(() => setLoadingData(false));
    }, [isEdit, organizationId]);

    // ── Form handlers ─────────────────────────────────────────────────────────
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (name === 'logoUrl') setLogoPreviewError(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        setSubmitting(true);
        try {
            if (isEdit && organizationId) {
                const dto: UpdateOrganizationDto = {
                    name: form.name.trim(),
                    description: form.description.trim() || undefined,
                    websiteUrl: form.websiteUrl.trim() || undefined,
                    contactEmail: form.contactEmail.trim() || undefined,
                    logoUrl: form.logoUrl.trim() || undefined,
                };
                await organizationsService.update(organizationId, dto);
                setSuccess(true);
                setTimeout(() => router.push('/dashboard/organizations'), 1500);
            } else {
                const dto: CreateOrganizationDto = {
                    name: form.name.trim(),
                    description: form.description.trim() || undefined,
                    websiteUrl: form.websiteUrl.trim() || undefined,
                    contactEmail: form.contactEmail.trim() || undefined,
                    logoUrl: form.logoUrl.trim() || undefined,
                };
                await organizationsService.create(dto);
                setSuccess(true);
                setForm(emptyForm);
            }
        } catch {
            setError(
                isEdit
                    ? 'Ocurrió un error al guardar los cambios. Revisá los datos e intentá nuevamente.'
                    : 'Ocurrió un error al crear la organización. Revisá los datos e intentá nuevamente.',
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    if (loadingData) return <FormSkeleton />;

    const title = isEdit ? 'Editar organización' : 'Agregar organización';
    const subtitle = isEdit
        ? 'Modificá los datos de la organización y guardá los cambios.'
        : 'Completá los datos para registrar una nueva organización en la plataforma.';
    const successMessage = isEdit ? '¡Cambios guardados! Redirigiendo...' : '¡Organización creada exitosamente!';
    const submitLabel = isEdit ? 'Guardar cambios' : 'Crear organización';

    const hasLogoPreview = form.logoUrl.trim() && !logoPreviewError;

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
                        <button onClick={() => setSuccess(false)} className="ml-auto text-green-600 hover:text-green-800">
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

                {/* Nombre */}
                <Field id="name" label="Nombre de la organización" required>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ej: Universidad Nacional de Buenos Aires"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </Field>

                {/* Descripción */}
                <Field id="description" label="Descripción" optional>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describí brevemente la organización, su misión y su oferta educativa..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                    />
                </Field>

                {/* Sitio web + Email (en grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                        id="websiteUrl"
                        label="Sitio web"
                        optional
                        hint='Incluí el protocolo: "https://"'
                    >
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                            </svg>
                            <input
                                type="url"
                                id="websiteUrl"
                                name="websiteUrl"
                                value={form.websiteUrl}
                                onChange={handleChange}
                                placeholder="https://ejemplo.edu.ar"
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                    </Field>

                    <Field id="contactEmail" label="Email de contacto" optional>
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <input
                                type="email"
                                id="contactEmail"
                                name="contactEmail"
                                value={form.contactEmail}
                                onChange={handleChange}
                                placeholder="contacto@ejemplo.edu.ar"
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                    </Field>
                </div>

                {/* Logo URL + preview */}
                <Field
                    id="logoUrl"
                    label="URL del logo"
                    optional
                    hint="Ingresá la URL directa a la imagen del logo (JPG, PNG, SVG, WebP)."
                >
                    <input
                        type="url"
                        id="logoUrl"
                        name="logoUrl"
                        value={form.logoUrl}
                        onChange={handleChange}
                        placeholder="https://ejemplo.edu.ar/logo.png"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    {/* Logo preview */}
                    <div className="mt-3">
                        {hasLogoPreview ? (
                            <div className="flex items-center gap-3">
                                <div className="w-20 h-20 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={form.logoUrl}
                                        alt="Preview del logo"
                                        className="max-w-full max-h-full object-contain p-1"
                                        onError={() => setLogoPreviewError(true)}
                                    />
                                </div>
                                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Logo cargado correctamente
                                </p>
                            </div>
                        ) : form.logoUrl.trim() && logoPreviewError ? (
                            <p className="text-xs text-amber-600 flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856C18.448 19 19 18.105 19 17V7c0-1.105-.552-2-1.234-2H6.234C5.552 5 5 5.895 5 7v10c0 1.105.552 2 1.828 2z" />
                                </svg>
                                No se pudo cargar la imagen desde esa URL
                            </p>
                        ) : null}
                    </div>
                </Field>

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
