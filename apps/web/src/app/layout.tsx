import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '~/styles/globals.css'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'
import { ColorSchemeScript } from '@mantine/core'
import { Providers } from '~/components/providers'

export const metadata: Metadata = {
  title: 'brezel',
  description: 'the web deployment platform'
}

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <html lang='en'>
      <head>
        <ColorSchemeScript defaultColorScheme='auto'></ColorSchemeScript>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default Layout
