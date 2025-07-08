/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
          light: '#818cf8',
        },
        secondary: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#34d399',
        },
        background: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
          dark: '#020617',
        },
        card: {
          DEFAULT: '#1e293b',
          light: '#334155',
          dark: '#0f172a',
        },
        text: {
          DEFAULT: '#f8fafc',
          muted: '#94a3b8',
          dark: '#64748b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}