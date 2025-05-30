"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash, Server } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { DetailSection } from "@/components/ui/detail-section"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { getProject } from "@/lib/api/project"
import type { Project, ServerShort } from "@/types/entities"
import { EditProjectModal } from "@/components/projects/edit-project-modal"
import { DeleteProjectModal } from "@/components/projects/delete-project-modal"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = Number(params.projectId)
  const store = useStore()

  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProject = async () => {
    setIsLoading(true)
    try {
      const data = await getProject(projectId)
      setProject(data)
    } catch (error) {
      console.error("Failed to fetch project", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleted = () => {
    router.push("/projects")
  }

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const serverColumns: ColumnDef<ServerShort>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Link href={`/servers/${row.original.id}`} className="font-medium hover:underline">
          {row.getValue("name")}
        </Link>
      ),
    },
    {
      accessorKey: "ip_address",
      header: "IP Address",
      cell: ({ row }) => row.getValue("ip_address"),
    },
  ]

  if (isLoading) return <p className="text-center">Loading...</p>

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Project not found</h1>
          <p className="mt-2 text-muted-foreground">The project you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title={project.name} description={project.description || ""} />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => store.openEditProjectModal(project)}>
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          className="text-destructive"
          onClick={() => store.openDeleteProjectModal(project)}
        >
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <DetailSection title="Project Metadata">
        <dl className="grid gap-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
            <dd className="text-sm">{project.created_at ? new Date(project.created_at).toLocaleString() : "—"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Created By</dt>
            <dd className="text-sm">{project.created_by_user?.username || "—"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Updated At</dt>
            <dd className="text-sm">{project.updated_at ? new Date(project.updated_at).toLocaleString() : "—"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Updated By</dt>
            <dd className="text-sm">{project.updated_by_user?.username || "—"}</dd>
          </div>
        </dl>
      </DetailSection>

      <DetailSection title="Servers in this Project">
        {project.servers?.length ? (
          <DataTable
            columns={serverColumns}
            data={project.servers}
            searchColumn="name"
            searchPlaceholder="Search servers..."
          />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <Server className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No servers are assigned to this project.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      <EditProjectModal onUpdated={fetchProject} />
      <DeleteProjectModal onDeleted={handleDeleted} />
    </div>
  )
}
