/**
 * Gravity score colors
 */
export const GRAVITY_COLORS = {
    1: '#10B981', // Green - Stable
    2: '#F59E0B', // Orange - Vigilance
    3: '#EF4444', // Red - Critical
} as const;

/**
 * Gravity score labels
 */
export const GRAVITY_LABELS = {
    1: 'Stable',
    2: 'Vigilance',
    3: 'Critique',
} as const;

/**
 * Trigger reason labels (français)
 */
export const TRIGGER_REASON_LABELS = {
    conversation_ended: 'Fin de conversation',
    high_gravity: 'Détresse détectée',
    message_threshold: 'Seuil de messages',
} as const;

/**
 * Polling intervals (ms)
 */
export const POLLING_INTERVALS = {
    LIVE_CONVERSATION: 3000, // 3 seconds
    DASHBOARD_REFRESH: 30000, // 30 seconds
} as const;

/**
 * Message constraints
 */
export const MESSAGE_CONSTRAINTS = {
    MAX_LENGTH: 2000,
    MIN_LENGTH: 1,
} as const;

/**
 * Numéros d'urgence
 */
export const EMERGENCY_NUMBERS = {
    SUICIDE_PREVENTION: '3114',
    SAMU: '15',
    POLICE: '17',
} as const;

export default {
    GRAVITY_COLORS,
    GRAVITY_LABELS,
    TRIGGER_REASON_LABELS,
    POLLING_INTERVALS,
    MESSAGE_CONSTRAINTS,
    EMERGENCY_NUMBERS,
};
