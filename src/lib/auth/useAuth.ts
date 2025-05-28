'use client'

import { createContext, useContext } from 'react'
import type { User } from '@/types/entities/user'

// type User = {
//   id: number
//   username: string
//   email?: string
// }

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (credentials: { username: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
