'use client'
import AuthGuard from '@/lib/auth/AuthGuard'

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>
}