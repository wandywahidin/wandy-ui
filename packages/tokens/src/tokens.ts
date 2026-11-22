export const colorKeys = [
  'background',
  'surface',
  'foreground',
  'muted',
  'muted-foreground',
  'border',
  'ring',
  'primary',
  'primary-foreground',
  'danger',
  'danger-foreground',
  'success',
  'success-foreground',
  'warning',
  'warning-foreground',
] as const

export type ColorKey = (typeof colorKeys)[number]

/** Semantic color tokens. Every value is a 6-digit hex string. */
export type ColorTokens = Record<ColorKey, string>

export interface Tokens {
  light: ColorTokens
  dark: ColorTokens
  radius: { sm: string; md: string; lg: string }
  font: { sans: string }
  shadow: { sm: string; md: string; lg: string }
}

/**
 * Neutral zinc grays plus one indigo brand hue.
 * Text/background pairs are checked for WCAG AA (4.5:1) in contrast.test.ts.
 */
export const tokens: Tokens = {
  light: {
    background: '#ffffff',
    surface: '#fafafa',
    foreground: '#18181b',
    muted: '#f4f4f5',
    'muted-foreground': '#52525b',
    // ≥3:1 on background/surface (WCAG 1.4.11): it draws control boundaries.
    border: '#85858e',
    ring: '#4f46e5',
    primary: '#4f46e5',
    'primary-foreground': '#ffffff',
    danger: '#dc2626',
    'danger-foreground': '#ffffff',
    success: '#15803d',
    'success-foreground': '#ffffff',
    warning: '#b45309',
    'warning-foreground': '#ffffff',
  },
  dark: {
    background: '#09090b',
    surface: '#18181b',
    foreground: '#fafafa',
    muted: '#27272a',
    'muted-foreground': '#a1a1aa',
    border: '#71717a',
    ring: '#818cf8',
    primary: '#818cf8',
    'primary-foreground': '#1e1b4b',
    danger: '#f87171',
    'danger-foreground': '#450a0a',
    success: '#4ade80',
    'success-foreground': '#052e16',
    warning: '#fbbf24',
    'warning-foreground': '#451a03',
  },
  radius: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem' },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  font: {
    sans: "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
  },
}
