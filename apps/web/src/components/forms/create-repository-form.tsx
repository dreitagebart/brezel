'use client'

import { useForm } from '@mantine/form'
import {
  Button,
  Combobox,
  ComboboxDropdown,
  ComboboxEmpty,
  ComboboxOption,
  ComboboxOptions,
  ComboboxTarget,
  Drawer,
  Flex,
  Group,
  Loader,
  Text,
  TextInput,
  Title,
  useCombobox
} from '@mantine/core'
import { ChangeEvent, useCallback, useEffect } from 'react'
import { IconBrandGit, IconPlus, IconSearch } from '@tabler/icons-react'
import { createRepository, selectGithubRepos } from '~/app/actions'
import { Repository } from '@brezel/database'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks'
import { GithubRepos } from '~/utils/types'

interface Props {
  open: boolean
  onSuccess: (repo: Repository) => void
  onChange: (open: boolean) => void
}

interface FormValues {
  id: string
  search: string
  name: string
  url: string
}

export const CreateRepositoryForm = ({ open, onChange, onSuccess }: Props) => {
  const { user } = useAuth()
  const { values, setFieldValue, onSubmit, errors, reset } =
    useForm<FormValues>({
      initialValues: {
        id: '',
        search: '',
        name: '',
        url: ''
      },
      validate: {
        name: (value) => (value ? null : 'Please set a title'),
        url: (value) => (value ? null : 'No url is specified')
      }
    })
  const comboboxRepos = useCombobox({
    onDropdownClose: () => comboboxRepos.resetSelectedOption()
  })
  const { data: dataRepos, isLoading: isLoadingRepos } = useQuery<GithubRepos>({
    queryKey: ['githubRepos'],
    queryFn: () => selectGithubRepos(user.id, user.name),
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
  const options = filteredRepos?.map(({ id, full_name }) => (
    <ComboboxOption my='xs' key={id} value={String(id)}>
      <Group gap='xs'>
        <IconBrandGit></IconBrandGit>
        <Text>{full_name}</Text>
      </Group>
    </ComboboxOption>
  ))
  const handleSubmit = useCallback(({ name, url }: FormValues) => {
    createRepository({
      title: name,
      url,
      createdBy: { connect: { email: user.email } }
    })
      .then((repo) => {
        reset()
        onChange(false)
        onSuccess(repo)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFieldValue(event.target.name, event.target.value)
    },
    [setFieldValue]
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
      <form onSubmit={onSubmit(handleSubmit)}>
        <Flex mt='xl' direction='column' gap='xl'>
          <Combobox
            onOptionSubmit={(optionValue) => {
              const repo = dataRepos?.find(
                ({ id }) => String(id) === optionValue
              )

              if (repo) {
                setFieldValue('search', repo.name)
                setFieldValue('id', String(repo.id))
                setFieldValue('url', repo.html_url)
                setFieldValue('name', repo.name)
              }
              comboboxRepos.closeDropdown()
            }}
            store={comboboxRepos}
            withinPortal={true}
          >
            <ComboboxTarget>
              <TextInput
                label='Select your github repository...'
                placeholder='Search...'
                value={values.search}
                onChange={(event) => {
                  setFieldValue('search', event.target.value)
                  comboboxRepos.openDropdown()
                }}
                onClick={() => comboboxRepos.openDropdown()}
                onFocus={() => comboboxRepos.openDropdown()}
                onBlur={() => comboboxRepos.closeDropdown()}
                leftSection={<IconSearch></IconSearch>}
                rightSection={
                  isLoadingRepos ? <Loader size={18}></Loader> : null
                }
              ></TextInput>
            </ComboboxTarget>
            <ComboboxDropdown>
              <ComboboxOptions mah={280} style={{ overflow: 'auto' }}>
                {options?.length === 0 ? (
                  <ComboboxEmpty>No repo found</ComboboxEmpty>
                ) : (
                  options
                )}
              </ComboboxOptions>
            </ComboboxDropdown>
          </Combobox>
          <TextInput
            error={errors.url}
            label='Git URL'
            placeholder='Repository url'
            value={values.url}
            onChange={handleChange}
            name='url'
            readOnly
          ></TextInput>
          <Group justify='right'>
            <Button
              disabled={shouldFilterRepos}
              leftSection={<IconPlus></IconPlus>}
              type='submit'
            >
              create
            </Button>
            <Button
              variant='light'
              onClick={() => {
                reset()
                onChange(false)
              }}
            >
              Cancel
            </Button>
          </Group>
        </Flex>
      </form>
    </Drawer>
  )
}
