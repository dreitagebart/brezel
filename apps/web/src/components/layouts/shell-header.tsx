'use client'

import classes from '~/styles/shell-header.module.css'
import Image from 'next/image'
import Link from 'next/link'
import {
  AppShellHeader,
  Avatar,
  Flex,
  Group,
  MantineColorScheme,
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  MenuTarget,
  Select,
  Text,
  UnstyledButton,
  useMantineColorScheme
} from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'
import {
  IconDeviceDesktop,
  IconLayoutDashboard,
  IconLogout2,
  IconMoonFilled,
  IconSettings,
  IconSun
} from '@tabler/icons-react'
import { FC, useState } from 'react'
import { logout } from '~/app/actions'
import { useAuth } from '~/hooks'
import { LayoutRoutes } from '~/utils/types'
import { DashboardMenu, RepositoryMenu } from '~/components/menus'

interface Props {
  route: LayoutRoutes
}

export const ShellHeader: FC<Props> = ({ route }) => {
  const { user } = useAuth()
  const [opened, setOpened] = useState(false)
  const { colorScheme, setColorScheme } = useMantineColorScheme({
    keepTransitions: true
  })
  const menuRef = useClickOutside(() => setOpened(false))

  return (
    <AppShellHeader>
      <Flex direction='column' h='100%'>
        <Flex
          direction='row'
          justify='space-between'
          align='center'
          h='100%'
          px='xl'
        >
          <UnstyledButton component={Link} href='/dashboard'>
            <Group gap='xs'>
              <Image
                src='/android-chrome-192x192.png'
                alt=''
                width={32}
                height={32}
              ></Image>
              <Text c='white'>brezel</Text>
            </Group>
          </UnstyledButton>
          <Flex>
            <Menu
              withinPortal
              opened={opened}
              closeOnItemClick={false}
              position='bottom-end'
            >
              <MenuTarget>
                <UnstyledButton onClick={() => setOpened(!opened)}>
                  <Avatar src={user.image}></Avatar>
                </UnstyledButton>
              </MenuTarget>
              <MenuDropdown ref={menuRef}>
                <MenuLabel className={classes.loggedIn}>
                  <Flex direction='column'>
                    <Text className={classes.username}>{user.name}</Text>
                    <Text className={classes.email}>{user.email}</Text>
                  </Flex>
                </MenuLabel>
                <MenuDivider></MenuDivider>
                <MenuItem
                  onClick={() => setOpened(false)}
                  component={Link}
                  href='/dashboard'
                  rightSection={<IconLayoutDashboard></IconLayoutDashboard>}
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  onClick={() => setOpened(false)}
                  component={Link}
                  href='/account'
                  rightSection={<IconSettings></IconSettings>}
                >
                  Settings
                </MenuItem>
                <MenuItem
                  rightSection={
                    <Group>
                      <Select
                        allowDeselect={false}
                        comboboxProps={{ withinPortal: false }}
                        leftSectionPointerEvents='none'
                        leftSection={
                          colorScheme === 'auto' ? (
                            <IconDeviceDesktop></IconDeviceDesktop>
                          ) : colorScheme === 'light' ? (
                            <IconSun></IconSun>
                          ) : colorScheme === 'dark' ? (
                            <IconMoonFilled></IconMoonFilled>
                          ) : null
                        }
                        checkIconPosition='right'
                        data={[
                          { value: 'auto', label: 'System' },
                          {
                            value: 'light',
                            label: 'Light'
                          },
                          { value: 'dark', label: 'Dark' }
                        ]}
                        value={colorScheme}
                        onChange={(value) =>
                          setColorScheme(value as MantineColorScheme)
                        }
                      ></Select>
                    </Group>
                  }
                >
                  Theme
                </MenuItem>
                <MenuDivider></MenuDivider>
                <MenuItem
                  onClick={() => logout()}
                  rightSection={<IconLogout2></IconLogout2>}
                >
                  Logout
                </MenuItem>
              </MenuDropdown>
            </Menu>
          </Flex>
        </Flex>
        <Flex w='100%'>
          {route === 'dashboard' ? (
            <DashboardMenu></DashboardMenu>
          ) : route === 'repository' ? (
            <RepositoryMenu></RepositoryMenu>
          ) : null}
        </Flex>
      </Flex>
    </AppShellHeader>
  )
}
