'use client'

import { FC, PropsWithChildren, createContext } from 'react'
import { AuthUser } from '~/utils/types'

interface Props {
  user: AuthUser
}

const initialUser: AuthUser = {
  id: '',
  email: '',
  name: '',
  image: ''
}

export const AuthContext = createContext<{
  user: AuthUser
}>({
  user: initialUser
})

export const AuthProvider: FC<PropsWithChildren<Props>> = ({
  user,
  children
}) => {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  )
}
