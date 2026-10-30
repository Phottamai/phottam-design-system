// Storybook/dev config: mirrors phottam-desktop/tailwind.config.ts so components render as in the app.
// Consumers use tailwind/preset.cjs (v3) or tailwind/theme.css (v4) instead.
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './.storybook/**/*.{ts,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
        '4xl': '2560px'
      },
      colors: {
        'ph-purple': {
          100: '#F7EFFF',
          500: '#6E22FF',
          600: '#5B1BDD'
        },
        'ph-violet': {
          100: '#e8d5f7',
          500: '#973AE1',
          600: '#8834CB'
        },
        'ph-hover-violet': {
          100: '#7224FC'
        },
        'ph-dark': '#05060F',
        'ph-dark-lite': '#12131A',
        'ph-dark-text': '#A3A6AD',
        'ph-border-dark': '#20212A',
        transparent: 'transparent',
        current: 'currentColor',
        black: '#000000',
        white: '#ffffff',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827'
        },
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d'
        },
        yellow: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f'
        },
        green: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b'
        },
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81'
        },
        purple: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95'
        },
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843'
        },
        // Custom color schemes with dark mode support
        base: {
          DEFAULT: 'var(--color-base)',
          50: 'var(--color-base-50)',
          100: 'var(--color-base-100)',
          200: 'var(--color-base-200)',
          300: 'var(--color-base-300)',
          400: 'var(--color-base-400)',
          500: 'var(--color-base-500)',
          600: 'var(--color-base-600)',
          700: 'var(--color-base-700)',
          800: 'var(--color-base-800)',
          900: 'var(--color-base-900)',
          content: 'var(--color-base-content)'
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          focus: 'var(--color-primary-focus)',
          content: 'var(--color-primary-content)'
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          50: 'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
          800: 'var(--color-secondary-800)',
          900: 'var(--color-secondary-900)',
          focus: 'var(--color-secondary-focus)',
          content: 'var(--color-secondary-content)'
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          50: 'var(--color-accent-50)',
          100: 'var(--color-accent-100)',
          200: 'var(--color-accent-200)',
          300: 'var(--color-accent-300)',
          400: 'var(--color-accent-400)',
          500: 'var(--color-accent-500)',
          600: 'var(--color-accent-600)',
          700: 'var(--color-accent-700)',
          800: 'var(--color-accent-800)',
          900: 'var(--color-accent-900)',
          focus: 'var(--color-accent-focus)',
          content: 'var(--color-accent-content)'
        },
        neutral: {
          DEFAULT: 'var(--color-neutral)',
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
          focus: 'var(--color-neutral-focus)',
          content: 'var(--color-neutral-content)'
        },
        info: {
          DEFAULT: 'var(--color-info)',
          50: 'var(--color-info-50)',
          100: 'var(--color-info-100)',
          200: 'var(--color-info-200)',
          300: 'var(--color-info-300)',
          400: 'var(--color-info-400)',
          500: 'var(--color-info-500)',
          600: 'var(--color-info-600)',
          700: 'var(--color-info-700)',
          800: 'var(--color-info-800)',
          900: 'var(--color-info-900)',
          focus: 'var(--color-info-focus)',
          content: 'var(--color-info-content)'
        },
        success: {
          DEFAULT: 'var(--color-success)',
          50: 'var(--color-success-50)',
          100: 'var(--color-success-100)',
          200: 'var(--color-success-200)',
          300: 'var(--color-success-300)',
          400: 'var(--color-success-400)',
          500: 'var(--color-success-500)',
          600: 'var(--color-success-600)',
          700: 'var(--color-success-700)',
          800: 'var(--color-success-800)',
          900: 'var(--color-success-900)',
          focus: 'var(--color-success-focus)',
          content: 'var(--color-success-content)'
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          50: 'var(--color-warning-50)',
          100: 'var(--color-warning-100)',
          200: 'var(--color-warning-200)',
          300: 'var(--color-warning-300)',
          400: 'var(--color-warning-400)',
          500: 'var(--color-warning-500)',
          600: 'var(--color-warning-600)',
          700: 'var(--color-warning-700)',
          800: 'var(--color-warning-800)',
          900: 'var(--color-warning-900)',
          focus: 'var(--color-warning-focus)',
          content: 'var(--color-warning-content)'
        },
        error: {
          DEFAULT: 'var(--color-error)',
          50: 'var(--color-error-50)',
          100: 'var(--color-error-100)',
          200: 'var(--color-error-200)',
          300: 'var(--color-error-300)',
          400: 'var(--color-error-400)',
          500: 'var(--color-error-500)',
          600: 'var(--color-error-600)',
          700: 'var(--color-error-700)',
          800: 'var(--color-error-800)',
          900: 'var(--color-error-900)',
          focus: 'var(--color-error-focus)',
          content: 'var(--color-error-content)'
        },
        // Aliases
        danger: {
          DEFAULT: 'var(--color-error)',
          50: 'var(--color-error-50)',
          100: 'var(--color-error-100)',
          200: 'var(--color-error-200)',
          300: 'var(--color-error-300)',
          400: 'var(--color-error-400)',
          500: 'var(--color-error-500)',
          600: 'var(--color-error-600)',
          700: 'var(--color-error-700)',
          800: 'var(--color-error-800)',
          900: 'var(--color-error-900)',
          focus: 'var(--color-error-focus)',
          content: 'var(--color-error-content)'
        },
        failure: {
          DEFAULT: 'var(--color-error)',
          50: 'var(--color-error-50)',
          100: 'var(--color-error-100)',
          200: 'var(--color-error-200)',
          300: 'var(--color-error-300)',
          400: 'var(--color-error-400)',
          500: 'var(--color-error-500)',
          600: 'var(--color-error-600)',
          700: 'var(--color-error-700)',
          800: 'var(--color-error-800)',
          900: 'var(--color-error-900)',
          focus: 'var(--color-error-focus)',
          content: 'var(--color-error-content)'
        },
        // Theme-aware background colors
        background: {
          light: '#ffffff',
          dark: '#1b1b1f'
        },
        surface: {
          light: '#f8f8f8',
          dark: '#222222'
        },
        muted: {
          light: '#f2f2f2',
          dark: '#282828'
        },
        text: {
          primary: {
            light: '#1f2937',
            dark: 'rgba(255, 255, 245, 0.86)'
          },
          secondary: {
            light: '#6b7280',
            dark: 'rgba(235, 235, 245, 0.6)'
          },
          tertiary: {
            light: '#9ca3af',
            dark: 'rgba(235, 235, 245, 0.38)'
          }
        }
      },
      backgroundColor: {
        'theme-bg': 'var(--bg-color)',
        'theme-surface': 'var(--surface-color)',
        'theme-muted': 'var(--muted-color)'
      },
      textColor: {
        'theme-primary': 'var(--text-primary)',
        'theme-secondary': 'var(--text-secondary)',
        'theme-tertiary': 'var(--text-tertiary)'
      },
      borderColor: {
        'theme-border': 'var(--border-color)'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Satoshi', 'Inter', ...defaultTheme.fontFamily.sans],
        'plus-jakarta': ['"Plus Jakarta Sans"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        'inter-24': ['Inter-24', 'sans-serif'],
        'inter-28': ['Inter-28', 'sans-serif']
      },
      keyframes: {
        // Shared with phottam-web for @phottamai/ui-components (Album Summary)
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        loaderPop: {
          '0%': { opacity: '0', transform: 'scale(0.4) rotate(-12deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' }
        },
        loaderRise: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        loaderFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        moodBob: {
          '0%, 50%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-3px) rotate(-8deg)' },
          '75%': { transform: 'translateY(-3px) rotate(8deg)' }
        },
        indeterminate: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'pulse-glow': {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(127, 60, 255, 0.6)'
          },
          '50%': {
            transform: 'scale(1.04)',
            boxShadow: '0 0 0 8px rgba(127, 60, 255, 0)'
          }
        }
      },
      animation: {
        'indeterminate-bar': 'indeterminate 1.5s infinite cubic-bezier(0.65, 0.05, 0.36, 1)',
        'pulse-glow': 'pulse-glow 2s infinite ease-in-out',
        'loader-pop': 'loaderPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'loader-rise': 'loaderRise 0.45s ease-out both',
        'loader-float': 'loaderFloat 2.4s ease-in-out infinite',
        'mood-bob': 'moodBob 1.6s ease-in-out infinite'
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['active', 'group-hover'],
      textColor: ['active', 'group-hover']
    }
  },
  plugins: []
}

export default config
