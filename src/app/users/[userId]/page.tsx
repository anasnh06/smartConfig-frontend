"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { DetailSection } from "@/components/ui/detail-section"
import { getUserById, getServersByUserId } from "@/lib/mock-data"
import { useStore } from "@/lib/store"
import { EditUserModal } from "@/components/users/edit-user-modal"
import { DeleteUserModal } from "@/components/users/delete-user-modal"
import { DataTable } from "@/components/ui/data-table"
import { columns as serverColumns } from "../../servers/columns"

export default function UserDetailPage() {
  const params = useParams()
  const userId = params.userId as string
  const user = getUserById(userId)
  const servers = getServersByUserId(userId)
  const store = useStore()

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
        <PageHeader title={user.name} description={`User details for ${user.email}`} />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" className="gap-2" onClick={() => store.openEditUserModal(user)}>
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button variant="outline" className="gap-2 text-destructive" onClick={() => store.openDeleteUserModal(user)}>
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
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-sm">{user.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-sm">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Role</dt>
                <dd className="text-sm">{user.role}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <DetailSection title="Associated Servers">
        {servers.length > 0 ? (
          <DataTable columns={serverColumns} data={servers} />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground">No servers associated with this user.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      <EditUserModal />
      <DeleteUserModal />
    </div>
  )
}
