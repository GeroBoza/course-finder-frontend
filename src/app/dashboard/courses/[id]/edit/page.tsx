'use client';

import { useParams } from 'next/navigation';
import CourseForm from '@/components/CourseForm';

export default function EditCoursePage() {
    const params = useParams();
    const courseId = parseInt(params.id as string);

    return <CourseForm mode="edit" courseId={courseId} />;
}
