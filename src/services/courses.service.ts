import type { Course, CoursesResponse, FilterCourseDto } from '@/types';
import fetchApi from './api';

export const coursesService = {
    async getAll(filters?: FilterCourseDto): Promise<CoursesResponse> {
        const params = new URLSearchParams();
        if (filters?.categoryId) {
            params.append('categoryId', filters.categoryId.toString());
        }
        if (filters?.organizationId) {
            params.append('organizationId', filters.organizationId.toString());
        }
        if (filters?.academicYear) {
            params.append('academicYear', filters.academicYear);
        }
        if (filters?.page) {
            params.append('page', filters.page.toString());
        }
        if (filters?.limit) {
            params.append('limit', filters.limit.toString());
        }

        const queryString = params.toString();
        const endpoint = queryString ? `/courses?${queryString}` : '/courses';

        const response = await fetchApi<CoursesResponse>(endpoint);
        console.log(response);
        return response.data;
    },

    async getById(id: number): Promise<Course> {
        const response = await fetchApi<Course>(`/courses/${id}`);
        return response.data;
    },
};
