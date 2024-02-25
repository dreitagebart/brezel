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
