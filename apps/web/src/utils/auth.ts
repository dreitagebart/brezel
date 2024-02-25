import Github from 'next-auth/providers/github'
import NextAuth, { NextAuthResult } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { client } from '@brezel/database'

//@ts-ignore
export const { handlers, auth, signIn, signOut }: NextAuthResult = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(client),
  providers: [
    Github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ]
})
