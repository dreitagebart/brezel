import { PrismaClient } from '@prisma/client'
export type { Prisma, Repository } from '@prisma/client'

export const client = new PrismaClient()
