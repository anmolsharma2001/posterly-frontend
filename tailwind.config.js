/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e293b',
          hover: '#0f172a'
        },
        background: '#fcfcfc',
        surface: '#ffffff',
        border: '#e2e8f0',
        muted: '#64748b',
        heading: '#0f172a',
      }
    },
  },
  plugins: [],
}
