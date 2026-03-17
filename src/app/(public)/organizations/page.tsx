import { organizationsService } from '@/services/organizations.service';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Organizaciones - Cursos Platform',
    description: 'Conocé las organizaciones que ofrecen cursos',
};

export default async function OrganizationsPage() {
    const organizations = await organizationsService.getAll();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
                Organizaciones
            </h1>

            {organizations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizations.map((org) => (
                        <div
                            key={org.id}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
                        >
                            {org.logoUrl && (
                                <div className="mb-4 h-32 flex items-center justify-center">
                                    <img
                                        src={org.logoUrl}
                                        alt={org.name}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                            )}
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                {org.name}
                            </h2>
                            {org.description && (
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {org.description}
                                </p>
                            )}
                            <div className="space-y-2">
                                {org.websiteUrl && (
                                    <a
                                        href={org.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-600 hover:text-primary-700 text-sm block"
                                    >
                                        Visitar sitio web →
                                    </a>
                                )}
                                {org.contactEmail && (
                                    <a
                                        href={`mailto:${org.contactEmail}`}
                                        className="text-primary-600 hover:text-primary-700 text-sm block"
                                    >
                                        {org.contactEmail}
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600 py-12">
                    No hay organizaciones disponibles.
                </p>
            )}
        </div>
    );
}

