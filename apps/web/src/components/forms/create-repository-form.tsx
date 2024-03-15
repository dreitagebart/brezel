'use client'

import { useForm } from '@mantine/form'
import {
  ActionIcon,
  Drawer,
  Flex,
  Group,
  Loader,
  Notification,
  Select,
  SelectProps,
  Stack,
  Text,
  TextInput,
  Title,
  useCombobox
} from '@mantine/core'
import { ChangeEvent, ReactNode, useCallback, useEffect } from 'react'
import {
  IconBrandBitbucket,
  IconBrandGithub,
  IconBrandGitlab,
  IconCheck,
  IconSearch,
  IconX
} from '@tabler/icons-react'
import { selectGitProviders, selectRepositories } from '~/app/actions'
import { Repository } from '@brezel/database'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks'
import { GitRepositories } from '~/utils/types'
import { RepositoryImportCard } from '../cards'
import { useRouter } from 'next/navigation'
import { GitProviders } from '@brezel/shared/types'

interface Props {
  open: boolean
  onSuccess: (repo: Repository) => void
  onChange: (open: boolean) => void
}

interface FormValues {
  username: string
  provider: GitProviders | null
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

const providersMap: Record<GitProviders, { icon: ReactNode; label: string }> = {
  github: {
    icon: <IconBrandGithub {...iconProps}></IconBrandGithub>,
    label: 'Github'
  },
  gitlab: {
    icon: <IconBrandGitlab {...iconProps}></IconBrandGitlab>,
    label: 'Gitlab'
  },
  bitbucket: {
    icon: <IconBrandBitbucket {...iconProps}></IconBrandBitbucket>,
    label: 'Bitbucket'
  }
}

// const providerIcons: Record<string, React.ReactNode> = {
//   github: <IconBrandGithub {...iconProps} />,
//   gitlab: <IconBrandGitlab {...iconProps} />,
//   bitbucket: <IconBrandBitbucket {...iconProps} />
// }

const renderSelectOption: SelectProps['renderOption'] = ({
  option,
  checked
}) => (
  <Group flex='1' gap='xs'>
    {providersMap[option.value as GitProviders].icon}
    {option.label}
    {checked && (
      <IconCheck style={{ marginInlineStart: 'auto' }} {...iconProps} />
    )}
  </Group>
)

export const CreateRepositoryForm = ({ open, onChange }: Props) => {
  const router = useRouter()
  const { user } = useAuth()
  const { values, setFieldValue, reset } = useForm<FormValues>({
    initialValues: {
      provider: null,
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
  const { data: dataProviders, isFetched: isFetchedProviders } = useQuery<
    Array<GitProviders>
  >({
    queryKey: ['selectGitProviders'],
    queryFn: () => selectGitProviders(user.id)
  })
  const { data: dataRepos, isLoading: isLoadingRepos } =
    useQuery<GitRepositories>({
      queryKey: ['selectRepositories', values.provider],
      queryFn: () =>
        selectRepositories(user.id, values.provider as GitProviders),
      enabled: open && isFetchedProviders && values.provider !== null
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

  useEffect(() => {
    if (isFetchedProviders && dataProviders && dataProviders.length > 0) {
      setFieldValue('provider', dataProviders[0]!)
    }
  }, [isFetchedProviders])

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
          allowDeselect={false}
          data={
            dataProviders?.map((provider) => {
              return {
                value: provider,
                label: providersMap[provider].label
              }
            }) || []
          }
          leftSection={
            values.provider ? providersMap[values.provider].icon : null
          }
          leftSectionPointerEvents='none'
          onChange={(value) => setFieldValue('provider', value as GitProviders)}
          value={values.provider}
          placeholder='Git provider'
          rightSection={isLoadingRepos && <Loader size={18}></Loader>}
          rightSectionPointerEvents='none'
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
          filteredRepos
            ?.slice(0, 5)
            .map(({ name, id, updatedAt, owner, url }) => {
              return (
                <RepositoryImportCard
                  key={id}
                  data={{
                    id,
                    owner,
                    name,
                    updatedAt,
                    url
                  }}
                  onClick={() =>
                    handleSelect({
                      id: String(id),
                      provider: String(values.provider),
                      repo: name,
                      owner: owner
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
