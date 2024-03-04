import { Group, Stack, Text, UnstyledButton } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { NextPage } from 'next'
import { PageTitle } from '~/components/titles'

const Page: NextPage = () => {
  return (
    <PageTitle>
      <Stack align='flex-start'>
        <UnstyledButton>
          <Group gap='xs'>
            <IconArrowLeft></IconArrowLeft>
            <Text>back</Text>
          </Group>
        </UnstyledButton>
        New Repo
      </Stack>
    </PageTitle>
  )
}

export default Page
