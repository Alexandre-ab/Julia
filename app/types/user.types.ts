export type UserRole = 'patient' | 'pro';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    phone?: string;
    linkedProId?: string;
    linkedPro?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    createdAt: string;
    lastLoginAt?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    inviteToken: string;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}

export interface InviteToken {
    token: string;
    inviteLink: string;
    expiresAt: string;
}

export interface ValidateTokenResponse {
    success: boolean;
    valid: boolean;
    proName?: string;
    expiresAt?: string;
    message?: string;
}
