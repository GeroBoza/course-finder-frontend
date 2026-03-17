import fetchApi from './api';
import type { Organization, CreateOrganizationDto, UpdateOrganizationDto } from '@/types';

export const organizationsService = {
    async getAll(): Promise<Organization[]> {
        const response = await fetchApi<Organization[]>('/organizations');
        return response.data;
    },

    async getById(id: number): Promise<Organization> {
        const response = await fetchApi<Organization>(`/organizations/${id}`);
        return response.data;
    },

    async create(data: CreateOrganizationDto): Promise<Organization> {
        const response = await fetchApi<Organization>('/organizations', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.data;
    },

    async update(id: number, data: UpdateOrganizationDto): Promise<Organization> {
        const response = await fetchApi<Organization>(`/organizations/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response.data;
    },

    async remove(id: number): Promise<void> {
        await fetchApi<void>(`/organizations/${id}`, { method: 'DELETE' });
    },
};

