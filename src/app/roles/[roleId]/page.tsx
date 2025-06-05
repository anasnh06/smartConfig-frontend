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

  // Table columns for servers
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

  // Table columns for templates (name + OS)
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
    {
      id: "operating_systems",
      header: "Operating Systems",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.operating_systems?.length > 0 ? (
            row.original.operating_systems.map((os) => (
              <span
                key={os.id}
                className="inline-block bg-gray-100 rounded px-2 py-0.5 text-xs text-gray-800"
              >
                {os.name} {os.version}
              </span>
            ))
          ) : (
            <span className="text-gray-400 italic">—</span>
          )}
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="text-muted-foreground text-lg">Loading...</span>
      </div>
    )
  }

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
    <div className="w-full py-8 px-2 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="border border-gray-200 bg-white hover:bg-gray-100">
            <Link href="/roles">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <PageHeader
            title={role.name}
            description={role.description || ""}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" className="gap-2" onClick={() => store.openEditRoleModal(role)}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => store.openDeleteRoleModal(role)}
          >
            <Trash className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow border border-gray-100 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900 text-lg">Role Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-y-3">
              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase">Name</dt>
                <dd className="text-sm text-gray-900">{role.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase">Description</dt>
                <dd className="text-sm text-gray-900">{role.description || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase">Created At</dt>
                <dd className="text-sm text-gray-900">{role.created_at ? new Date(role.created_at).toLocaleString() : "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase">Created By</dt>
                <dd className="text-sm text-gray-900">{role.created_by_user?.username || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase">Updated At</dt>
                <dd className="text-sm text-gray-900">{role.updated_at ? new Date(role.updated_at).toLocaleString() : "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase">Updated By</dt>
                <dd className="text-sm text-gray-900">{role.updated_by_user?.username || "—"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card className="shadow border border-gray-100 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900 text-lg">Usage Statistics</CardTitle>
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

      {/* Servers Section */}
      <DetailSection title="Servers with this Role">
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-2">
          {role.servers?.length ? (
            <DataTable columns={serverColumns} data={role.servers} searchColumn="name" searchPlaceholder="Search servers..." />
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Server className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-2 text-gray-400">No servers are using this role.</p>
            </div>
          )}
        </div>
      </DetailSection>

      {/* Templates Section */}
      <DetailSection title="Compatible Templates">
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-2">
          {role.templates?.length ? (
            <DataTable columns={templateColumns} data={role.templates} searchColumn="name" searchPlaceholder="Search templates..." />
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Layers className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-2 text-gray-400">No templates are compatible with this role.</p>
            </div>
          )}
        </div>
      </DetailSection>

      {/* Modals */}
      <EditRoleModal onUpdated={fetchRole} />
      <DeleteRoleModal onDeleted={handleDeleted} />
    </div>
  )
}
