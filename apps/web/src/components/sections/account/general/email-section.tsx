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
import { ChangeEvent, FC, useCallback } from 'react'
import { AuthUser } from '~/utils/types'

interface Props {
  user: AuthUser
}

interface FormValues {
  email: string
}

export const EmailSection: FC<Props> = ({ user }) => {
  const { values, setFieldValue, onSubmit, isDirty } = useForm<FormValues>({
    initialValues: {
      email: user.email
    },
    initialDirty: {
      email: false
    }
  })

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFieldValue(event.target.name, event.target.value)
    },
    [setFieldValue]
  )

  const handleSubmit = useCallback(({ email }: FormValues) => {
    debugger
  }, [])

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Card bg='dark.8' withBorder padding='xl' shadow='xl'>
        <Title order={3}>eMail</Title>
        <Stack>
          <Text>
            Please enter the email address you want to use to log in with
            brezel.
          </Text>
          <Group>
            <TextInput
              miw={420}
              value={values.email}
              onChange={handleChange}
              name='email'
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
            <Text c='dimmed'>We will email you to verify the change.</Text>
            <Button type='submit' disabled={!isDirty('email')}>
              Save
            </Button>
          </Group>
        </CardSection>
      </Card>
    </form>
  )
}
