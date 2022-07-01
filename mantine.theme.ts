import { MantineThemeOverride } from '@mantine/styles/lib/theme/types';
import color from 'color';

const iced = color('#afd6f3')
const ash = color('#E7ECEF')
const wash = color('#274C77')
/**
 * Mantine Theme
 * @see {@link https://mantine.dev/theming/mantine-provider/}
 */
const theme: MantineThemeOverride = {
  fontFamily: 'Inconsolata, monospace',
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
    ...theme.fn.fontStyles(),
    background: theme.fn.linearGradient(
      24,
      theme.colors.wash[1],
      theme.colors.wash[2]
    ),
  },
})

export default theme
