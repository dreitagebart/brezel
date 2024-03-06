import classes from '~/styles/menus.module.css'
import { Tabs, TabsList, TabsTab } from '@mantine/core'
import { usePathname, useRouter } from 'next/navigation'
import { FC } from 'react'

interface Props {}

export const RepositoryMenu: FC<Props> = () => {
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
      value={`/${pathname.split('/')[0]}`}
      onChange={(value) => router.push(String(value))}
    >
      <TabsList>
        <TabsTab value='/'>Project</TabsTab>
        <TabsTab value='/deployments'>Deployments</TabsTab>
        <TabsTab value='/analytics'>Analytics</TabsTab>
        <TabsTab value='/settings'>Settings</TabsTab>
      </TabsList>
    </Tabs>
  )
}
