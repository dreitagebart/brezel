import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import { Card, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core'
import { IconBrandGithubFilled, IconExternalLink } from '@tabler/icons-react'
import { FC } from 'react'
import { getRepositories } from '~/app/actions'

interface Props {
  data: Awaited<ReturnType<typeof getRepositories>>[number]
}

dayjs.extend(relativeTime)

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
        <UnstyledButton component={Link} href={data.url} target='_blank'>
          <Group gap='xs'>
            <Text size='sm'>{data.url}</Text>
            <IconExternalLink size={18}></IconExternalLink>
          </Group>
        </UnstyledButton>
      </Group>
      <Group justify='right' mt='md'>
        <Text size='sm' title={dayjs(data.createdAt).format('D, MMM YYYY')}>
          {dayjs(data.createdAt).fromNow()}
        </Text>
      </Group>
    </Card>
  )
}
