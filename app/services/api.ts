import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { getToken, clearToken } from './storage.service';

// Récupérer l'URL de l'API depuis les variables d'environnement
const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

// Créer l'instance Axios
const api = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur de requête: ajouter le token JWT
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await getToken();

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Intercepteur de réponse: gérer les erreurs globalement
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response) {
            const status = error.response.status;

            // Si 401 (non autorisé), supprimer le token
            if (status === 401) {
                await clearToken();
                // TODO: Rediriger vers la page de login
                // Cela sera géré dans le AuthContext
            }

            // Si 403 (interdit), l'utilisateur n'a pas accès
            if (status === 403) {
                console.error('Accès refusé');
            }

            // Si 500 (erreur serveur)
            if (status === 500) {
                console.error('Erreur serveur, veuillez réessayer plus tard');
            }
        } else if (error.request) {
            // Erreur réseau
            console.error('Erreur réseau: impossible de contacter le serveur');
        }

        return Promise.reject(error);
    }
);

export default api;
