/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: { max: '479px' },
      sm: '480px',
      md: '640px',
      lg: '768px',
      xl: '1024px',
      '2xl': '1280px',
      '3xl': '1440px',
      '4xl': '1600px',
      '5xl': '1920px',
      '6xl': '2560px',
    },
    extend: {
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        base: ['1rem', { lineHeight: '1.5rem' }], // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
        '5xl': ['3rem', { lineHeight: '1' }], // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }], // 60px
        // Add more if needed
      },
      colors: {
        customRed: '#DB3232',
        customGray: '#1E1E1E',
        accessibilityBackground: '#000000',
        accessibilityText: '#ffffff',
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        login: "url('/src/assets/images/background/login_bg.jpeg')",
        dungeon: "url('/src/assets/images/background/dungeon_bg.png')",
        equipments: "url('/src/assets/images/background/equipment_bg.jpeg')",
        myCharacter: "url('/src/assets/images/background/my_character_bg.jpg')",
        monsters: "url('/src/assets/images/background/monsters_bg.png')",
        home: "url('/src/assets/images/background/home_bg.jpeg')",
        subPage: "url('/src/assets/images/background/sub_page_bg3.png')",
      },
      keyframes: {
        underlineExpand: {
          '0%': { width: '0', left: '50%' },
          '50%': { width: '100%', left: '0%' },
        },
        zoom: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.4)' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
      },
      animation: {
        'underline-expand': 'underlineExpand 0.3s ease-out forwards',
        'background-zoom': 'zoom 120s linear infinite',
        shake: 'shake 0.5s ease-in-out',
      },
      flexGrow: {
        2: 2,
        3: 3,
      },
    },
  },
  plugins: [],
};
