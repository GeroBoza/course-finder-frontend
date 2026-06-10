import type { Course } from '@/types';
import Link from 'next/link';
import Button from './Button';
import CategoryBadge from './CategoryBadge';
import CourseViewCount from './CourseViewCount';

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
            <div className="h-52 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
                {mainImage ? (
                    <img
                        src={mainImage.imageUrl}
                        alt={course.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg
                            className="w-16 h-16 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>
                )}
                <div className="absolute top-3 right-3 z-10">
                    <CourseViewCount course={course} variant="compact" />
                </div>
                {mainImage && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                )}
            </div>
            <div className="p-6 flex flex-col flex-1 min-h-0">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-800 transition-colors duration-200">
                    {course.name}
                </h3>
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
