import { GitProviders, PackageManagers } from '@brezel/shared/types'
import { getBuildConfig, getErrorMessage } from '@brezel/shared/utils'
import {
  cloneGitRepository,
  getAccessToken,
  getGithubRepositoryInfo,
  getGitlabRepositoryInfo
} from '~/app/actions'
import { auth } from '~/utils/auth'
import { GitRepository } from '~/utils/types'
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
  let accessToken: string = ''
  let gitRepo: GitRepository | null = null
  const provider = searchParams.provider as GitProviders
  const owner = searchParams.owner
  const repo = searchParams.repo
  const id = searchParams.id

  const session = await auth()

  if (!session) {
    throw new Error('Not authorized')
  }

  if (provider === 'github') {
    accessToken = await getAccessToken(session.user.id, provider)
    gitRepo = await getGithubRepositoryInfo(accessToken, owner, repo)
  }

  if (provider === 'gitlab') {
    accessToken = await getAccessToken(session.user.id, provider)
    gitRepo = await getGitlabRepositoryInfo(accessToken, id)
  }

  if (!gitRepo) {
    throw new Error('Something went wrong - Provider not specified')
  }

  const { packageManager, frameworkPreset, isTurbo, rootPath } =
    await cloneGitRepository(gitRepo, accessToken, provider, session.user.id)

  const { buildCommand, installCommand, outputDirectory } = getBuildConfig(
    packageManager,
    frameworkPreset
  )

  return (
    <NewImportView
      initialData={{
        repo: gitRepo,
        config: {
          buildCommand,
          installCommand,
          outputDirectory,
          provider,
          isTurbo,
          rootPath,
          packageManager,
          frameworkPreset
        }
      }}
    ></NewImportView>
  )
}

export default Page
