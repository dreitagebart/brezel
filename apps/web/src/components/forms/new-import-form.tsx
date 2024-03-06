'use client'

import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Group,
  Select,
  SelectProps,
  Stack,
  Switch,
  TextInput
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { ChangeEvent, FC, useCallback, useState } from 'react'
import { GithubRepo } from '~/utils/types'
import { getBuildConfig, frameworkPresets } from '@brezel/shared/utils'
import {
  IconBrandGatsby,
  IconBrandNextjs,
  IconBrandVite,
  IconCheck
} from '@tabler/icons-react'
import {
  FrameworkPresets,
  PackageManagers,
  RepositoryConfig
} from '@brezel/shared/types'

interface Props {
  data: {
    config: RepositoryConfig
    repo: GithubRepo
  }
}

interface FormState {
  packageManager: PackageManagers
  name: string
  preset: FrameworkPresets
  root: string
  buildCommand: string
  outputDirectory: string
  installCommand: string
  envs: Array<{ key: string; value: string }>
}

const iconProps = {
  stroke: 1.5,
  color: 'currentColor',
  opacity: 0.6,
  size: 18
}

const frameworkIcons: Record<FrameworkPresets, React.ReactNode> = {
  next: <IconBrandNextjs {...iconProps} />,
  gatsby: <IconBrandGatsby {...iconProps} />,
  vite: <IconBrandVite {...iconProps} />
}

const renderSelectOption: SelectProps['renderOption'] = ({
  option,
  checked
}) => (
  <Group flex='1' gap='xs'>
    {frameworkIcons[option.value as FrameworkPresets]}
    {option.label}
    {checked && (
      <IconCheck style={{ marginInlineStart: 'auto' }} {...iconProps} />
    )}
  </Group>
)

export const NewImportForm: FC<Props> = ({
  data: {
    repo,
    config: {
      packageManager,
      preset,
      buildCommand,
      installCommand,
      outputDirectory
    }
  }
}) => {
  const [locked, setLocked] = useState<
    Record<
      'root' | 'buildCommand' | 'outputDirectory' | 'installCommand',
      boolean
    >
  >({
    root: true,
    buildCommand: true,
    installCommand: true,
    outputDirectory: true
  })
  const { values, setFieldValue, onSubmit, insertListItem } =
    useForm<FormState>({
      initialValues: {
        packageManager,
        name: repo.name,
        preset,
        root: './',
        buildCommand,
        installCommand,
        outputDirectory,
        envs: [{ key: '', value: '' }]
      }
    })
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFieldValue(event.target.name, event.target.value)
  }, [])
  const handleSubmit = useCallback(({ name }: FormState) => {}, [])
  const handleFramework = useCallback(
    (preset: FrameworkPresets) => {
      const config = getBuildConfig(values.packageManager, preset)

      setFieldValue('preset', preset)
      setFieldValue('buildCommand', config.buildCommand)
      setFieldValue('installCommand', config.installCommand)
      setFieldValue('outputDirectory', config.outputDirectory)
    },
    [values.packageManager, setFieldValue]
  )

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Stack>
        <Flex gap='lg'>
          <TextInput
            flex={1}
            label='Name'
            placeholder='Name'
            value={values.name}
            onChange={handleChange}
            name='name'
          ></TextInput>
          <Select
            flex={1}
            leftSectionPointerEvents='none'
            leftSection={frameworkIcons[values.preset]}
            label='Framework preset'
            value={values.preset}
            data={frameworkPresets}
            onChange={(value) => handleFramework(value as FrameworkPresets)}
            renderOption={renderSelectOption}
          ></Select>
        </Flex>
        <Flex align='flex-end' gap='lg'>
          <TextInput
            flex={1}
            disabled={locked.root}
            label='Root directory'
            placeholder='./'
            value={values.root}
            onChange={handleChange}
            name='root'
          ></TextInput>
          <Button onClick={() => setLocked({ ...locked, root: !locked.root })}>
            Edit
          </Button>
        </Flex>
        <Accordion variant='separated' radius='md'>
          <AccordionItem value='build'>
            <AccordionControl>Build and output settings</AccordionControl>
            <AccordionPanel>
              <Stack>
                <Flex gap='lg' align='flex-end'>
                  <TextInput
                    flex={1}
                    disabled={locked.buildCommand}
                    label='Build command'
                    value={values.buildCommand}
                    onChange={handleChange}
                    name='buildCommand'
                  ></TextInput>
                  <Switch
                    mb={9}
                    label='override'
                    checked={locked.buildCommand}
                    onChange={(event) =>
                      setLocked({
                        ...locked,
                        buildCommand: event.currentTarget.checked
                      })
                    }
                  ></Switch>
                </Flex>
                <Flex gap='lg' align='flex-end'>
                  <TextInput
                    flex={1}
                    disabled={locked.outputDirectory}
                    label='Output directory'
                    value={values.outputDirectory}
                    onChange={handleChange}
                    name='outputDirectory'
                  ></TextInput>
                  <Switch
                    mb={9}
                    label='override'
                    checked={locked.outputDirectory}
                    onChange={(event) =>
                      setLocked({
                        ...locked,
                        outputDirectory: event.currentTarget.checked
                      })
                    }
                  ></Switch>
                </Flex>
                <Flex gap='lg' align='flex-end'>
                  <TextInput
                    flex={1}
                    disabled={locked.installCommand}
                    label='Install commmand'
                    value={values.installCommand}
                    onChange={handleChange}
                    name='installCommand'
                  ></TextInput>
                  <Switch
                    mb={9}
                    label='override'
                    checked={locked.installCommand}
                    onChange={(event) =>
                      setLocked({
                        ...locked,
                        installCommand: event.currentTarget.checked
                      })
                    }
                  ></Switch>
                </Flex>
              </Stack>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value='env'>
            <AccordionControl>Environment variables</AccordionControl>
            <AccordionPanel>
              <Stack>
                {values.envs.map(({ key, value }, index) => {
                  return (
                    <Group key={index} align='flex-end'>
                      <TextInput
                        flex={1}
                        label='Key'
                        value={key}
                        placeholder='EXAMPLE_VARIABLE'
                        onChange={(e) =>
                          setFieldValue(
                            `envs.${index}.key`,
                            e.target.value.toUpperCase()
                          )
                        }
                      ></TextInput>
                      <TextInput
                        flex={1}
                        label='Value'
                        value={value}
                        placeholder='6404aa1d9c921a2639a307b4'
                        onChange={(e) =>
                          setFieldValue(`envs.${index}.value`, e.target.value)
                        }
                      ></TextInput>
                      <Button
                        onClick={() =>
                          insertListItem('envs', { key: '', value: '' })
                        }
                      >
                        Add
                      </Button>
                    </Group>
                  )
                })}
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Stack>
    </form>
  )
}
