const defaultTheme = require('tailwindcss/defaultTheme')
const color = require('color')

const iced = color('#afd6f3')
const wash = color('#274C77')
const wash200 = wash.darken(0.5)
const wash300 = wash.darken(0.75)

const colors = {
  ash: {
    100: '#E7ECEF',
  },
  wash: {
    100: wash.hex(),
    200: wash200.hex(),
    300: wash300.hex(),
  },
  crayolaRed: {
    100: '#F9564F',
  },
  maxYellow: {
    100: '#F3C677',
  },
  iced: {
    100: iced.hex(),
    200: iced.lighten(0.05).string(),
    neon: '#00e7ff',
    fade: iced.fade(0.8).string(),
  },
  iron: {
    100: '#8B8C89',
  },
}

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
        mytheme: {
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
      },
    ],
  },
  plugins: [require('daisyui')],
}
