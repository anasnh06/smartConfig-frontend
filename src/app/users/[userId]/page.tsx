"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { DetailSection } from "@/components/ui/detail-section"
import { EditUserModal } from "@/components/users/edit-user-modal"
import { DeleteUserModal } from "@/components/users/delete-user-modal"
import { getUser } from "@/lib/api/user"
import { useStore } from "@/lib/store"
import type { User } from "@/types/entities"

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

  if (isLoading) return <p className="text-center">Loading...</p>

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">User not found</h1>
          <p className="mt-2 text-muted-foreground">The user you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/users">Back to Users</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title={user.username} description={`User details for ${user.email}`} />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" className="gap-2" onClick={() => store.openEditUserModal(user)}>
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          className="gap-2 text-destructive"
          onClick={() => store.openDeleteUserModal(user)}
        >
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Username</dt>
                <dd className="text-sm">{user.username}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-sm">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Active</dt>
                <dd className="text-sm">{user.is_active ? "Yes" : "No"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
                <dd className="text-sm">
                  {user.created_at ? new Date(user.created_at).toLocaleString() : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Updated At</dt>
                <dd className="text-sm">
                  {user.updated_at ? new Date(user.updated_at).toLocaleString() : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created By</dt>
                <dd className="text-sm">{user.creator?.username || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Updated By</dt>
                <dd className="text-sm">{user.updater?.username || "—"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <EditUserModal onUpdated={fetchUser} />
      <DeleteUserModal onDeleted={handleDeleted} />
    </div>
  )
}
