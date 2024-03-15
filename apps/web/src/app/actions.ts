'use server'

import git from 'simple-git'
import { readdirSync } from 'fs'
import { emptyDirSync } from 'fs-extra'
import { join } from 'path'
import { signIn, signOut } from '~/utils/auth'
import { config } from '@brezel/shared/config'
import { createId, createSlug, getErrorMessage } from '@brezel/shared/utils'
import {
  DeploymentSettings,
  FrameworkPresets,
  GitProviders,
  PackageManagers,
  RepositoryConfig
} from '@brezel/shared/types'
import { client, Prisma, Repository } from '@brezel/database'
import {
  GitRepositories,
  GitRepository,
  GithubRepo,
  GithubRepos,
  GitlabRepo,
  GitlabRepos
} from '~/utils/types'

export const login = async (provider: string) => {
  await signIn(provider, { redirectTo: '/' })
}

export const logout = async () => {
  await signOut({ redirectTo: '/' })
}

export const getRepositories = async () => {
  return await client.repository.findMany()
}

export const createRepository = async (
  data: Prisma.Args<typeof client.repository, 'create'>['data']
): Promise<Repository> => {
  return client.repository.create({
    data
  })
}

const fetchGithubRepos = async (accessToken: string): Promise<GithubRepos> => {
  const res = await fetch(`https://api.github.com/user/repos?sort=updated`, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  return await res.json()
}

const fetchGitlabRepos = async (accessToken: string): Promise<GitlabRepos> => {
  try {
    const res = await fetch(
      `https://gitlab.com/api/v4/projects?owned=true&order_by=updated_at&simple=true`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    return await res.json()
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

const fetchGithubRepo = async (
  accessToken: string,
  owner: string,
  repo: string
): Promise<GithubRepo> => {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  return await res.json()
}

const fetchGitlabRepo = async (
  accessToken: string,
  id: string
): Promise<GitlabRepo> => {
  const res = await fetch(
    `https://gitlab.com/api/v4/projects/${id}?simple=true`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  )

  if (!res.ok) {
    throw new Error(
      `Could not fetch gitlab repository ${res.status} - ${res.statusText}`
    )
  }

  return await res.json()
}

export const getGitlabRepositoryInfo = async (
  token: string,
  id: string
): Promise<GitRepository> => {
  const gitlabRepo = await fetchGitlabRepo(token, id)

  return {
    id: gitlabRepo.id,
    name: gitlabRepo.path,
    owner: gitlabRepo.namespace.path,
    url: gitlabRepo.web_url,
    updatedAt: gitlabRepo.created_at
  }
}

export const deployRepository = async () => {}

export const cloneGitRepository = async (
  repo: GitRepository,
  token: string,
  provider: GitProviders,
  userId: string
): Promise<DeploymentSettings> => {
  let folder = ''
  let gitPath = ''

  const existingRepo = await client.repository.findFirst({
    where: {
      repoId: repo.id,
      owner: repo.owner,
      name: repo.name,
      provider
    }
  })

  if (existingRepo) {
    folder = existingRepo.folder
    gitPath = join(config.path.repos, folder)
    emptyDirSync(gitPath)
  } else {
    folder = `${createSlug(repo.url)}-${createId()}`
    gitPath = join(config.path.repos, folder)
  }

  const authUrl = repo.url.replace(
    'https://',
    `https://${
      provider === 'gitlab'
        ? 'oauth2'
        : provider === 'bitbucket'
          ? 'x-token-auth'
          : repo.owner
    }:${token}@`
  )

  console.log(`cloning git repository into ${gitPath} using url ${authUrl}`)

  await git().clone(authUrl, gitPath)

  if (!existingRepo) {
    await createRepository({
      folder,
      name: repo.name,
      owner: repo.owner,
      provider,
      repoId: repo.id,
      url: repo.url,
      createdBy: {
        connect: {
          id: userId
        }
      }
    })
  }

  return detectDeploymentSettings(gitPath)
}

export const getGithubRepositoryInfo = async (
  token: string,
  owner: string,
  repo: string
): Promise<GitRepository> => {
  const githubRepo = await fetchGithubRepo(token, owner, repo)

  if (!githubRepo) {
    throw new Error('Could not read github repository')
  }

  return {
    id: githubRepo.id,
    name: githubRepo.name,
    owner: githubRepo.owner.login,
    url: githubRepo.html_url,
    updatedAt: githubRepo.updated_at
  }
}

export const selectRepositories = async (
  userId: string,
  provider: GitProviders
): Promise<GitRepositories> => {
  const repositories: GitRepositories = []
  const accessToken = await getAccessToken(userId, provider)

  console.log('userId', userId)
  console.log('provider', provider)

  if (provider === 'github') {
    const githubRepos = await fetchGithubRepos(accessToken)

    githubRepos.map(({ id, name, owner, html_url, updated_at }) => {
      repositories.push({
        id,
        name,
        owner: owner.login,
        url: html_url,
        updatedAt: updated_at
      })
    })
  }

  if (provider === 'gitlab') {
    const gitlabRepos = await fetchGitlabRepos(accessToken)

    console.log('gitlabRepos', JSON.stringify(gitlabRepos, null, 2))

    gitlabRepos.map(({ id, path, namespace, web_url, created_at }) => {
      repositories.push({
        id,
        name: path,
        owner: namespace.path,
        url: web_url,
        updatedAt: created_at
      })
    })
  }

  return repositories
}

export const selectGithubRepos = async (
  userId: string
): Promise<GithubRepos> => {
  const accessToken = await getAccessToken(userId, 'github')

  if (accessToken) {
    return await fetchGithubRepos(accessToken)
  }

  return []
}

export const selectGitlabRepos = async (
  userId: string
): Promise<GitlabRepos> => {
  const accessToken = await getAccessToken(userId, 'gitlab')

  if (accessToken) {
    return await fetchGitlabRepos(accessToken)
  }

  return []
}

export const getAccessToken = async (
  userId: string,
  provider: GitProviders
): Promise<string> => {
  const account = await client.account.findFirst({
    where: { userId, provider },
    select: {
      access_token: true
    }
  })

  if (!account || !account.access_token) {
    throw new Error('access token not found')
  }

  return account.access_token
}

export const selectGitProviders = async (
  userId: string
): Promise<Array<GitProviders>> => {
  const providers = await client.account.findMany({
    where: {
      userId
    },
    select: {
      provider: true
    }
  })

  if (!providers) {
    return []
  }

  return providers.map((p) => p.provider as GitProviders)
}

const detectDeploymentSettings = (repoPath: string): DeploymentSettings => {
  let isTurbo = false
  let packageManager: PackageManagers = 'npm'
  let frameworkPreset: FrameworkPresets = 'next'
  let rootPath = './'

  const files = readdirSync(join(repoPath))

  if (files.includes('yarn.lock')) {
    packageManager = 'yarn'
  }

  if (files.includes('package-lock.json')) {
    packageManager = 'npm'
  }

  if (files.includes('pnpm-lock.yaml')) {
    packageManager = 'pnpm'
  }

  if (files.includes('bun.lockb')) {
    packageManager = 'bun'
  }

  if (files.includes('next.config.js')) {
    frameworkPreset = 'next'
  }

  if (files.includes('vite.config.ts') || files.includes('vite.config.js')) {
    frameworkPreset = 'vite'
  }

  if (files.includes('turbo.json')) {
    isTurbo = true
  }

  return { isTurbo, packageManager, frameworkPreset, rootPath }
}
