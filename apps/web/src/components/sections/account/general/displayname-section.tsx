'use client'

import {
  Button,
  Card,
  CardSection,
  Group,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { ChangeEvent, FC, useCallback, useEffect } from 'react'
import { AuthUser } from '~/utils/types'

interface Props {
  user: AuthUser
}

interface FormValues {
  name: string
}

export const DisplaynameSection: FC<Props> = ({ user }) => {
  const { values, setFieldValue, onSubmit } = useForm<FormValues>({
    initialValues: {
      name: user.name
    }
  })

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFieldValue(event.target.name, event.target.value)
    },
    [setFieldValue]
  )

  const handleSubmit = useCallback(({ name }: FormValues) => {
    debugger
  }, [])

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Card bg='dark.8' withBorder padding='xl' shadow='xl'>
        <Title order={3}>Display name</Title>
        <Stack>
          <Text>
            Please enter your full name, or a display name you are comfortable
            with
          </Text>
          <Group>
            <TextInput
              miw={420}
              value={values.name}
              onChange={handleChange}
              name='name'
            ></TextInput>
          </Group>
        </Stack>
        <CardSection
          style={{
            marginTop: 'var(--mantine-spacing-xl)',
            borderTop: '1px solid var(--mantine-color-dark-4)',
            padding: 'var(--mantine-spacing-xl)'
          }}
        >
          <Group justify='space-between'>
            <Text c='dimmed'>Please use 32 characters at maximum.</Text>
            <Button type='submit'>Save</Button>
          </Group>
        </CardSection>
      </Card>
    </form>
  )
}
