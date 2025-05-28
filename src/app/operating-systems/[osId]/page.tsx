"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash, Server, FileCode, Layers } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { DetailSection } from "@/components/ui/detail-section"
import {
  getOperatingSystemById,
  getServersByOperatingSystemId,
  getConfigurationsByOperatingSystemId,
  getTemplatesByOperatingSystemId,
} from "@/lib/mock-data"
import { useStore } from "@/lib/store"
import { EditOsModal } from "@/components/operating-systems/edit-os-modal"
import { DeleteOsModal } from "@/components/operating-systems/delete-os-modal"
import { DataTable } from "@/components/ui/data-table"
import { columns as serverColumns } from "../../servers/columns"
import type { ColumnDef } from "@tanstack/react-table"
import type { Configuration, Template } from "@/types/entities"
import { Badge } from "@/components/ui/badge"

export default function OperatingSystemDetailPage() {
  const params = useParams()
  const osId = params.osId as string
  const os = getOperatingSystemById(osId)
  const store = useStore()

  if (!os) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Operating System not found</h1>
          <p className="mt-2 text-muted-foreground">The operating system you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/operating-systems">Back to Operating Systems</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Get associated resources
  const servers = getServersByOperatingSystemId(osId)
  const configurations = getConfigurationsByOperatingSystemId(osId)
  const templates = getTemplatesByOperatingSystemId(osId)

  // Define columns for the configurations table
  const configurationColumns: ColumnDef<Configuration>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <Link href={`/configurations/${row.original.id}`} className="font-medium hover:underline">
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
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/configurations/${row.original.id}`}>View</Link>
          </Button>
        )
      },
    },
  ]

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
          <Link href="/operating-systems">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title={`${os.name} ${os.version}`}
          description={`Operating system details for ${os.architecture}`}
        />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" className="gap-2" onClick={() => store.openEditOsModal(os)}>
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button variant="outline" className="gap-2 text-destructive" onClick={() => store.openDeleteOsModal(os)}>
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Operating System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-sm">{os.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Version</dt>
                <dd className="text-sm">{os.version}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Architecture</dt>
                <dd className="text-sm">
                  <Badge variant="outline">{os.architecture}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="text-sm">{new Date(os.createdAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Updated</dt>
                <dd className="text-sm">{new Date(os.updatedAt).toLocaleDateString()}</dd>
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
                  <FileCode className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Configurations</span>
                </div>
                <span className="text-2xl font-bold">{configurations.length}</span>
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

      <DetailSection title="Servers with this Operating System">
        {servers.length > 0 ? (
          <DataTable columns={serverColumns} data={servers} searchColumn="name" searchPlaceholder="Search servers..." />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <Server className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No servers are using this operating system.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      <DetailSection title="Compatible Configurations">
        {configurations.length > 0 ? (
          <DataTable
            columns={configurationColumns}
            data={configurations}
            searchColumn="name"
            searchPlaceholder="Search configurations..."
          />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <FileCode className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No configurations are compatible with this operating system.</p>
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
              <p className="mt-2 text-muted-foreground">No templates are compatible with this operating system.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      <EditOsModal />
      <DeleteOsModal />
    </div>
  )
}
