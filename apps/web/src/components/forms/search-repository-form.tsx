'use client'

import { TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { FC, useEffect, useState } from 'react'

interface Props {
  onChange: (value: string) => void
}

export const SearchRepositoryForm: FC<Props> = ({ onChange }) => {
  const [search, setSearch] = useState('')
  const [debounced] = useDebouncedValue(search, 2000)

  useEffect(() => {
    onChange(debounced)
  }, [debounced])

  return (
    <TextInput
      value={search}
      onChange={(event) => setSearch(event.target.value)}
      leftSection={<IconSearch></IconSearch>}
      placeholder='Search repositories...'
    ></TextInput>
  )
}
