'use client'

import { Stack } from '@mantine/core'
import { NextPage } from 'next'
import {
  AvatarSection,
  DisplaynameSection,
  EmailSection
} from '~/components/sections/account/general'
import { useAuth } from '~/hooks'

const Page: NextPage = () => {
  const { user } = useAuth()

  return (
    <Stack>
      <AvatarSection user={user}></AvatarSection>
      <DisplaynameSection user={user}></DisplaynameSection>
      <EmailSection user={user}></EmailSection>
    </Stack>
  )
}

export default Page
