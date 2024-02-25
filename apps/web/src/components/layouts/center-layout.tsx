import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  Button,
  Container,
  Flex,
  Group,
  Text,
  UnstyledButton
} from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'
import { FC, PropsWithChildren } from 'react'

export const CenterLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AppShell header={{ height: 80, offset: false }}>
      <AppShellMain>
        <Flex
          miw='100vw'
          mih='100vh'
          direction='column'
          align='center'
          justify='center'
        >
          {children}
        </Flex>
      </AppShellMain>
    </AppShell>
  )
}
