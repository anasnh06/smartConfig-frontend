"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash, Play, FileCode } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { DetailSection } from "@/components/ui/detail-section"
import {
  getConfigurationById,
  getOperatingSystemById,
  getExecutionsByConfigurationId,
  getServerConfigurationsByServerId,
  servers,
} from "@/lib/mock-data"
import { useStore } from "@/lib/store"
import { EditConfigurationModal } from "@/components/configurations/edit-configuration-modal"
import { DeleteConfigurationModal } from "@/components/configurations/delete-configuration-modal"
import { RunConfigurationModal } from "@/components/configurations/run-configuration-modal"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import type { Execution } from "@/types/entities"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"

export default function ConfigurationDetailPage() {
  const params = useParams()
  const configId = params.configId as string
  const configuration = getConfigurationById(configId)
  const store = useStore()

  if (!configuration) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Configuration not found</h1>
          <p className="mt-2 text-muted-foreground">The configuration you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/configurations">Back to Configurations</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Get compatible operating systems
  const compatibleOs = configuration.compatibleOsIds.map((id) => getOperatingSystemById(id)).filter(Boolean)

  // Get executions for this configuration
  const executions = getExecutionsByConfigurationId(configId)

  // Find servers where this configuration has been used
  const usedOnServers = servers.filter((server) => {
    const serverConfigs = getServerConfigurationsByServerId(server.id)
    return serverConfigs.some((sc) => sc.configurationId === configId)
  })

  // Define columns for the executions table
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

  // Define columns for the servers table
  const serverColumns: ColumnDef<(typeof servers)[0]>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <Link href={`/servers/${row.original.id}`} className="font-medium hover:underline">
            {row.getValue("name")}
          </Link>
        )
      },
    },
    {
      accessorKey: "hostname",
      header: "Hostname",
    },
    {
      accessorKey: "ipAddress",
      header: "IP Address",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as "online" | "offline" | "maintenance"
        return <StatusBadge status={status} />
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/configurations">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title={configuration.name} description={configuration.description} />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" className="gap-2" onClick={() => store.openEditConfigurationModal(configuration)}>
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          className="gap-2 text-destructive"
          onClick={() => store.openDeleteConfigurationModal(configuration)}
        >
          <Trash className="h-4 w-4" />
          Delete
        </Button>
        <Button className="gap-2 ml-auto" onClick={() => store.openRunConfigurationModal(configuration)}>
          <Play className="h-4 w-4" />
          Run Configuration
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuration Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-sm">{configuration.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                <dd className="text-sm">{configuration.description}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="text-sm">{new Date(configuration.createdAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Updated</dt>
                <dd className="text-sm">{new Date(configuration.updatedAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compatible Operating Systems</CardTitle>
          </CardHeader>
          <CardContent>
            {compatibleOs.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {compatibleOs.map((os) => (
                  <Badge key={os?.id} variant="outline" className="text-sm">
                    <Link href={`/operating-systems/${os?.id}`} className="hover:underline">
                      {os?.name} {os?.version}
                    </Link>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No compatible operating systems defined.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <DetailSection title="Used on Servers">
        {usedOnServers.length > 0 ? (
          <DataTable columns={serverColumns} data={usedOnServers} />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <FileCode className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">This configuration has not been used on any servers yet.</p>
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
              <FileCode className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No execution history available.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      <EditConfigurationModal />
      <DeleteConfigurationModal />
      <RunConfigurationModal />
    </div>
  )
}
