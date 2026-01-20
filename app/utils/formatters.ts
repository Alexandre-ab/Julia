import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formater une date en "il y a X temps"
 * Ex: "il y a 2 heures"
 */
export const formatRelativeTime = (date: string | Date): string => {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return formatDistanceToNow(dateObj, { addSuffix: true, locale: fr });
    } catch (error) {
        return '';
    }
};

/**
 * Formater une date en format complet
 * Ex: "20 janvier 2026 à 14:30"
 */
export const formatFullDate = (date: string | Date): string => {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, "d MMMM yyyy 'à' HH:mm", { locale: fr });
    } catch (error) {
        return '';
    }
};

/**
 * Formater une date courte
 * Ex: "20/01/2026"
 */
export const formatShortDate = (date: string | Date): string => {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, 'dd/MM/yyyy');
    } catch (error) {
        return '';
    }
};

/**
 * Formater une heure
 * Ex: "14:30"
 */
export const formatTime = (date: string | Date): string => {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, 'HH:mm');
    } catch (error) {
        return '';
    }
};

/**
 * Tronquer un texte avec ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
};

/**
 * Formater un nom complet
 */
export const formatFullName = (firstName: string, lastName: string): string => {
    return `${firstName} ${lastName}`;
};

/**
 * Obtenir les initiales
 * Ex: "Sophie Martin" -> "SM"
 */
export const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export default {
    formatRelativeTime,
    formatFullDate,
    formatShortDate,
    formatTime,
    truncateText,
    formatFullName,
    getInitials,
};
