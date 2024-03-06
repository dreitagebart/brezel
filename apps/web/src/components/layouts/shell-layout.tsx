import classes from '~/styles/shell-layout.module.css'
import { AppShell, AppShellMain } from '@mantine/core'
import { FC, PropsWithChildren } from 'react'
import { ShellHeader } from '~/components/layouts/shell-header'
import { LayoutRoutes } from '~/utils/types'

interface Props {
  route: LayoutRoutes
}

export const ShellLayout: FC<PropsWithChildren<Props>> = ({
  children,
  route
}) => {
  return (
    <AppShell
      classNames={{
        root: classes.root,
        header: classes.header,
        main: classes.main
      }}
      header={{ height: 100, offset: true }}
    >
      <ShellHeader route={route}></ShellHeader>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  )
}
