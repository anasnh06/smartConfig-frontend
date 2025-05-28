'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username || !password) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir tous les champs.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      await login({ username, password })
      toast({
        title: 'Connexion réussie',
        description: `Bienvenue, ${username}!`,
      })
      setTimeout(() => router.push('/'), 1000) // ⏳ Donne le temps d'afficher le toast
    } catch (err: any) {
      toast({
        title: 'Échec de connexion',
        description: err.message || 'Identifiants invalides.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTestToast = () => {
    toast({
      title: 'Toast de test',
      description: 'Le système de toast fonctionne ! ✅',
    })
  }

  return (
    <div className="w-full max-w-md p-8 border border-border rounded-xl shadow-lg bg-background space-y-6">
      <h1 className="text-2xl font-bold text-center">Connexion à SmartConfig</h1>

      <div className="space-y-2">
        <Label htmlFor="username">Nom d'utilisateur</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Votre identifiant"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={loading}
        />
      </div>

      <Button className="w-full" onClick={handleLogin} disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </Button>

      {/* <Button variant="outline" className="w-full" onClick={handleTestToast}>
        Tester Toast
      </Button> */}
    </div>
  )
}
