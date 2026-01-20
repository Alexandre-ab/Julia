import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@projet_j_token';

/**
 * Sauvegarder le JWT token
 */
export const saveToken = async (token: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du token:', error);
        throw error;
    }
};

/**
 * Récupérer le JWT token
 */
export const getToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
        console.error('Erreur lors de la récupération du token:', error);
        return null;
    }
};

/**
 * Supprimer le JWT token (logout)
 */
export const clearToken = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
        console.error('Erreur lors de la suppression du token:', error);
        throw error;
    }
};

export default {
    saveToken,
    getToken,
    clearToken,
};
