/** 
 * ENHANCED TAILWIND CONFIG
 * For FinSight - Professional Color System
 * 
 * This ensures CONSISTENCY across your entire site
 * Primary: Emerald (wealth, growth)
 * Accent: Cyan (innovation, precision)
 * Neutrals: Slate (professional, clean)
 */

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ✅ CONSISTENT COLOR SYSTEM
      colors: {
        // Primary: Emerald (for wealth/growth/success)
        emerald: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Base emerald - use this most
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#134e4a',
          950: '#051f1a',
        },
        
        // Accent: Cyan (for innovation/precision)
        cyan: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          300: '#06b6d4',
          500: '#06b6d4', // Base cyan - use sparingly
          600: '#0891b2',
        },

        // Neutrals: Slate (backbone of design)
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617', // Dark background
        },
      },

      // ✅ CONSISTENT TYPOGRAPHY SCALE
      fontSize: {
        // H1: Large hero sections
        'h1': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        // H2: Section headers
        'h2': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        // H3: Card titles
        'h3': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        // Body: Regular text
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        // Small: Captions, labels
        'small': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
      },

      // ✅ CONSISTENT SPACING SCALE
      spacing: {
        // Use 8px base unit
        // 4 = 4px, 6 = 6px, 8 = 8px... 40 = 40px (5rem)
        // Already in Tailwind by default, just being explicit
      },

      // ✅ SHADOW SYSTEM
      boxShadow: {
        // Subtle elevation
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        // Premium shadows for cards
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        // Glow effects
        'glow-emerald': '0 0 30px -10px rgba(16, 185, 129, 0.3)',
        'glow-emerald-lg': '0 0 60px -10px rgba(16, 185, 129, 0.4)',
      },

      // ✅ BORDER RADIUS SYSTEM
      borderRadius: {
        'none': '0',
        'sm': '0.375rem',   // 6px - Small elements
        'base': '0.5rem',   // 8px - Default
        'md': '0.75rem',    // 12px - Cards
        'lg': '1rem',       // 16px - Large cards
        'xl': '1.5rem',     // 24px - Premium cards
        '2xl': '2rem',      // 32px - Extra large
        '3xl': '2.5rem',    // 40px - Hero elements
        'full': '9999px',   // Pills/circles
      },

      // ✅ ANIMATION SYSTEM (for Framer Motion compatibility)
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },

      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'bounce-subtle': 'bounce-subtle 2s infinite',
      },
    },
  },
  plugins: [],
}

export default config

/**
 * COLOR USAGE GUIDE:
 * 
 * EMERALD (Primary) - Use for:
 * - Success states ✓
 * - Wealth growth indicators
 * - Primary CTAs
 * - Highlight positive metrics
 * 
 * CYAN (Accent) - Use for:
 * - Innovation signals
 * - Hover states
 * - Secondary accents
 * - Use sparingly
 * 
 * SLATE (Neutral) - Use for:
 * - Backgrounds
 * - Text
 * - Borders
 * - Structure
 * 
 * CONSISTENCY EXAMPLES:
 * ✓ Primary button: bg-emerald-500 hover:bg-emerald-600
 * ✓ Success text: text-emerald-400
 * ✓ Card bg: bg-slate-900
 * ✓ Border: border-slate-800
 * ✓ Hover effect: hover:border-emerald-500/50
 */
