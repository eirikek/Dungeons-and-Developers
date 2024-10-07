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
        barbarian: "url('/src/assets/c3barbarianintro.png')",
        bard: "url('/src/assets/c3bardintro.png')",
        cleric: "url('/src/assets/c3clericintro.png')",
        druid: "url('/src/assets/c3druidintro.png')",
        fighter: "url('/src/assets/c3fighterintro.png')",
        monk: "url('/src/assets/c3monkintro.png')",
        paladin: "url('/src/assets/c3paladinintro.png')",
        ranger: "url('/src/assets/c3rangerintro.png')",
        rogue: "url('/src/assets/c3rogueintro.png')",
        sorcerer: "url('/src/assets/c3sorcererintro.png')",
        warlock: "url('/src/assets/c3warlockintro.png')",
        wizard: "url('/src/assets/c3wizardintro.png')",

        dwarf: "url('/src/assets/dwarf.png')",
        elf: "url('/src/assets/elf.png')",
        half_elf: "url('/src/assets/half-elf.png')",
        half_orc: "url('/src/assets/half-orc.png')",
        halfling: "url('/src/assets/halfling.png')",
        human: "url('/src/assets/human.png')",
        tiefling: "url('/src/assets/tiefling.png')",
        dragonborn: "url('/src/assets/dragonborn.png')",


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
