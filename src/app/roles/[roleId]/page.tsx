"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash, Server, Layers } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { DetailSection } from "@/components/ui/detail-section"
import { DataTable } from "@/components/ui/data-table"
import { useStore } from "@/lib/store"
import { getRole } from "@/lib/api/role"
import { EditRoleModal } from "@/components/roles/edit-role-modal"
import { DeleteRoleModal } from "@/components/roles/delete-role-modal"
import type { Role, ServerShort, TemplateShort } from "@/types/entities"

export default function RoleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const roleId = Number(params.roleId)
  const store = useStore()

  const [role, setRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchRole = async () => {
    setIsLoading(true)
    try {
      const data = await getRole(roleId)
      setRole(data)
    } catch (error) {
      console.error("Failed to fetch role", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleted = () => {
    router.push("/roles")
  }

  useEffect(() => {
    fetchRole()
  }, [roleId])

  // ... Columns identiques
  const serverColumns: ColumnDef<ServerShort>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "ip_address",
      header: "IP Address",
      cell: ({ row }) => row.getValue("ip_address"),
    },
  ]

  const templateColumns: ColumnDef<TemplateShort>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Link href={`/templates/${row.original.id}`} className="font-medium hover:underline">
          {row.getValue("name")}
        </Link>
      ),
    },
  ]

  if (isLoading) return <p className="text-center">Loading...</p>

  if (!role) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Role not found</h1>
          <p className="mt-2 text-muted-foreground">The role you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/roles">Back to Roles</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/roles">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title={role.name} description={role.description || ""} />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => store.openEditRoleModal(role)}>
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          className="text-destructive"
          onClick={() => store.openDeleteRoleModal(role)}
        >
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* Informations du rôle */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Role Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-sm">{role.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                <dd className="text-sm">{role.description || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
                <dd className="text-sm">{role.created_at ? new Date(role.created_at).toLocaleString() : "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created By</dt>
                <dd className="text-sm">{role.created_by_user?.username || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Updated At</dt>
                <dd className="text-sm">{role.updated_at ? new Date(role.updated_at).toLocaleString() : "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Updated By</dt>
                <dd className="text-sm">{role.updated_by_user?.username || "—"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Servers</span>
                </div>
                <span className="text-2xl font-bold">{role.servers?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Templates</span>
                </div>
                <span className="text-2xl font-bold">{role.templates?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sections */}
      <DetailSection title="Servers with this Role">
        {role.servers?.length ? (
          <DataTable columns={serverColumns} data={role.servers} searchColumn="name" searchPlaceholder="Search servers..." />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <Server className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No servers are using this role.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      <DetailSection title="Compatible Templates">
        {role.templates?.length ? (
          <DataTable columns={templateColumns} data={role.templates} searchColumn="name" searchPlaceholder="Search templates..." />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <Layers className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No templates are compatible with this role.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      {/* ✅ Modales avec actions */}
      <EditRoleModal onUpdated={fetchRole} />
      <DeleteRoleModal onDeleted={handleDeleted} />
    </div>
  )
}
