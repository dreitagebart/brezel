'use server'

import { signIn, signOut } from '~/utils/auth'
import { client, Prisma, Repository } from '@brezel/database'

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

export const selectGithubRepos = async (userId: string, username: string) => {
  const accessToken = await getAccessToken(userId, 'github')

  const res = await fetch(`https://api.github.com/users/${username}/repos`, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  return await res.json()
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
