'use client'

import { Avatar, Card, CardSection, Group, Text, Title } from '@mantine/core'
import { useSession } from 'next-auth/react'
import { FC } from 'react'

interface Props {}

export const AvatarSection: FC<Props> = () => {
  const { data: session } = useSession()

  return (
    <Card bg='dark.8' withBorder padding='xl' shadow='xl'>
      <Title order={3}>Avatar</Title>
      <Group justify='space-between'>
        <div>
          <Text>This is your avatar</Text>
          <Text>
            Click on the avatar to upload a custom one from your files.
          </Text>
        </div>
        <Avatar src={session?.user?.image} size='xl'></Avatar>
      </Group>
      <CardSection
        style={{
          marginTop: 'var(--mantine-spacing-xl)',
          borderTop: '1px solid var(--mantine-color-dark-4)',
          padding: 'var(--mantine-spacing-xl)'
        }}
      >
        <Text c='dimmed'>An avatar is optional but strongly recommended</Text>
      </CardSection>
    </Card>
  )
}
