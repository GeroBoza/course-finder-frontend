import type { Course } from '@/types';
import { formatViewCount, formatViewLabel } from '@/lib/course-views';

interface CourseViewCountProps {
    course: Course;
    className?: string;
    size?: 'sm' | 'md';
    variant?: 'default' | 'compact';
}

export default function CourseViewCount({
    course,
    className = '',
    size = 'sm',
    variant = 'default',
}: CourseViewCountProps) {
    const count = course.viewCount ?? 0;
    const iconSize = size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5';
    const textSize = size === 'md' ? 'text-sm' : 'text-xs';
    const isCompact = variant === 'compact';

    return (
        <span
            className={`inline-flex items-center gap-1 text-gray-500 ${textSize} ${
                isCompact
                    ? 'px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-gray-600'
                    : ''
            } ${className}`}
            title={formatViewLabel(count)}
        >
            <svg
                className={`${iconSize} flex-shrink-0 ${isCompact ? 'text-gray-500' : 'text-gray-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
            </svg>
            <span className="font-medium whitespace-nowrap">
                {isCompact ? formatViewCount(count) : formatViewLabel(count)}
            </span>
        </span>
    );
}
