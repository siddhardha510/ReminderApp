export interface AuthResponse {
    userId: string;
    email?: string;
    phoneNumber?: string;
    accessToken: string;
    refreshToken: string;
}

export interface RegisterPayload {
    email?: string;
    phoneNumber?: string;
    password: string;
}

export interface LoginPayload {
    identifier: string;
    password: string;
}