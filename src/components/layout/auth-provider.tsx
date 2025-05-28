'use client'

import { useState, useEffect } from 'react'
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '@/lib/api/auth'
import { AuthContext } from '@/lib/auth/useAuth'
import type { User } from '@/types/entities/user'

// type User = {
//   id: number
//   username: string
//   email?: string
// }

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    setLoading(true)
    try {
      const data = await getCurrentUser()
      setUser(data)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: { username: string; password: string }) => {
    await apiLogin(credentials)
    await checkAuth()
  }

  const logout = async () => {
    await apiLogout()
    setUser(null)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
