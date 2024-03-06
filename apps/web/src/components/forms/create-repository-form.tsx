'use client'

import dayjs from 'dayjs'
import { useForm } from '@mantine/form'
import {
  ActionIcon,
  Button,
  Drawer,
  Flex,
  Group,
  Notification,
  Paper,
  Select,
  SelectProps,
  Stack,
  Text,
  TextInput,
  Title,
  useCombobox
} from '@mantine/core'
import { ChangeEvent, useCallback, useEffect } from 'react'
import {
  IconBrandBitbucket,
  IconBrandGithub,
  IconBrandGitlab,
  IconCheck,
  IconSearch,
  IconX
} from '@tabler/icons-react'
import { selectGithubRepos } from '~/app/actions'
import { Repository } from '@brezel/database'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks'
import { GithubRepos } from '~/utils/types'
import { RepositoryImportCard } from '../cards'
import { useRouter } from 'next/navigation'

interface Props {
  open: boolean
  onSuccess: (repo: Repository) => void
  onChange: (open: boolean) => void
}

interface FormValues {
  username: string
  provider: string
  repoId: string
  repoName: string
  repoUrl: string
  search: string
}

const iconProps = {
  stroke: 1.5,
  color: 'currentColor',
  opacity: 0.6,
  size: 18
}

const providerIcons: Record<string, React.ReactNode> = {
  github: <IconBrandGithub {...iconProps} />,
  gitlab: <IconBrandGitlab {...iconProps} />,
  bitbucket: <IconBrandBitbucket {...iconProps} />
}

const renderSelectOption: SelectProps['renderOption'] = ({
  option,
  checked
}) => (
  <Group flex='1' gap='xs'>
    {providerIcons[option.value]}
    {option.label}
    {checked && (
      <IconCheck style={{ marginInlineStart: 'auto' }} {...iconProps} />
    )}
  </Group>
)

export const CreateRepositoryForm = ({ open, onChange, onSuccess }: Props) => {
  const router = useRouter()
  const { user } = useAuth()
  const { values, setFieldValue, onSubmit, errors, reset } =
    useForm<FormValues>({
      initialValues: {
        provider: user.provider,
        username: '',
        repoId: '',
        repoName: '',
        repoUrl: '',
        search: ''
      },
      validate: {
        repoName: (value) => (value ? null : 'Please set a title'),
        repoUrl: (value) => (value ? null : 'No url is specified')
      }
    })
  const comboboxRepos = useCombobox({
    onDropdownClose: () => comboboxRepos.resetSelectedOption()
  })
  const { data: dataRepos, isLoading: isLoadingRepos } = useQuery<GithubRepos>({
    queryKey: ['githubRepos'],
    queryFn: () => selectGithubRepos(user.id),
    enabled: open
  })
  const shouldFilterRepos = !dataRepos?.some(
    (repo) => repo.name === values.search
  )
  const filteredRepos = shouldFilterRepos
    ? dataRepos?.filter((repo) =>
        repo.name.toLowerCase().includes(values.search.toLowerCase().trim())
      )
    : dataRepos
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFieldValue(event.target.name, event.target.value)
    },
    [setFieldValue]
  )
  const handleSelect = useCallback(
    ({
      provider,
      owner,
      repo,
      id
    }: {
      provider: string
      owner: string
      repo: string
      id: string
    }) => {
      router.push(
        `/new/import?provider=${provider}&owner=${owner}&repo=${repo}&id=${id}`
      )
    },
    []
  )

  useEffect(() => {
    comboboxRepos.selectFirstOption()
  }, [values.search])

  return (
    <Drawer
      closeOnClickOutside={false}
      size='xl'
      opened={open}
      onClose={() => {
        reset()
        onChange(false)
      }}
      position='right'
      title='New repository'
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
    >
      <Title order={2}>Let's build something new...</Title>
      <Flex mt='xl' direction='row' gap='md' w='100%'>
        <Select
          data={[
            {
              value: 'github',
              label: 'Github'
            },
            {
              value: 'gitlab',
              label: 'Gitlab'
            },
            {
              value: 'bitbucket',
              label: 'Bitbucket'
            }
          ]}
          leftSection={providerIcons[values.provider]}
          leftSectionPointerEvents='none'
          value='github'
          placeholder='Git provider'
          renderOption={renderSelectOption}
        ></Select>
        <TextInput
          w='100%'
          leftSection={<IconSearch></IconSearch>}
          placeholder='Search repository...'
          value={values.search}
          onChange={handleChange}
          name='search'
          rightSection={
            values.search.length > 0 && (
              <ActionIcon
                size='sm'
                variant='transparent'
                onClick={() => setFieldValue('search', '')}
              >
                <IconX></IconX>
              </ActionIcon>
            )
          }
        ></TextInput>
      </Flex>
      <Stack mt='lg'>
        {filteredRepos?.length === 0 ? (
          <Notification
            title='No Results Found'
            onClose={() => setFieldValue('search', '')}
          >
            <Text>
              Your search for{' '}
              <Text span fw='bold' c='white'>
                "{values.search}"
              </Text>{' '}
              did not return any results.
            </Text>
            <Text>
              Try selecting a different Git account or organization on the top
              left.
            </Text>
          </Notification>
        ) : (
          filteredRepos?.slice(0, 5).map(({ name, id, updated_at, owner }) => {
            return (
              <RepositoryImportCard
                key={id}
                data={{
                  name,
                  updatedAt: updated_at
                }}
                onClick={() =>
                  handleSelect({
                    id: String(id),
                    provider: user.provider,
                    repo: name,
                    owner: owner.login
                  })
                }
              ></RepositoryImportCard>
            )
          })
        )}
      </Stack>
    </Drawer>
  )
}
