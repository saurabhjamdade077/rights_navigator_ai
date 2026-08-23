/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        legal: {
          50: '#f4f7fb',
          100: '#e7eef7',
          200: '#cbdced',
          300: '#9ec0df',
          400: '#699fce',
          500: '#4381bc',
          600: '#3266a0',
          700: '#295282',
          800: '#26466c',
          900: '#1b2c44',
          950: '#0b1320',
        },
        justice: {
          500: '#0284c7',
          600: '#0369a1',
          gold: '#f59e0b',
          'gold-light': '#fbbf24',
          'gold-dark': '#b45309',
          emerald: '#10b981',
          crimson: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
