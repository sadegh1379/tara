import { Platform } from 'react-native';

export const Colors = {
  // Primary palette
  indigo: '#6366F1',
  indigoDeep: '#4F46E5',
  violet: '#8B5CF6',
  pink: '#EC4899',
  pinkSoft: '#FBCFE8',

  // Semantic
  success: '#10B981',
  amber: '#F59E0B',
  error: '#EF4444',
  warning: '#F59E0B',

  // Light mode text
  text: '#0F172A',
  text2: '#475569',
  text3: '#94A3B8',

  // Light mode surfaces
  bg: '#FFFFFF',
  bg2: '#F8FAFC',
  border: '#E2E8F0',
  cardBorder: 'rgba(148,163,184,0.14)',

  // Dark mode
  d_bg: '#0B0F1E',
  d_card: '#161B2E',
  d_card2: '#1F2540',
  d_border: 'rgba(255,255,255,0.08)',
  d_text: '#F1F5F9',
  d_text2: '#94A3B8',
  d_text3: '#64748B',
} as const;

export type ColorKey = keyof typeof Colors;

export const Gradients = {
  primary: ['#818CF8', '#A78BFA', '#F472B6'] as [string, string, string],
  soft: ['#EEF2FF', '#F5F3FF', '#FCE7F3'] as [string, string, string],
  deep: ['#6366F1', '#8B5CF6', '#EC4899'] as [string, string, string],
  amber: ['#F59E0B', '#FBBF24'] as [string, string],
  success: ['#10B981', '#34D399'] as [string, string],
  darkCard: ['#161B2E', '#1F2540'] as [string, string],
} as const;

export const Shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#6366F1',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#6366F1',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
    },
    android: { elevation: 6 },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#6366F1',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.24,
      shadowRadius: 24,
    },
    android: { elevation: 10 },
    default: {},
  }),
  card: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
    },
    android: { elevation: 2 },
    default: {},
  }),
} as const;

export const Radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,
} as const;

export const Spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
} as const;

export function themedColor(dark: boolean, lightColor: string, darkColor: string): string {
  return dark ? darkColor : lightColor;
}

export function cardBg(dark: boolean): string {
  return dark ? Colors.d_card : Colors.bg;
}

export function textColor(dark: boolean): string {
  return dark ? Colors.d_text : Colors.text;
}

export function text2Color(dark: boolean): string {
  return dark ? Colors.d_text2 : Colors.text2;
}

export function borderColor(dark: boolean): string {
  return dark ? Colors.d_border : Colors.border;
}
