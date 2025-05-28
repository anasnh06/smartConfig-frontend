'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: 'Déconnexion réussie',
        description: 'Vous avez été déconnecté.',
        variant: 'default',
      })
      router.push('/login')
    } catch (error: any) {
      toast({
        title: 'Erreur de déconnexion',
        description: error?.message || 'Une erreur est survenue.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex items-center gap-4">
      <span className="font-medium">{user?.username}</span>
      <Button onClick={handleLogout} variant="outline">
        Se déconnecter
      </Button>
    </div>
  )
}
