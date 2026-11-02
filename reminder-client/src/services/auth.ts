import { apiClient } from './client';

export interface LoginPayload {
    identifier: string; // Supports email or phone number
    password: string;
}

export interface RegisterPayload {
    email: string;
    phoneNumber: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    userId: string;
    email: string;
    phoneNumber?: string;
}

export const authApi = {
    login: async (payload: LoginPayload): Promise<AuthResponse> => {
        const res = await apiClient.post<AuthResponse>('/auth/login', payload);
        return res.data;
    },

    register: async (payload: RegisterPayload): Promise<AuthResponse> => {
        const res = await apiClient.post<AuthResponse>('/auth/register', payload);
        return res.data;
    },
};