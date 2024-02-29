import { useContext } from 'react'
import { AuthContext } from '~/components/providers'

export const useAuth = () => {
  return useContext(AuthContext)
}
