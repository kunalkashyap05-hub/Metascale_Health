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
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c', // Darker Amber / Saffron
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        saffron: {
          DEFAULT: '#f7931e',
          deep: '#e06823',
          light: '#ffd3a1',
        },
        ink: {
          DEFAULT: '#141414',
          mid: '#4a4a5a',
          light: '#8c90a2',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        '3xl': '28px',
        '2xl': '18px',
        'xl': '12px',
      }
    },
  },
  plugins: [],
}
