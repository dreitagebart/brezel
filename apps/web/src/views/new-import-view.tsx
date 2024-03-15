import Link from 'next/link'
import {
  Container,
  Flex,
  Group,
  Paper,
  Stack,
  Stepper,
  StepperStep,
  Text,
  UnstyledButton
} from '@mantine/core'
import {
  IconArrowLeft,
  IconBrandBitbucket,
  IconBrandGithub,
  IconBrandGitlab,
  IconGitBranch
} from '@tabler/icons-react'
import { FC, ReactNode } from 'react'
import { NewImportForm } from '~/components/forms'
import { PageTitle } from '~/components/titles'
import { GitRepository } from '~/utils/types'
import { GitProviders, RepositoryConfig } from '@brezel/shared/types'
import { DeploymentInfo } from '~/components/deployment'

interface Props {
  initialData: {
    repo: GitRepository
    config: RepositoryConfig
  }
}

const bigIconProps = {
  stroke: 2,
  color: 'currentColor',
  opacity: 0.6,
  size: 32
}

const smallIconProps = {
  stroke: 1,
  color: 'currentColor',
  size: 20
}

const providersMap: Record<GitProviders, { small: ReactNode; big: ReactNode }> =
  {
    github: {
      small: <IconBrandGithub {...smallIconProps}></IconBrandGithub>,
      big: <IconBrandGithub {...bigIconProps}></IconBrandGithub>
    },
    gitlab: {
      small: <IconBrandGitlab {...smallIconProps}></IconBrandGitlab>,
      big: <IconBrandGitlab {...bigIconProps}></IconBrandGitlab>
    },
    bitbucket: {
      small: <IconBrandBitbucket {...smallIconProps}></IconBrandBitbucket>,
      big: <IconBrandBitbucket {...bigIconProps}></IconBrandBitbucket>
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
          <Paper p='xl' mt='xl' radius='md' hiddenFrom='sm'>
            <Group>
              {providersMap[config.provider].big}
              <Text>
                {repo.owner}/{repo.name}
              </Text>
            </Group>
          </Paper>
        </Stack>
      </PageTitle>
      <Container size='xl' mt='xl'>
        <Flex direction='row' gap='xl'>
          <Stack gap='xl' visibleFrom='sm' flex={0.3}>
            <Paper p='xl' radius='md'>
              <Group>
                {providersMap[config.provider].big}
                <Text>
                  {repo.owner}/{repo.name}
                </Text>
              </Group>
            </Paper>
            <Stepper mx='sm' iconSize={24} active={1} orientation='vertical'>
              <StepperStep
                label='Configure'
                description='Set settings for your deployment'
              ></StepperStep>
              <StepperStep
                label='Deploy'
                description='Deploy your repository to the platform'
              ></StepperStep>
              <StepperStep
                label='View'
                description='Check your results'
              ></StepperStep>
            </Stepper>
            <Stack>
              <Text fw='bold' tt='uppercase' size='sm' lts={1}>
                Repository information
              </Text>
              <Group>
                {providersMap[config.provider].small}
                <UnstyledButton
                  component={Link}
                  href={repo.url}
                  target='_blank'
                >
                  <Text>
                    {repo.owner}/{repo.name}
                  </Text>
                </UnstyledButton>
              </Group>
              <Group>
                <IconGitBranch size={20}></IconGitBranch>
                <Text>main</Text>
              </Group>
            </Stack>
          </Stack>
          <Stack gap='xl' flex={0.7}>
            <NewImportForm data={{ repo, config }}></NewImportForm>
            <DeploymentInfo active={true}></DeploymentInfo>
          </Stack>
        </Flex>
      </Container>
    </>
  )
}
