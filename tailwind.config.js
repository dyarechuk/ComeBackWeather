/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        Rubik: ['Rubik', 'sans-serif'],
      },
      animation: {
        'gradient-animation': 'gradientAnimation 3s linear infinite',
      },
      keyframes: {
        gradientAnimation: {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
