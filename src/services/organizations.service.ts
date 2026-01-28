import fetchApi from './api';
import type { Organization } from '@/types';

export const organizationsService = {
    async getAll(): Promise<Organization[]> {
        const response = await fetchApi<Organization[]>('/organizations');
        return response.data;
    },

    async getById(id: number): Promise<Organization> {
        const response = await fetchApi<Organization>(`/organizations/${id}`);
        return response.data;
    },
};

