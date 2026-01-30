import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add JWT token if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Auto-logout (Clear token and redirect)
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                // window.location.href = '/login'; // Optional: Redirect
            }
        }
        return Promise.reject(error);
    }
);

export default api;
