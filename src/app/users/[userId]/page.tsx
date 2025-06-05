"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash, User as UserIcon, ChevronRight, Mail, CheckCircle2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { EditUserModal } from "@/components/users/edit-user-modal"
import { DeleteUserModal } from "@/components/users/delete-user-modal"
import { getUser } from "@/lib/api/user"
import { useStore } from "@/lib/store"
import type { User } from "@/types/entities"

// Loader amélioré
function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  )
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = Number(params.userId)
  const store = useStore()

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = async () => {
    setIsLoading(true)
    try {
      const data = await getUser(userId)
      setUser(data)
    } catch (error) {
      console.error("Failed to fetch user", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleted = () => {
    router.push("/users")
  }

  useEffect(() => {
    fetchUser()
  }, [userId])

  if (isLoading) return <Loader />

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Utilisateur introuvable</h1>
          <p className="mt-2 text-muted-foreground">L'utilisateur recherché n'existe pas.</p>
          <Button asChild className="mt-4">
            <Link href="/users">Retour à la liste</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100vh] bg-gradient-to-br from-muted/60 to-white flex flex-col items-center justify-center px-2 py-8">
      <div className="w-full max-w-2xl">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
          <Link href="/users" className="flex items-center hover:underline">
            <UserIcon className="w-4 h-4 mr-1" />
            Utilisateurs
          </Link>
          <ChevronRight className="mx-2 w-4 h-4" />
          <span className="font-medium text-primary">{user.username}</span>
        </nav>

        <Card className="shadow-2xl border-0 bg-white/95">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-full p-3">
                <UserIcon className="w-10 h-10 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{user.username}</span>
                  {user.is_active ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" aria-label="Actif" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" aria-label="Inactif" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => store.openEditUserModal(user)}
              >
                <Edit className="h-4 w-4" />
                Modifier
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => store.openDeleteUserModal(user)}
              >
                <Trash className="h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </CardHeader>
          <CardContent className="py-6">
            <dl className="grid grid-cols-1 gap-y-4">
              {/* Ligne 1 : Nom d'utilisateur et Email */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col">
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Nom d'utilisateur</dt>
                  <dd className="text-base font-medium">{user.username}</dd>
                </div>
                <div className="flex-1 flex flex-col">
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Email</dt>
                  <dd className="text-base flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </dd>
                </div>
              </div>
              {/* Ligne 2 : Créé le et Créé par */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col">
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Créé le</dt>
                  <dd className="text-base">{user.created_at ? new Date(user.created_at).toLocaleString() : "—"}</dd>
                </div>
                <div className="flex-1 flex flex-col">
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Créé par</dt>
                  <dd className="text-base">
                    {user.creator && "id" in user.creator ? (
                      <Link
                        href={`/users/${user.creator.id}`}
                        className="text-primary underline hover:text-primary/80"
                      >
                        {user.creator.username}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
              </div>
              {/* Ligne 3 : Modifié le et Modifié par */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col">
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Modifié le</dt>
                  <dd className="text-base">{user.updated_at ? new Date(user.updated_at).toLocaleString() : "—"}</dd>
                </div>
                <div className="flex-1 flex flex-col">
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Modifié par</dt>
                  <dd className="text-base">
                    {user.updater && "id" in user.updater ? (
                      <Link
                        href={`/users/${user.updater.id}`}
                        className="text-primary underline hover:text-primary/80"
                      >
                        {user.updater.username}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
              </div>
              {/* Ligne 4 : Actif */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col">
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Actif</dt>
                  <dd className="text-base">
                    {user.is_active ? (
                      <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                        <CheckCircle2 className="w-4 h-4" /> Oui
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-destructive font-semibold">
                        <XCircle className="w-4 h-4" /> Non
                      </span>
                    )}
                  </dd>
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button variant="ghost" asChild>
            <Link href="/users">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour à la liste
            </Link>
          </Button>
        </div>

        <EditUserModal onUpdated={fetchUser} />
        <DeleteUserModal onDeleted={handleDeleted} />
      </div>
    </div>
  )
}
