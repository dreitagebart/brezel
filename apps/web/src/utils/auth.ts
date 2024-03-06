import Github from 'next-auth/providers/github'
import NextAuth, { NextAuthResult } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { client } from '@brezel/database'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      name: string
      email: string
      emailVerified?: null | boolean
      image: string
      provider: string
      providerAccountId: string
    }
  }
}

//@ts-ignore
export const { handlers, auth, signIn, signOut }: NextAuthResult = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(client),
  pages: {
    signIn: '/login',
    newUser: '/signup',
    error: '/auth-error'
  },
  callbacks: {
    session: async ({ session, token, user }) => {
      // console.log('session callback!')
      // console.log('session - session:', JSON.stringify(session, null, 2))
      // console.log('session - token:', JSON.stringify(token, null, 2))
      // console.log('session - user:', JSON.stringify(user, null, 2))

      const account = await client.account.findFirstOrThrow({
        where: {
          userId: user.id
        }
      })

      // console.log('accountInfo:', JSON.stringify(account, null, 2))

      session.user.provider = account.provider
      session.user.providerAccountId = account.providerAccountId

      return session
    }
  },
  // debug: true,
  events: {
    session: (message) => {
      // console.log('session message:', message)
    }
  },
  providers: [
    Github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ]
})
