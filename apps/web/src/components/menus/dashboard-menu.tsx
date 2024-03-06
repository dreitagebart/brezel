import classes from '~/styles/menus.module.css'
import { Tabs, TabsList, TabsTab } from '@mantine/core'
import { usePathname, useRouter } from 'next/navigation'
import { FC } from 'react'

interface Props {}

export const DashboardMenu: FC<Props> = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Tabs
      w='100%'
      classNames={{
        root: classes.root,
        tab: classes.tab,
        list: classes.list
      }}
      value={`/${pathname.split('/')[1]}`}
      onChange={(value) => router.push(String(value))}
    >
      <TabsList>
        <TabsTab value='/dashboard'>Overview</TabsTab>
        <TabsTab value='/account'>Settings</TabsTab>
      </TabsList>
    </Tabs>
  )
}
