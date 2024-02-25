import { AppShell, AppShellMain } from '@mantine/core'
import { FC, PropsWithChildren } from 'react'
import { ShellHeader } from '~/components/layouts/shell-header'

import classes from '~/styles/shell-layout.module.css'

export const ShellLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AppShell
      classNames={{
        header: classes.header,
        main: classes.main
      }}
      header={{ height: 100, offset: true }}
    >
      <ShellHeader></ShellHeader>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  )
}
