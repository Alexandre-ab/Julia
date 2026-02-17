import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
    // Backgrounds
    bg: string;
    bgSecondary: string;
    bgTertiary: string;
    bgCard: string;
    bgElevated: string;

    // Text
    text: string;
    textSecondary: string;
    textTertiary: string;
    textInverse: string;

    // Borders
    border: string;
    borderLight: string;

    // Surfaces
    surface: string;
    surfaceHover: string;

    // Tab bar
    tabBar: string;
    tabBarBorder: string;

    // Input
    inputBg: string;
    inputBorder: string;
    inputBorderFocus: string;

    // Overlays
    overlay: string;
    shadowColor: string;
}

interface ThemeContextType {
    mode: ThemeMode;
    isDark: boolean;
    colors: ThemeColors;
    setMode: (mode: ThemeMode) => void;
    toggle: () => void;
}

const lightColors: ThemeColors = {
    bg: '#FFFBFB',          // Blanc chaud légèrement rosé
    bgSecondary: '#FBF2F3', // Rose 50
    bgTertiary: '#F3DADE',  // Rose 100
    bgCard: '#FFFBFB',      // Blanc chaud
    bgElevated: '#FFFFFF',  // Blanc pur pour éléments surélevés

    text: '#3F282D',        // Rose 900 — brun chaud
    textSecondary: '#7D5259', // Rose 700
    textTertiary: '#B07A82',  // Rose 500
    textInverse: '#FFFBFB',

    border: '#E4BCC1',      // Rose 200
    borderLight: '#F3DADE', // Rose 100

    surface: '#FBF2F3',     // Rose 50
    surfaceHover: '#F3DADE', // Rose 100

    tabBar: 'rgba(255, 251, 251, 0.95)', // Blanc chaud translucide
    tabBarBorder: 'rgba(63, 40, 45, 0.08)', // Brun chaud subtil

    inputBg: '#FBF2F3',     // Rose 50
    inputBorder: '#E4BCC1', // Rose 200
    inputBorderFocus: '#C38D94', // Rose 400 — ta couleur de base

    overlay: 'rgba(63, 40, 45, 0.5)', // Overlay brun chaud
    shadowColor: '#3F282D', // Ombre chaude
};

const darkColors: ThemeColors = {
    bg: '#1A1214',          // Brun très foncé chaud
    bgSecondary: '#261B1E', // Brun foncé
    bgTertiary: '#3F282D',  // Rose 900
    bgCard: '#261B1E',      // Brun foncé
    bgElevated: '#332226',  // Brun moyen

    text: '#FBF2F3',        // Rose 50 — texte clair chaud
    textSecondary: '#D4A4AA', // Rose 300
    textTertiary: '#9C6B73',  // Rose 600
    textInverse: '#1A1214',

    border: '#3F282D',      // Rose 900
    borderLight: '#261B1E',

    surface: '#261B1E',
    surfaceHover: '#3F282D',

    tabBar: 'rgba(26, 18, 20, 0.95)', // Brun foncé translucide
    tabBarBorder: 'rgba(251, 242, 243, 0.06)',

    inputBg: '#261B1E',
    inputBorder: '#3F282D',
    inputBorderFocus: '#C38D94', // Rose 400

    overlay: 'rgba(26, 18, 20, 0.7)',
    shadowColor: '#000000',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@projet_j_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemScheme = useColorScheme();
    const [mode, setModeState] = useState<ThemeMode>('system');

    useEffect(() => {
        AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
            if (stored === 'light' || stored === 'dark' || stored === 'system') {
                setModeState(stored);
            }
        });
    }, []);

    const isDark =  false; //mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
    const colors = isDark ? darkColors : lightColors;

    const setMode = useCallback((newMode: ThemeMode) => {
        setModeState(newMode);
        AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    }, []);

    const toggle = useCallback(() => {
        const newMode = isDark ? 'light' : 'dark';
        setMode(newMode);
    }, [isDark, setMode]);

    return (
        <ThemeContext.Provider value={{ mode, isDark, colors, setMode, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export default ThemeContext;
