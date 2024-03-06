'use server'

import { signIn, signOut } from '~/utils/auth'
import { client, Prisma, Repository } from '@brezel/database'
import { GithubRepo, GithubRepos } from '~/utils/types'

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

export const getRepositoryInfo = async (
  userId: string,
  owner: string,
  repo: string
) => {
  const accessToken = await getAccessToken(userId, 'github')

  if (accessToken) {
    return await fetchGithubRepo(accessToken, owner, repo)
  }

  throw new Error('Github repo not found')
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

const getAccessToken = async (userId: string, provider: string) => {
  const account = await client.account.findFirst({
    where: { userId, provider },
    select: {
      access_token: true
    }
  })

  if (!account) {
    throw new Error('access token not found')
  }

  return account.access_token
}
