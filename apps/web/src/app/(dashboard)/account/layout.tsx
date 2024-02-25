import { Container, Grid, GridCol } from '@mantine/core'
import { PropsWithChildren, ReactNode } from 'react'
import { AccountNavLinks } from '~/components/navlinks'
import { PageTitle } from '~/components/titles'

const Layout = ({ children }: PropsWithChildren): ReactNode => {
  return (
    <>
      <PageTitle>Account settings</PageTitle>
      <Container size='xl' py='xl'>
        <Grid>
          <GridCol span={{ base: 12, xs: 3 }}>
            <AccountNavLinks></AccountNavLinks>
          </GridCol>
          <GridCol span={{ base: 12, xs: 9 }}>{children}</GridCol>
        </Grid>
      </Container>
    </>
  )
}

export default Layout
