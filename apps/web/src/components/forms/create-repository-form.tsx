'use client'

import { useForm } from '@mantine/form'
import { Button, Drawer, Flex, Group, TextInput, Title } from '@mantine/core'
import { ChangeEvent, useCallback } from 'react'
import { IconPlus } from '@tabler/icons-react'
import { createRepository } from '~/app/actions'
import { useSession } from 'next-auth/react'
import { Repository } from '@brezel/database'

interface Props {
  open: boolean
  onSuccess: (repo: Repository) => void
  onChange: (open: boolean) => void
}

interface FormValues {
  title: string
  url: string
}

export const CreateRepositoryForm = ({ open, onChange, onSuccess }: Props) => {
  const { data: session } = useSession()
  const { values, setFieldValue, onSubmit, errors, reset } =
    useForm<FormValues>({
      initialValues: {
        title: '',
        url: ''
      },
      validate: {
        title: (value) => (value ? null : 'Please set a title'),
        url: (value) => (value ? null : 'No url is specified')
      }
    })
  const handleSubmit = useCallback(({ title, url }: FormValues) => {
    createRepository({
      title,
      url,
      createdBy: { connect: { email: session!.user!.email! } }
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
      <Title>Let's create something new...</Title>
      <form onSubmit={onSubmit(handleSubmit)}>
        <Flex mt='xl' direction='column' gap='xl'>
          <TextInput
            error={errors.title}
            label='Title'
            placeholder='Repository name'
            value={values.title}
            onChange={handleChange}
            name='title'
          ></TextInput>
          <TextInput
            error={errors.url}
            label='Git URL'
            placeholder='Repository url'
            value={values.url}
            onChange={handleChange}
            name='url'
          ></TextInput>
          <Group justify='right'>
            <Button leftSection={<IconPlus></IconPlus>} type='submit'>
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
