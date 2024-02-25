import { SessionProvider } from 'next-auth/react'
import { PropsWithChildren } from 'react'
import { ShellLayout } from '~/components/layouts'
import { auth } from '~/utils/auth'

const Layout = async ({ children }: PropsWithChildren) => {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <ShellLayout>{children}</ShellLayout>
    </SessionProvider>
  )
}

export default Layout
