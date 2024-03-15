'use client'

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

import { login } from '~/app/actions'

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
              <Button component={Link} href='/signup'>
                Sign up
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
              onClick={() => login('github')}
            >
              Continue with Github
            </Button>
            <Button
              leftSection={<IconBrandGitlab></IconBrandGitlab>}
              onClick={() => login('gitlab')}
            >
              Continue with Gitlab
            </Button>
            <Button
              leftSection={<IconBrandBitbucket></IconBrandBitbucket>}
              onClick={() => login('bitbucket')}
            >
              Continue with Bitbucket
            </Button>
          </Stack>
        </div>
      </Flex>
    </>
  )
}

export default Page
