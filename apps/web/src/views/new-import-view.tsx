import Link from 'next/link'
import {
  Container,
  Group,
  Paper,
  Stack,
  Text,
  UnstyledButton
} from '@mantine/core'
import { IconArrowLeft, IconBrandGithub } from '@tabler/icons-react'
import { FC } from 'react'
import { NewImportForm } from '~/components/forms'
import { PageTitle } from '~/components/titles'
import { GithubRepo } from '~/utils/types'
import { RepositoryConfig } from '@brezel/shared/types'

interface Props {
  initialData: {
    repo: GithubRepo
    config: RepositoryConfig
  }
}

export const NewImportView: FC<Props> = ({ initialData: { repo, config } }) => {
  return (
    <>
      <PageTitle>
        <Stack gap={0}>
          <UnstyledButton component={Link} href='/dashboard'>
            <Group gap='xs' c='dimmed'>
              <IconArrowLeft></IconArrowLeft> back
            </Group>
          </UnstyledButton>
          You're almost done...
          <Text size='md' mt='xs' c='dimmed'>
            Please follow the steps to configure your repository and deploy it
          </Text>
          <Paper p='xl' mt='xl' radius='md'>
            <Group>
              <IconBrandGithub></IconBrandGithub>
              <Text>{repo.full_name}</Text>
            </Group>
          </Paper>
        </Stack>
      </PageTitle>
      <Container size='xl' mt='xl'>
        <NewImportForm data={{ repo, config }}></NewImportForm>
      </Container>
    </>
  )
}
