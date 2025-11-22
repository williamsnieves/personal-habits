/**
 * Type-safe API client for frontend data fetching
 * Provides consistent error handling and response parsing
 */

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new ApiError(
            response.status,
            error.error || 'Request failed',
            error.details
        );
    }
    return response.json();
}

export const apiClient = {
    async get<T>(url: string): Promise<T> {
        const response = await fetch(url);
        return handleResponse<T>(response);
    },

    async post<T>(url: string, data?: unknown): Promise<T> {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data ? JSON.stringify(data) : undefined,
        });
        return handleResponse<T>(response);
    },

    async put<T>(url: string, data: unknown): Promise<T> {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse<T>(response);
    },

    async delete<T>(url: string): Promise<T> {
        const response = await fetch(url, { method: 'DELETE' });
        return handleResponse<T>(response);
    },
};
