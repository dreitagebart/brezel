import Image from 'next/image'
import Link from 'next/link'
import {
  AppShellHeader,
  Button,
  Container,
  Flex,
  Group,
  Stack,
  Text,
  Title,
  UnstyledButton
} from '@mantine/core'
import {
  IconBrandBitbucket,
  IconBrandGithubFilled,
  IconBrandGitlab
} from '@tabler/icons-react'
import { NextPage } from 'next'

const Page: NextPage = async () => {
  return (
    <>
      <AppShellHeader>
        <Container size='xl' h='100%'>
          <Flex direction='row' justify='space-between' align='center' h='100%'>
            <UnstyledButton component={Link} href='/'>
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
            <Group>
              <Button component={Link} href='/login'>
                Login
              </Button>
            </Group>
          </Flex>
        </Container>
      </AppShellHeader>
      <Flex direction='column'>
        <div>
          <Title>Login to brezel</Title>
          <Stack mt='md'>
            <Button
              leftSection={<IconBrandGithubFilled></IconBrandGithubFilled>}
            >
              Continue with Github
            </Button>
            <Button leftSection={<IconBrandGitlab></IconBrandGitlab>}>
              Continue with Gitlab
            </Button>
            <Button leftSection={<IconBrandBitbucket></IconBrandBitbucket>}>
              Continue with Bitbucket
            </Button>
          </Stack>
        </div>
      </Flex>
    </>
  )
}

export default Page
