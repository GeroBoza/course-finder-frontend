'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
    initialValue?: string;
    className?: string;
}

export default function SearchBar({ initialValue = '', className = '' }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState(initialValue);
    const router = useRouter();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/courses?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={className}>
            <div className="flex gap-3 shadow-2xl">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar cursos..."
                    className="flex-1 px-6 py-4 bg-white/95 backdrop-blur-sm border-2 border-white/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#c4a84a]/50 focus:border-[#b8962e] text-gray-900 placeholder-gray-400 shadow-lg text-lg font-medium transition-all duration-300"
                />
                <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-[#b8962e] to-[#9a7b26] text-white rounded-2xl hover:from-[#9a7b26] hover:to-[#7d631e] transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 text-lg"
                >
                    Buscar
                </button>
            </div>
        </form>
    );
}

