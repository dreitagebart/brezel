import { redirect } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { ShellLayout } from '~/components/layouts'
import { AuthProvider } from '~/components/providers'
import { auth } from '~/utils/auth'

const Layout = async ({ children }: PropsWithChildren) => {
  const session = await auth()

  if (!session || !session.user) {
    return redirect('/login')
  }

  return (
    <AuthProvider
      user={{
        ...session.user
      }}
    >
      <ShellLayout route='dashboard'>{children}</ShellLayout>
    </AuthProvider>
  )
}

export default Layout
