import Link from 'next/link';

export default function DashboardPage() {
    const quickActions = [
        {
            label: 'Agregar curso',
            description: 'Crear un nuevo curso en la plataforma',
            href: '/dashboard/courses/new',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            ),
        },
        {
            label: 'Agregar organización',
            description: 'Registrar una nueva institución en el catálogo',
            href: '/dashboard/organizations/new',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
        },
    ];

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Panel de administración de CapaContinua</p>
            </div>

            <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Acciones rápidas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-700 mb-4 group-hover:from-[#f5f0e1] group-hover:to-[#e8dfc4] group-hover:text-[#8f7324] transition-all duration-300">
                                {action.icon}
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-1">{action.label}</h3>
                            <p className="text-sm text-gray-500">{action.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
