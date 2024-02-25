import { redirect } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { CenterLayout } from '~/components/layouts'
import { auth } from '~/utils/auth'

const Layout = async ({ children }: PropsWithChildren) => {
  const session = await auth()

  if (session?.user) {
    redirect('/')
  }

  return <CenterLayout>{children}</CenterLayout>
}

export default Layout
