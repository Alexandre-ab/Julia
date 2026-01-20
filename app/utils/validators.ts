/**
 * Valider un email
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valider la force d'un mot de passe
 * Retourne un objet avec la validité et les erreurs
 */
export const validatePassword = (password: string): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Le mot de passe doit faire minimum 8 caractères');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins une majuscule');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins un chiffre');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Obtenir la force du mot de passe (0-100)
 */
export const getPasswordStrength = (password: string): number => {
    let strength = 0;

    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15; // Caractères spéciaux

    return Math.min(strength, 100);
};

/**
 * Valider un numéro de téléphone français
 */
export const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+33[1-9]\d{8}$/;
    return phoneRegex.test(phone);
};

/**
 * Valider la longueur d'un message
 */
export const isValidMessageLength = (message: string, maxLength: number = 2000): boolean => {
    return message.trim().length > 0 && message.length <= maxLength;
};

export default {
    isValidEmail,
    validatePassword,
    getPasswordStrength,
    isValidPhoneNumber,
    isValidMessageLength,
};
