import { MantineThemeOverride } from '@mantine/styles/lib/theme/types';
import color from 'color';

const iced = color('#afd6f3')
const ash = color('#E7ECEF')
const wash = color('#274C77')
const fontFamily = 'Inconsolata, monospace'
/**
 * Mantine Theme
 * @see {@link https://mantine.dev/theming/mantine-provider/}
 */
const theme: MantineThemeOverride = {
  fontFamily,
  fontFamilyMonospace: fontFamily,
  headings: { fontFamily: fontFamily },
  colorScheme: 'dark',
  defaultRadius: 'xs',
  white: ash.hex(),
  black: '#101010',
  fontSizes: {
    xs: 0.75,
    sm: 0.875,
    lg: 1.125,
    xl: 1.25,
  },
  colors: {
    iced: [iced.hex(), iced.lighten(0.05).hex()],
    wash: [wash.hex(), wash.darken(0.5).hex(), wash.darken(0.75).hex()],
  },
  primaryColor: 'iced',
}

export const globalStyles = theme => ({
  body: {
    background: theme.fn.linearGradient(
      24,
      theme.colors.wash[1],
      theme.colors.wash[2]
    ),
    height: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
  },
})

/* Terminator font: https://www.fontspace.com/terminator-cyr-font-f756 */

export const fonts = [
  {
    '@font-face': {
      fontFamily: 'Terminator',
      src: `url('/fonts/terminator-webfont.woff2') format('woff2'), url('/fonts/terminator-webfont.woff') format('woff')`,
      fontWeight: 'normal',
      fontStyle: 'normal',
    },
  },
]

export default theme
