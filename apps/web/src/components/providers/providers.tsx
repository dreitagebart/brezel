'use client'

import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { QueryClientProvider } from '@tanstack/react-query'
import { FC, PropsWithChildren } from 'react'
import { theme } from '~/styles/theme'
import { getQueryClient } from '~/utils/query-client'

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme='auto'>
        <Notifications autoClose={10000}></Notifications>
        {children}
      </MantineProvider>
    </QueryClientProvider>
  )
}
