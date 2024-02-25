import { NextPage } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '~/utils/auth'

const Page: NextPage = async () => {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  redirect('/dashboard')
}

export default Page
