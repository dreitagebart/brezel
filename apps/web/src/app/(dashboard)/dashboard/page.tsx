import { NextPage } from 'next'
import { getRepositories } from '~/app/actions'
import { DashboardView } from '~/views'

const Page: NextPage = async () => {
  const repositories = await getRepositories()

  return <DashboardView initialData={{ repositories }}></DashboardView>
}

export default Page
