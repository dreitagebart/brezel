'use client'

import {
  Button,
  Container,
  Drawer,
  Flex,
  Grid,
  GridCol,
  Select,
  SimpleGrid,
  Title
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconLayoutGrid, IconLayoutList, IconPlus } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { getRepositories } from '~/app/actions'
import { RepositoryCard } from '~/components/cards'
import { CreateRepositoryForm, SearchRepositoryForm } from '~/components/forms'

interface Props {
  initialData: Awaited<ReturnType<typeof getRepositories>>
}

type Layouts = 'grid' | 'list'

const layoutOptions: Array<{ label: string; value: Layouts }> = [
  {
    label: 'Grid',
    value: 'grid'
  },
  {
    label: 'List',
    value: 'list'
  }
]

export const DashboardView: FC<Props> = ({ initialData }) => {
  const [search, setSearch] = useState('')
  const [layout, setLayout] = useState<Layouts>('grid')
  const [createOpen, createHandler] = useDisclosure(false)
  const { data, refetch } = useQuery({
    queryKey: ['repositories'],
    queryFn: () => getRepositories(),
    initialData
  })

  return (
    <>
      <Container size='xl'>
        <Grid gutter='lg'>
          <GridCol span='auto'>
            <SearchRepositoryForm
              onChange={(value) => setSearch(value.toLowerCase())}
            ></SearchRepositoryForm>
          </GridCol>
          <GridCol span={2}>
            <Select
              allowDeselect={false}
              value={layout}
              onChange={(value) => setLayout(value as Layouts)}
              data={layoutOptions}
              leftSectionPointerEvents='none'
              leftSection={
                layout === 'list' ? (
                  <IconLayoutList></IconLayoutList>
                ) : layout === 'grid' ? (
                  <IconLayoutGrid></IconLayoutGrid>
                ) : null
              }
            ></Select>
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
        <SimpleGrid
          mt='xl'
          cols={layout === 'list' ? 1 : layout === 'grid' ? 3 : 1}
        >
          {data
            .filter(({ title }) => title.toLowerCase().includes(search))
            .map(({ id, title, url }) => {
              return (
                <RepositoryCard key={id} data={{ title, url }}></RepositoryCard>
              )
            })}
        </SimpleGrid>
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
