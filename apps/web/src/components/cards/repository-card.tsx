import Link from 'next/link'
import { Card, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core'
import { IconBrandGithubFilled, IconLink } from '@tabler/icons-react'
import { FC } from 'react'

interface Props {
  data: {
    title: string
    url: string
  }
}

export const RepositoryCard: FC<Props> = ({ data }) => {
  return (
    <Card>
      <Group>
        <ThemeIcon radius='xl' size='md' variant='light'>
          <IconBrandGithubFilled size={18}></IconBrandGithubFilled>
        </ThemeIcon>
        <Group>
          <Text fw='bold'>{data.title}</Text>
        </Group>
        <UnstyledButton component={Link} href={data.url}>
          <Group>
            <IconLink size={20}></IconLink>
            <Text size='sm'>{data.url}</Text>
          </Group>
        </UnstyledButton>
      </Group>
    </Card>
  )
}
