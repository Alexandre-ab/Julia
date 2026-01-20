import api from './api';
import { saveToken, clearToken } from './storage.service';
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    InviteToken,
    ValidateTokenResponse,
    User,
} from '../types/user.types';

/**
 * Connexion (patient ou pro)
 */
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    console.log('🔵 auth.service.login called with:', credentials);

    const response = await api.post<AuthResponse>('/auth/login', credentials);
    console.log('📦 Response from API:', response.data);

    // Sauvegarder le token
    if (response.data.token) {
        console.log('💾 Saving token...');
        await saveToken(response.data.token);
        console.log('✅ Token saved');
    }

    return response.data;
};

/**
 * Inscription patient (avec invite token)
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);

    // Sauvegarder le token
    if (response.data.token) {
        await saveToken(response.data.token);
    }

    return response.data;
};

/**
 * Déconnexion
 */
export const logout = async (): Promise<void> => {
    await clearToken();
};

/**
 * Générer un lien d'invitation (pro uniquement)
 */
export const generateInviteLink = async (): Promise<InviteToken> => {
    const response = await api.post<{ success: boolean } & InviteToken>('/auth/generate-invite');
    return {
        token: response.data.token,
        inviteLink: response.data.inviteLink,
        expiresAt: response.data.expiresAt,
    };
};

/**
 * Valider un token d'invitation
 */
export const validateInviteToken = async (token: string): Promise<ValidateTokenResponse> => {
    const response = await api.get<ValidateTokenResponse>(`/auth/validate-token/${token}`);
    return response.data;
};

/**
 * Récupérer le profil utilisateur courant
 */
export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get<{ success: boolean; user: User }>('/auth/me');
    return response.data.user;
};

export default {
    login,
    register,
    logout,
    generateInviteLink,
    validateInviteToken,
    getCurrentUser,
};
