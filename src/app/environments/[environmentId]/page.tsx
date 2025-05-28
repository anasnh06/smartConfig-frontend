"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash, Server, Briefcase } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { DetailSection } from "@/components/ui/detail-section"
import { getEnvironmentById, getServersByEnvironmentId, projects } from "@/lib/mock-data"
import { useStore } from "@/lib/store"
import { EditEnvironmentModal } from "@/components/environments/edit-environment-modal"
import { DeleteEnvironmentModal } from "@/components/environments/delete-environment-modal"
import { DataTable } from "@/components/ui/data-table"
import { columns as serverColumns } from "../../servers/columns"
import type { ColumnDef } from "@tanstack/react-table"
import type { Project } from "@/types/entities"

export default function EnvironmentDetailPage() {
  const params = useParams()
  const environmentId = params.environmentId as string
  const environment = getEnvironmentById(environmentId)
  const store = useStore()

  if (!environment) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Environment not found</h1>
          <p className="mt-2 text-muted-foreground">The environment you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/environments">Back to Environments</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Get associated servers
  const servers = getServersByEnvironmentId(environmentId)

  // Get associated projects
  const associatedProjects = projects.filter((project) => project.environmentIds.includes(environmentId))

  // Define columns for the projects table
  const projectColumns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <Link href={`/projects/${row.original.id}`} className="font-medium hover:underline">
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
      accessorKey: "environmentIds",
      header: "Environments",
      cell: ({ row }) => {
        const envIds = row.getValue("environmentIds") as string[]
        return envIds.length
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/projects/${row.original.id}`}>View</Link>
          </Button>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/environments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title={environment.name} description={environment.description} />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" className="gap-2" onClick={() => store.openEditEnvironmentModal(environment)}>
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          className="gap-2 text-destructive"
          onClick={() => store.openDeleteEnvironmentModal(environment)}
        >
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Environment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-sm">{environment.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                <dd className="text-sm">{environment.description}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="text-sm">{new Date(environment.createdAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Updated</dt>
                <dd className="text-sm">{new Date(environment.updatedAt).toLocaleDateString()}</dd>
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
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Projects</span>
                </div>
                <span className="text-2xl font-bold">{associatedProjects.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DetailSection title="Servers in this Environment">
        {servers.length > 0 ? (
          <DataTable columns={serverColumns} data={servers} searchColumn="name" searchPlaceholder="Search servers..." />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <Server className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No servers are using this environment.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      <DetailSection title="Projects using this Environment">
        {associatedProjects.length > 0 ? (
          <DataTable
            columns={projectColumns}
            data={associatedProjects}
            searchColumn="name"
            searchPlaceholder="Search projects..."
          />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <Briefcase className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No projects are using this environment.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      <EditEnvironmentModal />
      <DeleteEnvironmentModal />
    </div>
  )
}
