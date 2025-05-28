"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash, ServerIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { DetailSection } from "@/components/ui/detail-section"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  getServerById,
  getOperatingSystemById,
  getRoleById,
  getEnvironmentById,
  getProjectById,
  getServerConfigurationsByServerId,
  getServerTemplatesByServerId,
  getExecutionsByServerId,
  getConfigurationById,
  getTemplateById,
} from "@/lib/mock-data"
import { useStore } from "@/lib/store"
import { EditServerModal } from "@/components/servers/edit-server-modal"
import { DeleteServerModal } from "@/components/servers/delete-server-modal"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import type { ServerConfiguration, ServerTemplate, Execution } from "@/types/entities"

export default function ServerDetailPage() {
  const params = useParams()
  const serverId = params.serverId as string
  const server = getServerById(serverId)
  const store = useStore()

  if (!server) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Server not found</h1>
          <p className="mt-2 text-muted-foreground">The server you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/servers">Back to Servers</Link>
          </Button>
        </div>
      </div>
    )
  }

  const os = getOperatingSystemById(server.operatingSystemId)
  const roles = server.roleIds.map((id) => getRoleById(id)).filter(Boolean)
  const environment = getEnvironmentById(server.environmentId)
  const project = getProjectById(server.projectId)

  // Get related data
  const serverConfigurations = getServerConfigurationsByServerId(serverId)
  const serverTemplates = getServerTemplatesByServerId(serverId)
  const executions = getExecutionsByServerId(serverId)

  // Define columns for the tables
  const configurationColumns: ColumnDef<ServerConfiguration>[] = [
    {
      accessorKey: "configurationId",
      header: "Configuration",
      cell: ({ row }) => {
        const configId = row.getValue("configurationId") as string
        const config = getConfigurationById(configId)
        return config ? (
          <Link href={`/configurations/${configId}`} className="font-medium hover:underline">
            {config.name}
          </Link>
        ) : (
          "Unknown"
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as "pending" | "completed" | "failed"
        return <StatusBadge status={status} />
      },
    },
    {
      accessorKey: "executedAt",
      header: "Executed At",
      cell: ({ row }) => {
        return new Date(row.getValue("executedAt") as string).toLocaleString()
      },
    },
  ]

  const templateColumns: ColumnDef<ServerTemplate>[] = [
    {
      accessorKey: "templateId",
      header: "Template",
      cell: ({ row }) => {
        const templateId = row.getValue("templateId") as string
        const template = getTemplateById(templateId)
        return template ? (
          <Link href={`/templates/${templateId}`} className="font-medium hover:underline">
            {template.name}
          </Link>
        ) : (
          "Unknown"
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as "pending" | "completed" | "failed"
        return <StatusBadge status={status} />
      },
    },
    {
      accessorKey: "executedAt",
      header: "Executed At",
      cell: ({ row }) => {
        return new Date(row.getValue("executedAt") as string).toLocaleString()
      },
    },
  ]

  const executionColumns: ColumnDef<Execution>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <Link href={`/executions/${row.original.id}`} className="font-medium hover:underline">
            {row.getValue("name")}
          </Link>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as "pending" | "running" | "completed" | "failed"
        return <StatusBadge status={status} />
      },
    },
    {
      accessorKey: "startedAt",
      header: "Started At",
      cell: ({ row }) => {
        return new Date(row.getValue("startedAt") as string).toLocaleString()
      },
    },
    {
      accessorKey: "completedAt",
      header: "Completed At",
      cell: ({ row }) => {
        const completedAt = row.getValue("completedAt") as string | undefined
        return completedAt ? new Date(completedAt).toLocaleString() : "N/A"
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/servers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title={server.name} description={`Server details for ${server.hostname}`} />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" className="gap-2" onClick={() => store.openEditServerModal(server)}>
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          className="gap-2 text-destructive"
          onClick={() => store.openDeleteServerModal(server)}
        >
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Server Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-sm">{server.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Hostname</dt>
                <dd className="text-sm">{server.hostname}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">IP Address</dt>
                <dd className="text-sm">{server.ipAddress}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="text-sm">
                  <StatusBadge status={server.status} />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="text-sm">{new Date(server.createdAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Updated</dt>
                <dd className="text-sm">{new Date(server.updatedAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Associated Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Operating System</dt>
                <dd className="text-sm">
                  {os ? (
                    <Link href={`/operating-systems/${os.id}`} className="hover:underline">
                      {os.name} {os.version}
                    </Link>
                  ) : (
                    "Unknown"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Environment</dt>
                <dd className="text-sm">
                  {environment ? (
                    <Link href={`/environments/${environment.id}`} className="hover:underline">
                      {environment.name}
                    </Link>
                  ) : (
                    "Unknown"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Project</dt>
                <dd className="text-sm">
                  {project ? (
                    <Link href={`/projects/${project.id}`} className="hover:underline">
                      {project.name}
                    </Link>
                  ) : (
                    "Unknown"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Roles</dt>
                <dd className="text-sm">
                  {roles.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {roles.map((role) => (
                        <Link key={role?.id} href={`/roles/${role?.id}`} className="hover:underline">
                          {role?.name}
                          {roles.indexOf(role as any) < roles.length - 1 ? ", " : ""}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    "None"
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <DetailSection title="Configuration History">
        {serverConfigurations.length > 0 ? (
          <DataTable columns={configurationColumns} data={serverConfigurations} />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <ServerIcon className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No configuration history available.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      <DetailSection title="Template History">
        {serverTemplates.length > 0 ? (
          <DataTable columns={templateColumns} data={serverTemplates} />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <ServerIcon className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No template history available.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      <DetailSection title="Execution History">
        {executions.length > 0 ? (
          <DataTable columns={executionColumns} data={executions} />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <ServerIcon className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No execution history available.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      <EditServerModal />
      <DeleteServerModal />
    </div>
  )
}
