import dayjs from 'dayjs'
import classes from '~/styles/repository-import-card.module.css'
import { Button, Group, Paper, Text, UnstyledButton } from '@mantine/core'
import { IconBrandGit } from '@tabler/icons-react'
import { FC } from 'react'
import { GitRepository } from '~/utils/types'
import Link from 'next/link'

interface Props {
  data: GitRepository
  onClick: () => void
}

export const RepositoryImportCard: FC<Props> = ({
  data: { name, owner, updatedAt, url },
  onClick
}) => {
  return (
    <Paper className={classes.wrapper}>
      <Group justify='space-between'>
        <UnstyledButton component={Link} target='_blank' href={url}>
          <Group>
            <IconBrandGit></IconBrandGit>
            <Text>
              {owner}/{name}
            </Text>
          </Group>
        </UnstyledButton>
        <Group>
          <Text size='sm'>{dayjs(updatedAt).fromNow()}</Text>
          <Button variant='light' fw='bold' onClick={onClick}>
            Import
          </Button>
        </Group>
      </Group>
    </Paper>
  )
}
