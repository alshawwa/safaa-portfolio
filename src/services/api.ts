const API_URL = '/api';
export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('admin_token');

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
            errorData?.message || `API Error: ${response.status}`
        );
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export const api = {
    getProfile: () => apiRequest('/profile'),
    getProjects: () => apiRequest('/projects'),
    getCategories: () => apiRequest('/categories'),
    getServices: () => apiRequest('/services'),
    getSkills: () => apiRequest('/skills'),
    getSocialLinks: () => apiRequest('/social-links'),

    sendMessage: (data: {
        name: string;
        email: string;
        subject?: string;
        message: string;
    }) =>
        apiRequest('/messages', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};