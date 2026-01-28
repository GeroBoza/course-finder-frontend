import fetchApi from './api';
import type { CreateCourseLeadDto, CourseLead } from '@/types';

export const courseLeadsService = {
    async create(data: CreateCourseLeadDto): Promise<CourseLead> {
        const response = await fetchApi<CourseLead>('/course-leads', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.data;
    },
};

