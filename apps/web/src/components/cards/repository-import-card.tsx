import dayjs from 'dayjs'
import classes from '~/styles/repository-import-card.module.css'
import { Button, Group, Paper, Text } from '@mantine/core'
import { IconBrandGit } from '@tabler/icons-react'
import { FC } from 'react'

interface Props {
  data: {
    name: string
    updatedAt: Date
  }
  onClick: () => void
}

export const RepositoryImportCard: FC<Props> = ({ data, onClick }) => {
  return (
    <Paper className={classes.wrapper}>
      <Group justify='space-between'>
        <Group>
          <IconBrandGit></IconBrandGit>
          <Text>{data.name}</Text>
        </Group>
        <Group>
          <Text size='sm'>{dayjs(data.updatedAt).fromNow()}</Text>
          <Button variant='light' fw='bold' onClick={onClick}>
            Import
          </Button>
        </Group>
      </Group>
    </Paper>
  )
}
