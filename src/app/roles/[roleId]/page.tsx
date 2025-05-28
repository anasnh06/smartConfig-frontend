"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash, Server, Layers } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { DetailSection } from "@/components/ui/detail-section"
import { getRoleById, getServersByRoleId, getTemplatesByRoleId } from "@/lib/mock-data"
import { useStore } from "@/lib/store"
import { EditRoleModal } from "@/components/roles/edit-role-modal"
import { DeleteRoleModal } from "@/components/roles/delete-role-modal"
import { DataTable } from "@/components/ui/data-table"
import { columns as serverColumns } from "../../servers/columns"
import type { ColumnDef } from "@tanstack/react-table"
import type { Template } from "@/types/entities"

export default function RoleDetailPage() {
  const params = useParams()
  const roleId = params.roleId as string
  const role = getRoleById(roleId)
  const store = useStore()

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

  // Get associated servers and templates
  const servers = getServersByRoleId(roleId)
  const templates = getTemplatesByRoleId(roleId)

  // Define columns for the templates table
  const templateColumns: ColumnDef<Template>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <Link href={`/templates/${row.original.id}`} className="font-medium hover:underline">
            {row.getValue("name")}
          </Link>
        )
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string
        return <span className="line-clamp-1">{description}</span>
      },
    },
    {
      accessorKey: "configurationIds",
      header: "Configurations",
      cell: ({ row }) => {
        const configIds = row.getValue("configurationIds") as string[]
        return configIds.length
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/templates/${row.original.id}`}>View</Link>
          </Button>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/roles">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title={role.name} description={role.description} />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" className="gap-2" onClick={() => store.openEditRoleModal(role)}>
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button variant="outline" className="gap-2 text-destructive" onClick={() => store.openDeleteRoleModal(role)}>
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Role Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-sm">{role.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                <dd className="text-sm">{role.description}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="text-sm">{new Date(role.createdAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Updated</dt>
                <dd className="text-sm">{new Date(role.updatedAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

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
                <span className="text-2xl font-bold">{servers.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Templates</span>
                </div>
                <span className="text-2xl font-bold">{templates.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DetailSection title="Servers with this Role">
        {servers.length > 0 ? (
          <DataTable columns={serverColumns} data={servers} searchColumn="name" searchPlaceholder="Search servers..." />
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
        {templates.length > 0 ? (
          <DataTable
            columns={templateColumns}
            data={templates}
            searchColumn="name"
            searchPlaceholder="Search templates..."
          />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <Layers className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No templates are compatible with this role.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      <EditRoleModal />
      <DeleteRoleModal />
    </div>
  )
}
