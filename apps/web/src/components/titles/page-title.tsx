import classes from '~/styles/page-title.module.css'
import { Box, Container, Title } from '@mantine/core'
import { FC, PropsWithChildren } from 'react'

export const PageTitle: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box className={classes.wrapper}>
      <Container size='xl'>
        <Title>{children}</Title>
      </Container>
    </Box>
  )
}
