const defaultTheme = require('tailwindcss/defaultTheme')
const color = require('color')
const generateColors = require('./lib/utils/generateColors')

const colors = generateColors({
  ash: '#E7ECEF',
  darkElectricBlue: '#3E6680',
  brightNavyBlue: '#027BCE',
  aliceBlue: '#EBF2FA',
  neutral: '#191D24',
  wash: '#274C77',
  crayolaRed: '#F9564F',
  maxYellow: '#F3C677',
  iron: '#8B8C89',
  iced: '#afd6f3',
  icedNeon: '#00e7ff',
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
      body: ['Inconsolata', 'monospace'],
      logo: ['Terminator', 'Open Sans'],
    },
    colors,
    extend: {
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
        tron: {
          primary: '#6419E6',
          secondary: '#D926A9',
          accent: '#1FB2A6',
          neutral: '#191D24',
          'base-100': '#2A303C',
          info: colors.iced['200'],
          success: '#36D399',
          warning: '#FBBD23',
          error: '#F87272',
        },
        homeroom: {
          primary: colors.brightNavyBlue['300'],
          secondary: colors.darkElectricBlue['500'],
          accent: colors.brightNavyBlue['500'],
          neutral: colors.neutral['500'],
          'base-100': colors.ash['500'],
          'base-200': colors.ash['600'],
          'base-300': colors.ash['700'],
          info: colors.iced['200'],
          success: '#36D399',
          warning: '#FBBD23',
          error: '#F87272',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}
