import fetchApi from './api';
import type { Category } from '@/types';

export const categoriesService = {
    async getAll(): Promise<Category[]> {
        const response = await fetchApi<Category[]>('/categories');
        return response.data;
    },
};

