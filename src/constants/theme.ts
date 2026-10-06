import '@/global.css';

import { Platform } from 'react-native';

export const theme = {
  colors: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    primary: '#4F46E5',
    primarySoft: '#EEF2FF',
    text: '#0F172A',
    textMuted: '#64748B',
    border: '#E2E8F0',
    success: '#15803D',
    danger: '#B91C1C',
  },
} as const;

export const Colors = {
  light: {
    text: theme.colors.text,
    background: theme.colors.background,
    backgroundElement: theme.colors.surface,
    backgroundSelected: theme.colors.primarySoft,
    textSecondary: theme.colors.textMuted,
  },
  dark: {
    text: '#FFFFFF',
    background: '#0F172A',
    backgroundElement: '#1E293B',
    backgroundSelected: '#312E81',
    textSecondary: '#CBD5E1',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
