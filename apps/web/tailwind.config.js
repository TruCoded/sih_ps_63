/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        polar: {
          950: '#040711',
          900: '#070c18',
          850: '#0b1324',
          800: '#101c33',
          700: '#192b4d',
          600: '#263f6d',
          500: '#385b99',
          400: '#5c84cc',
          300: '#88a8e0',
          200: '#b8cff2',
          100: '#e1ecfc',
          50: '#f0f6ff',
        },
        cyan: {
          glow: '#00f2fe',
        },
        emerald: {
          aurora: '#38ef7d',
        },
        ice: {
          light: '#e0f2fe',
          frost: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.12)',
          glacial: '#d8e7ed',
        },
        signal: {
          DEFAULT: '#e34b26',
          orange: '#e34b26',
          hover: '#c93c1a',
        },
        deep: {
          DEFAULT: '#0e1520',
          dark: '#080d14',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'Outfit', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'aurora': 'aurora 15s ease infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        DEFAULT: '10px',
        'md': '10px',
        'lg': '14px',
        'xl': '18px',
        '2xl': '24px',
        '3xl': '32px',
        'full': '9999px',
      },
      boxShadow: {
        '2xs': '0 1px 2px rgba(0, 0, 0, 0.03)',
        'xs': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'subtle': '0 2px 6px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
