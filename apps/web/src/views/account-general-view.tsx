'use client'

import { Stack } from '@mantine/core'
import { FC } from 'react'
import {
  AvatarSection,
  DisplaynameSection,
  EmailSection
} from '~/components/sections/account/general'
import { useAuth } from '~/hooks'

interface Props {}

export const AccountGeneralView: FC<Props> = () => {
  const { user } = useAuth()

  return (
    <Stack>
      <AvatarSection user={user}></AvatarSection>
      <DisplaynameSection user={user}></DisplaynameSection>
      <EmailSection user={user}></EmailSection>
    </Stack>
  )
}
