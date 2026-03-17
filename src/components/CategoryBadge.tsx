import type { Category } from '@/types';

interface CategoryBadgeProps {
    category: Category;
    className?: string;
}

export default function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
    return (
        <span
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-blue-50 text-blue-900 border border-blue-300 shadow-sm ${className}`}
        >
            {category.name}
        </span>
    );
}

