'use client'

import classes from '~/styles/sections.module.css'
import { Avatar, Card, CardSection, Group, Text, Title } from '@mantine/core'
import { FC } from 'react'
import { AuthUser } from '~/utils/types'

interface Props {
  user: AuthUser
}

export const AvatarSection: FC<Props> = ({ user }) => {
  return (
    <Card className={classes.wrapper}>
      <Title order={3}>Avatar</Title>
      <Group justify='space-between'>
        <div>
          <Text>This is your avatar</Text>
          <Text>
            Click on the avatar to upload a custom one from your files.
          </Text>
        </div>
        <Avatar src={user.image} size='xl'></Avatar>
      </Group>
      <CardSection className={classes.separator}>
        <Text c='dimmed'>An avatar is optional but strongly recommended</Text>
      </CardSection>
    </Card>
  )
}
