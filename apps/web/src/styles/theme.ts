import { MantineThemeOverride, createTheme } from '@mantine/core'

export const theme: MantineThemeOverride = createTheme({
  primaryColor: 'dark',
  primaryShade: { light: 8, dark: 1 }
})
