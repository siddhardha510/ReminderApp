import { apiClient } from './client';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth';

export const authApi = {
    login: async (payload: LoginPayload): Promise<AuthResponse> => {
        const res = await apiClient.post<AuthResponse>('/auth/login', payload);
        return res.data;
    },

    register: async (payload: RegisterPayload): Promise<AuthResponse> => {
        const res = await apiClient.post<AuthResponse>('/auth/register', payload);
        return res.data;
    },

    logout: async (userId: string): Promise<void> => {
        await apiClient.post(`/auth/logout/${userId}`);
        localStorage.clear();
    },
};