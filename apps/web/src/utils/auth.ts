import axios from 'axios'
import Github from 'next-auth/providers/github'
import Gitlab from 'next-auth/providers/gitlab'
import { OAuth2Config } from '@auth/core/providers'
import NextAuth, { NextAuthResult } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { client } from '@brezel/database'
import { Profile } from '@auth/core/types'
import { BitbucketEmailsResponse, BitbucketProfile } from './types'

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
    jwt: async ({ token, account }) => {
      // console.log('jwt callback!')
      // console.log('token:', JSON.stringify(token, null, 2))
      // console.log('account:', JSON.stringify(account, null, 2))

      return token
    },
    session: async ({ session, token, user }) => {
      // console.log('session callback!')
      // console.log('session:', JSON.stringify(session, null, 2))
      // console.log('token:', JSON.stringify(token, null, 2))
      // console.log('user:', JSON.stringify(user, null, 2))

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
    {
      allowDangerousEmailAccountLinking: true,
      id: 'bitbucket',
      name: 'Bitbucket',
      type: 'oauth',
      userinfo: 'https://api.bitbucket.org/2.0/user',
      clientId: process.env.BITBUCKET_ID,
      clientSecret: process.env.BITBUCKET_SECRET,
      authorization: {
        url: 'https://bitbucket.org/site/oauth2/authorize',
        params: {
          scope: 'email account repository',
          response_type: 'code'
        }
      },
      token: 'https://bitbucket.org/site/oauth2/access_token',
      profile: async (profile, tokens) => {
        const email = await fetch('https://api.bitbucket.org/2.0/user/emails', {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            Accept: 'application/json'
          }
        })
          .then((res) => res.json())
          .then((r) => {
            return (
              r.values.find((value: any) => value.is_primary) || r.values[0]
            ).email
          })

        return {
          ...profile,
          id: profile.account_id,
          email,
          image: profile.links.avatar.href,
          name: profile.display_name
        }
      }
    },
    Github({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    Gitlab({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.GITLAB_ID,
      clientSecret: process.env.GITLAB_SECRET,
      authorization:
        'https://gitlab.com/oauth/authorize?scope=read_user%20read_api'
    })
  ]
})
