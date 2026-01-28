'use client';

import { useState, useEffect } from 'react';
import type { Course } from '@/types';
import CourseCard from './CourseCard';

interface CourseCarouselProps {
    courses: Course[];
}

export default function CourseCarousel({ courses }: CourseCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCourses, setVisibleCourses] = useState<Course[]>([]);

    useEffect(() => {
        const itemsPerPage = 3;
        const start = currentIndex * itemsPerPage;
        const end = start + itemsPerPage;
        setVisibleCourses(courses.slice(start, end));
    }, [currentIndex, courses]);

    const next = () => {
        const maxIndex = Math.ceil(courses.length / 3) - 1;
        setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    };

    const prev = () => {
        const maxIndex = Math.ceil(courses.length / 3) - 1;
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    };

    if (courses.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
            {courses.length > 3 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                        aria-label="Anterior"
                    >
                        <svg
                            className="w-6 h-6 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                        aria-label="Siguiente"
                    >
                        <svg
                            className="w-6 h-6 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </>
            )}
        </div>
    );
}

