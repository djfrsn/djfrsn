const defaultTheme = require('tailwindcss/defaultTheme')
const color = require('color')
const generateColors = require('./lib/utils/generateColors')

const colors = generateColors({
  ash: '#E7ECEF',
  ultramarineBlue: '#2667FF',
  darkElectricBlue: '#3E6680',
  raisinBlack: '#332E3C',
  brightNavyBlue: '#027BCE',
  aliceBlue: '#EBF2FA',
  neutral: '#191D24',
  wash: '#274C77',
  crayolaRed: '#F9564F',
  maxYellow: '#F3C677',
  iron: '#8B8C89',
  iced: '#afd6f3',
  icedNeon: '#00e7ff',
  budGreen: '#5FAD56',
  maizeCrayola: '#F2C14E',
  coral: '#F78154',
  spanishBlue: '#016FB9',
  flame: '#EC4E20',
  blackCoffee: '#362C28',
})

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
    fontSize: {
      xxs: '0.65rem',
      xs: '0.75rem',
      sm: '0.875rem',
      tiny: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    fontFamily: {
      sans: ['Inconsolata', 'monospace'],
      serif: ['Lora', 'serif'],
    },
    colors,
    extend: {
      flex: {
        max: 'max-content',
      },
      animation: {
        fadeOut: 'fadeOut 1s ease-in-out',
        fadeIn: 'fadeIn 1s ease-in-out',
      },

      // that is actual animation
      keyframes: theme => ({
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      }),
    },
  },
  daisyui: {
    themes: [
      {
        explorer: {
          primary: colors.iced['400'],
          secondary: colors.icedNeon['500'],
          accent: colors.maxYellow['500'],
          neutral: colors.neutral['500'],
          'base-content': colors.iced['400'],
          'base-100': colors.ultramarineBlue['700'],
          'base-200': colors.wash['800'],
          'base-300': colors.wash['900'],
          link: colors.iced['500'],
          linkHover: colors.iced['900'],
          linkActive: colors.icedNeon['900'],
          info: colors.iced['200'],
          success: colors.budGreen['500'],
          warning: colors.maizeCrayola['500'],
          error: colors.coral['500'],
        },
        homeroom: {
          primary: colors.raisinBlack['500'],
          secondary: colors.ultramarineBlue['500'],
          accent: colors.flame['500'],
          neutral: colors.neutral['500'],
          'base-content': colors.blackCoffee['500'],
          'base-100': colors.ash['500'],
          'base-200': colors.ash['600'],
          'base-300': colors.ash['700'],
          info: colors.iced['200'],
          success: colors.budGreen['500'],
          warning: colors.maizeCrayola['500'],
          error: colors.coral['500'],
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}
