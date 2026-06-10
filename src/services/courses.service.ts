import type { Course, CoursesResponse, FilterCourseDto, CreateCourseDto, UpdateCourseDto, ImportResult, ViewCountResponse } from '@/types';
import fetchApi, { API_BASE_URL } from './api';
import { getToken } from '@/lib/auth-token';

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
        if (filters?.includeInactive) {
            params.append('includeInactive', 'true');
        }

        const queryString = params.toString();
        const endpoint = queryString ? `/courses?${queryString}` : '/courses';

        const response = await fetchApi<CoursesResponse>(endpoint);
        return response.data;
    },

    async getById(id: number): Promise<Course> {
        const response = await fetchApi<Course>(`/courses/${id}`);
        return response.data;
    },

    async registerView(id: number): Promise<ViewCountResponse> {
        const response = await fetchApi<ViewCountResponse>(`/courses/${id}/view`, {
            method: 'POST',
        });
        return response.data;
    },

    async create(data: CreateCourseDto): Promise<Course> {
        const response = await fetchApi<Course>('/courses', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.data;
    },

    async update(id: number, data: UpdateCourseDto): Promise<Course> {
        const response = await fetchApi<Course>(`/courses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response.data;
    },

    async remove(id: number): Promise<void> {
        await fetchApi<void>(`/courses/${id}`, { method: 'DELETE' });
    },

    async importFile(file: File): Promise<ImportResult> {
        const formData = new FormData();
        formData.append('file', file);

        const headers: Record<string, string> = {};
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/courses/import`, {
            method: 'POST',
            body: formData,
            headers,
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err?.message ?? `Error ${response.status}`);
        }

        const result = await response.json();
        return (result?.data ?? result) as ImportResult;
    },
};
