/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      tablet: '776px',
      laptop: '1024px',
      desktop: '1300px',
    },
    extend: {
      colors: {
        customRed: '#DB3232',
        customGray: '#1E1E1E',
        owlblue: '#16455C',
        dessertyellow: '#503D1D',
        dragongreen: '#131706',
      },
      backgroundImage: {
        terrain: "url('/src/assets/terrain.jpeg')",
        storm_giant: "url('/src/assets/storm_giant.jpeg')",
        dessert: "url('/src/assets/dessert.jpeg')",
        owlbeast: "url('/src/assets/owlbeast.jpeg')",
        bluedrake: "url('/src/assets/bluedrake.jpeg')",
        gnome: "url('/src/assets/gnome.png')",
        charisma: "url('/src/assets/charisma.jpg')",
        equipment_bg: "url('/src/assets/equipment_bg.jpeg')",
        my_character_bg: "url('/src/assets/my_character_bg.jpg')",
        madmage: "url('/src/assets/madmage.jpeg')",
        home_bg: "url('/src/assets/home_bg.jpeg')",
      },
      keyframes: {
        underlineExpand: {
          '0%': { width: '0', left: '50%' },
          '50%': { width: '100%', left: '0%' },
        },
      },
      zoom: {
        '0%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.4)' },
        '100%': { transform: 'scale(1)' },
      },
      animation: {
        'underline-expand': 'underlineExpand 0.3s ease-out forwards',
        'background-zoom': 'zoom 120s linear infinite',
      },
    },
  },
  plugins: [],
};
