/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette based on your specifications
        primary: {
          DEFAULT: '#486371',
          light: '#5a7482',
          dark: '#3a4f5a',
          lighter: '#6b8591',
          darker: '#2e3f47',
        },
        text: {
          primary: '#121212',
          secondary: '#4a4a4a',
          muted: '#6b6b6b',
          light: '#ffffff',
        },
        background: {
          DEFAULT: '#ffffff',
          secondary: '#f8f9fa',
          tertiary: '#f1f3f4',
        },
        border: {
          DEFAULT: '#e1e5e9',
          light: '#f0f2f4',
          dark: '#c8d0d6',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
