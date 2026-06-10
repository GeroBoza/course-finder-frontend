import type { Course } from '@/types';
import Link from 'next/link';
import Button from './Button';
import CategoryBadge from './CategoryBadge';
import CourseViewCount from './CourseViewCount';

interface CourseCardProps {
    course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
    const categories =
        course.courseCategories?.map((cc) => cc.category).filter(Boolean) || [];

    return (
        <div className="group flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div className="p-6 flex flex-col flex-1 min-h-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-800 transition-colors duration-200">
                        {course.name}
                    </h3>
                    <CourseViewCount
                        course={course}
                        variant="compact"
                        className="flex-shrink-0"
                    />
                </div>
                {course.organization && (
                    <p className="text-gray-500 text-sm mb-3 font-medium line-clamp-1">
                        {course.organization.name}
                    </p>
                )}
                {course.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {course.description}
                    </p>
                )}
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                        {categories.slice(0, 3).map((category) => (
                            <CategoryBadge
                                key={category!.id}
                                category={category!}
                            />
                        ))}
                    </div>
                )}
                <Link href={`/courses/${course.id}`} className="mt-auto pt-2">
                    <Button
                        variant="primary"
                        size="sm"
                        className="w-full group-hover:shadow-lg"
                    >
                        Ver más
                    </Button>
                </Link>
            </div>
        </div>
    );
}
