import { getBuildConfig } from '@brezel/shared/utils'
import { getRepositoryInfo } from '~/app/actions'
import { auth } from '~/utils/auth'
import { NewImportView } from '~/views'

const Page = async ({
  searchParams
}: {
  searchParams: {
    provider: string
    owner: string
    repo: string
    id: string
  }
}) => {
  const provider = searchParams.provider
  const owner = searchParams.owner
  const repo = searchParams.repo
  const id = searchParams.id

  const session = await auth()
  const repoInfo = await getRepositoryInfo(session?.user.id || '', owner, repo)

  const packageManager = 'pnpm'
  const preset = 'next'
  const config = getBuildConfig(packageManager, preset)

  return (
    <NewImportView
      initialData={{
        repo: repoInfo,
        config: { ...config, packageManager, preset }
      }}
    ></NewImportView>
  )
}

export default Page
