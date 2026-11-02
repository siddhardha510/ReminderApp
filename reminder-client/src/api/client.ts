import axios from 'axios';

//const BASE_URL = 'https://localhost:44399/api';
// Point to the Dockerized API endpoint
//const BASE_URL = 'http://localhost:5000/api';
export const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            const userId = localStorage.getItem('userId');

            if (refreshToken && userId) {
                try {
                    const res = await axios.post(`${BASE_URL}/auth/refresh`, {
                        userId,
                        refreshToken,
                    });

                    const { accessToken, refreshToken: newRefreshToken } = res.data;
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                } catch {
                    localStorage.clear();
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);