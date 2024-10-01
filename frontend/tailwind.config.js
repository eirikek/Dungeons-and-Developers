/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'terrain': 'url(\'/src/assets/terrain.jpeg\')',
      },
      keyframes: {
        underlineExpand: {
          '0%': { width: '0', left: '50%' },
          '50%': { width: '100%', left: '0%' },
        },
      },
      animation: {
        'underline-expand': 'underlineExpand 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};