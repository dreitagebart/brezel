import { Stack } from '@mantine/core'
import { NextPage } from 'next'
import {
  AvatarSection,
  DisplaynameSection,
  EmailSection
} from '~/components/sections/account/general'

const Page: NextPage = () => {
  return (
    <Stack>
      <AvatarSection></AvatarSection>
      <DisplaynameSection></DisplaynameSection>
      <EmailSection></EmailSection>
    </Stack>
  )
}

export default Page
