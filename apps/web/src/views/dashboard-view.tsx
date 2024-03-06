'use client'

import {
  ActionIcon,
  Button,
  Container,
  Grid,
  GridCol,
  Group,
  Notification,
  SegmentedControl,
  SimpleGrid,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  IconFilterBolt,
  IconLayoutGrid,
  IconLayoutList,
  IconPlus,
  IconSearch,
  IconX
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { getRepositories } from '~/app/actions'
import { RepositoryCard } from '~/components/cards'
import { CreateRepositoryForm } from '~/components/forms'
import { Layouts } from '~/utils/types'

interface Props {
  initialData: Awaited<ReturnType<typeof getRepositories>>
}

export const DashboardView: FC<Props> = ({ initialData }) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 300)

  const [layout, setLayout] = useState<Layouts>('grid')
  const [createOpen, createHandler] = useDisclosure(false)
  const { data, refetch } = useQuery({
    queryKey: ['repositories'],
    queryFn: () => getRepositories(),
    initialData
  })
  const filtered = data.filter((repo) =>
    repo.name.toLowerCase().includes(debouncedSearch)
  )

  return (
    <>
      <Container size='xl' mt='xl'>
        <Grid gutter='lg'>
          <GridCol span='auto'>
            <TextInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              leftSection={<IconSearch></IconSearch>}
              rightSection={
                search && (
                  <ActionIcon
                    variant='transparent'
                    size={20}
                    onClick={() => setSearch('')}
                  >
                    <IconX></IconX>
                  </ActionIcon>
                )
              }
              placeholder='Search repositories...'
            ></TextInput>
          </GridCol>
          <GridCol span={2}>
            <SegmentedControl
              styles={{
                root: {
                  backgroundColor: 'transparent'
                }
              }}
              color='orange.5'
              value={layout}
              onChange={(value) => setLayout(value as Layouts)}
              data={[
                {
                  label: (
                    <Group gap='xs' wrap='nowrap'>
                      <IconLayoutGrid size={16}></IconLayoutGrid>
                      <Text size='sm'>Grid</Text>
                    </Group>
                  ),
                  value: 'grid'
                },
                {
                  label: (
                    <Group gap='xs' wrap='nowrap'>
                      <IconLayoutList size={16}></IconLayoutList>
                      <Text size='sm'>List</Text>
                    </Group>
                  ),
                  value: 'list'
                }
              ]}
            ></SegmentedControl>
          </GridCol>
          <GridCol span='content'>
            <Button
              leftSection={<IconPlus></IconPlus>}
              onClick={createHandler.open}
            >
              create new
            </Button>
          </GridCol>
        </Grid>
        {data.length > 0 ? (
          filtered.length === 0 ? (
            <Group mt='xl' justify='flex-start' miw={620}>
              <Notification
                color='red.5'
                title={
                  <Group gap='xs'>
                    <IconFilterBolt></IconFilterBolt>
                    <Text size='lg'>Nothing found</Text>
                  </Group>
                }
                withCloseButton={false}
              >
                <Group>
                  <Text>No repositories match your search criteria...</Text>
                  {/* <UnstyledButton variant='light' onClick={() => setSearch('')}>
                    <Text fw='bold'>clear filter</Text>
                  </UnstyledButton> */}
                </Group>
              </Notification>
            </Group>
          ) : (
            <SimpleGrid
              mt='xl'
              cols={layout === 'list' ? 1 : layout === 'grid' ? 3 : 1}
            >
              {filtered.map((repo) => {
                return (
                  <RepositoryCard key={repo.id} data={repo}></RepositoryCard>
                )
              })}
            </SimpleGrid>
          )
        ) : (
          <Group mt='xl' justify='center'>
            <Title order={3}>There are no repositories yet</Title>
            <Button
              variant='light'
              leftSection={<IconPlus></IconPlus>}
              onClick={createHandler.open}
            >
              create new repository
            </Button>
          </Group>
        )}
      </Container>
      <CreateRepositoryForm
        onSuccess={() => {
          notifications.show({
            message: 'New repository added'
          })
          refetch()
        }}
        onChange={(open) =>
          open ? createHandler.open() : createHandler.close()
        }
        open={createOpen}
      ></CreateRepositoryForm>
    </>
  )
}
