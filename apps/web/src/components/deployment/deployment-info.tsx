import {
  Accordion,
  AccordionControl,
  AccordionItem,
  Title
} from '@mantine/core'
import { FC } from 'react'

interface Props {
  active: boolean
}

export const DeploymentInfo: FC<Props> = ({ active }) => {
  return (
    <div>
      <Title order={2}>Deployment</Title>
      <Accordion mt='md' variant='separated'>
        <AccordionItem value='building'>
          <AccordionControl>Blutwurst</AccordionControl>
        </AccordionItem>
        <AccordionItem value='summary'>
          <AccordionControl>Knödel</AccordionControl>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
