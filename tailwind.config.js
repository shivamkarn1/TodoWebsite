
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        rainfall: 'rainfall 15s linear infinite',
        snowfall: 'snowfall 20s linear infinite',
        leaffall: 'leaffall 12s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 2s infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        rainfall: {
          '0%': { transform: 'translateY(-50px)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(calc(100vh + 50px))', opacity: '0' },
        },
        snowfall: {
          '0%': { transform: 'translateY(-50px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.8' },
          '90%': { opacity: '0.8' },
          '100%': { transform: 'translateY(calc(100vh + 50px)) rotate(360deg)', opacity: '0' },
        },
        leaffall: {
          '0%': { transform: 'translateY(-50px) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'translateY(calc(50vh)) rotate(180deg) translateX(30px)' },
          '100%': { transform: 'translateY(calc(100vh + 50px)) rotate(360deg) translateX(-30px)', opacity: '0' },
        },
        'pulse-subtle': {
          '0%': { boxShadow: '0 0 0 0 rgba(229, 62, 62, 0.2)' },
          '70%': { boxShadow: '0 0 0 10px rgba(229, 62, 62, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(229, 62, 62, 0)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}