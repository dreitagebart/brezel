'use client'

import Link from 'next/link'
import { NavLink } from '@mantine/core'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

interface Props {}

const links = [
  {
    label: 'General',
    href: ''
  },
  {
    label: 'Authentication',
    href: '/authentication'
  },
  {
    label: 'Teams',
    href: '/teams'
  },
  {
    label: 'Tokens',
    href: '/tokens'
  },
  {
    label: 'Deployment protection',
    href: '/deployment-protection'
  },
  {
    label: 'Notifications',
    href: '/notifications'
  }
]

export const AccountNavLinks: FC<Props> = () => {
  const pathname = usePathname()

  return (
    <nav>
      {links.map(({ label, href }) => {
        return (
          <NavLink
            styles={{
              root: {
                marginBottom: 4,
                transition: 'all 300ms ease-in',
                borderRadius: 8
              }
            }}
            key={href}
            active={pathname === `/account${href}`}
            component={Link}
            label={label}
            href={`/account${href}`}
          ></NavLink>
        )
      })}
    </nav>
  )
}
