/**
 * Unified color system for the entire application
 * Use these constants instead of hardcoded hex values
 */

export const COLORS = {
  // Primary (Rose Ancien - Chaleur & Réconfort)
  primary: {
    50: '#FBF2F3',   // Tint 90% — quasi blanc rosé (fonds subtils)
    100: '#F3DADE',  // Tint 70% — rose très pâle (fonds, badges)
    200: '#E4BCC1',  // Tint 50% — rose poudré clair (hover, accents doux)
    300: '#D4A4AA',  // Tint 30% — rose doux (états secondaires)
    400: '#C38D94',  // ← TA couleur de base ici
    500: '#B07A82',  // Shade légère — boutons principaux, liens
    600: '#9C6B73',  // Shade moyenne — boutons pressed, texte actif
    700: '#7D5259',  // Shade forte — headers, éléments importants
    800: '#5E3D43',  // Shade profonde — texte sur fond clair
    900: '#3F282D',  // Shade maximale — mode sombre, contrastes forts
  },


  // Emerald (Sage Green alternative)
  emerald: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  // Slate (Calming backgrounds)
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Rose (Soft SOS button)
  rose: {
    50: '#FFF1F2',
    100: '#FFE4E6',
    200: '#FECDD3',
    300: '#FDA4AF',
    400: '#FB7185',
    500: '#F43F5E',
    600: '#E11D48',
    700: '#BE123C',
    800: '#9F1239',
    900: '#881337',
  },

  // Secondary (Gray)
  secondary: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Gravity scores
  gravity: {
    stable: '#10B981',    // Green
    vigilance: '#F59E0B', // Orange
    critical: '#EF4444',  // Red
  },

  // Functional colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Backgrounds (tons chauds au lieu de blanc froid)
  background: {
    primary: '#FFFBFB',   // Blanc très légèrement rosé
    secondary: '#FBF2F3', // Rose 50 — fond secondaire chaud
    tertiary: '#F3DADE',  // Rose 100 — fond tertiaire
  },

  // Text (brun chaud au lieu de noir/gris froid)
  text: {
    primary: '#3F282D',   // Rose 900 — texte principal brun chaud
    secondary: '#7D5259', // Rose 700 — texte secondaire
    tertiary: '#B07A82',  // Rose 500 — texte discret
    inverse: '#FFFBFB',   // Blanc chaud pour texte sur fond foncé
  },

  // Borders (teintes chaudes)
  border: {
    light: '#F3DADE',     // Rose 100
    medium: '#E4BCC1',    // Rose 200
    dark: '#D4A4AA',      // Rose 300
  },

  // Gradients for modern UI
  gradients: {
    primary: ['#C38D94', '#9C6B73'],      // Rose 400 → 600
    secondary: ['#C38D94', '#B07A82'],    // Rose 400 → 500 (subtil)
    success: ['#10B981', '#059669'],      // Emerald gradient
    danger: ['#EF4444', '#DC2626'],       // Red gradient
    warning: ['#F59E0B', '#D97706'],      // Orange gradient
    subtle: ['#FBF2F3', '#F3DADE'],       // Rose 50 → 100 (fond doux)
    card: ['#FFFFFF', '#FBF2F3'],         // Blanc → Rose 50
    header: ['#B07A82', '#7D5259'],       // Rose 500 → 700 (affirmé)
    rose: ['#FB7185', '#E11D48'],         // Rose gradient for SOS
  },
} as const;

// Export individual color sets for convenience
export const PRIMARY = COLORS.primary[600];
export const SECONDARY = COLORS.secondary[600];

export default COLORS;
