import type { Metadata } from 'next';
import RootProviders from '@/components/providers/RootProviders';
import './globals.css';

export const metadata: Metadata = {
    title: 'Cursos Platform - Encontrá el curso ideal',
    description:
        'Buscador de cursos de instituciones de todo el país. Encontrá el curso ideal para tu desarrollo profesional.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className="font-sans">
                <RootProviders>{children}</RootProviders>
            </body>
        </html>
    );
}

