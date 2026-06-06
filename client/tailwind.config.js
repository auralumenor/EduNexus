/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f8fafc', // slate-50
          dark: '#0b0f19',
        },
        card: {
          light: '#ffffff',
          dark: '#131722',
        },
        primary: {
          DEFAULT: '#3b82f6', // blue-500
          hover: '#2563eb', // blue-600
          glow: 'rgba(59, 130, 246, 0.5)'
        },
        text: {
          primary: {
            light: '#0f172a', // slate-900
            dark: '#e2e8f0', // slate-200
          },
          secondary: {
            light: '#64748b', // slate-500
            dark: '#94a3b8', // slate-400
          }
        },
        border: {
          light: '#e2e8f0', // slate-200
          dark: 'rgba(255, 255, 255, 0.08)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
