import type { Category } from '@/types';

interface CategoryBadgeProps {
    category: Category;
    className?: string;
}

export default function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
    return (
        <span
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200 shadow-sm ${className}`}
        >
            {category.name}
        </span>
    );
}

