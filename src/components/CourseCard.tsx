import type { Course } from '@/types';
import Link from 'next/link';
import Button from './Button';
import CategoryBadge from './CategoryBadge';

interface CourseCardProps {
    course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
    const mainImage =
        course.images?.find((img) => img.isMain) || course.images?.[0];
    const categories =
        course.courseCategories?.map((cc) => cc.category).filter(Boolean) || [];

    return (
        <div className="group flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            {mainImage && (
                <div className="h-52 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
                    <img
                        src={mainImage.imageUrl}
                        alt={course.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
            )}
            <div className="p-6 flex flex-col flex-1 min-h-0">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-800 transition-colors duration-200">
                    {course.name}
                </h3>
                {course.organization && (
                    <p className="text-gray-500 text-sm mb-3 font-medium">
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
