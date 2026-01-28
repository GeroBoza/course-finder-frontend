import type { Category } from '@/types';

interface CategoryBadgeProps {
    category: Category;
    className?: string;
}

export default function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
    return (
        <span
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-100 to-primary-50 text-primary-800 border border-primary-200 shadow-sm ${className}`}
        >
            {category.name}
        </span>
    );
}

