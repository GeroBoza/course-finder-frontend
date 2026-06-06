import { getToken } from '@/lib/auth-token';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export interface ApiResponse<T> {
    status: number;
    data: T;
}

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

function buildHeaders(options?: RequestInit): HeadersInit {
    const headers: Record<string, string> = {
        ...(options?.headers as Record<string, string>),
    };

    const isFormData = options?.body instanceof FormData;

    if (!isFormData && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

async function fetchApi<T>(
    endpoint: string,
    options?: RequestInit,
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: buildHeaders(options),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const message =
            err?.message ??
            err?.error ??
            err?.data?.message ??
            `API Error: ${response.status} ${response.statusText}`;
        throw new ApiError(
            Array.isArray(message) ? message.join(', ') : message,
            response.status,
        );
    }

    const result = await response.json();
    return result;
}

export { API_BASE_URL };
export default fetchApi;
