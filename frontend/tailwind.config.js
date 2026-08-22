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
          50: '#f4f6fb',
          100: '#e8edf6',
          200: '#cbd7ec',
          300: '#9eb7dd',
          400: '#6a92cb',
          500: '#4672b6',
          600: '#34589a',
          700: '#2b477e',
          800: '#263d68',
          900: '#1e2c49',
          950: '#0f172a',
        },
        justice: {
          500: '#0284c7',
          600: '#0369a1',
          gold: '#d97706',
          emerald: '#059669',
          crimson: '#e11d48'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif']
      }
    },
  },
  plugins: [],
}
