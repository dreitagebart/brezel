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
import { useSession } from 'next-auth/react'
import { ChangeEvent, FC, useCallback, useEffect } from 'react'

interface Props {}

interface FormValues {
  email: string
}

export const EmailSection: FC<Props> = () => {
  const { data: session, status } = useSession()
  const { values, setFieldValue, onSubmit, isDirty, resetDirty } =
    useForm<FormValues>({
      initialValues: {
        email: ''
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

  useEffect(() => {
    if (
      status === 'authenticated' &&
      session &&
      session.user &&
      session.user.email
    ) {
      setFieldValue('email', session.user.email)
      resetDirty({ email: session.user.email })
    }
  }, [status, session])

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
