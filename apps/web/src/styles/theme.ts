import { MantineThemeOverride, createTheme, rem } from '@mantine/core'
import { nunito } from '~/utils/fonts'

export const theme: MantineThemeOverride = createTheme({
  primaryColor: 'dark',
  primaryShade: { light: 8, dark: 4 },
  fontFamily: nunito.style.fontFamily,
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(18),
    xl: rem(20)
  }
})
