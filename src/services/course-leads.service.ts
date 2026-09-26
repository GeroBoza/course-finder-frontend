import fetchApi from './api';
import type { CreateCourseLeadDto, CourseLead, CourseStats } from '@/types';

export const courseLeadsService = {
    async create(data: CreateCourseLeadDto): Promise<CourseLead> {
        const response = await fetchApi<CourseLead>('/course-leads', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.data;
    },

    async getStatsByCourse(courseId: number): Promise<CourseStats> {
        const response = await fetchApi<CourseStats>(
            `/course-leads/stats/${courseId}`,
        );
        return response.data;
    },
};

