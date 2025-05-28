"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Briefcase, ChevronLeft, Globe, Pencil, Server, Trash, Calendar, Clock } from "lucide-react"

import { projects, getServersByProjectId, environments, getEnvironmentById } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { DetailSection } from "@/components/ui/detail-section"
import { PageHeader } from "@/components/ui/page-header"
import { StatusBadge } from "@/components/ui/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EditProjectModal } from "@/components/projects/edit-project-modal"
import { DeleteProjectModal } from "@/components/projects/delete-project-modal"

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const router = useRouter()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const project = projects.find((p) => p.id === params.projectId)

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-6">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <p className="text-muted-foreground mb-4">The project you are looking for does not exist.</p>
        <Button asChild>
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>
    )
  }

  const servers = getServersByProjectId(project.id)
  const projectEnvironments = environments.filter((env) => project.environmentIds.includes(env.id))

  const createdAt = new Date(project.createdAt).toLocaleString()
  const updatedAt = new Date(project.updatedAt).toLocaleString()

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/projects">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <PageHeader
          title={project.name}
          description={project.description}
          icon={<Briefcase className="h-6 w-6" />}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          }
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DetailSection title="Project Details" icon={<Briefcase className="h-4 w-4" />}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Created</div>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{createdAt}</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{updatedAt}</span>
                </div>
              </div>
            </div>
          </div>
        </DetailSection>

        <DetailSection title="Environments" icon={<Globe className="h-4 w-4" />}>
          <div className="flex flex-wrap gap-2">
            {projectEnvironments.map((env) => (
              <Badge key={env.id} variant="outline">
                <Link href={`/environments/${env.id}`} className="hover:underline">
                  {env.name}
                </Link>
              </Badge>
            ))}
            {projectEnvironments.length === 0 && (
              <div className="text-sm text-muted-foreground">No environments assigned</div>
            )}
          </div>
        </DetailSection>
      </div>

      <Tabs defaultValue="servers" className="w-full">
        <TabsList>
          <TabsTrigger value="servers" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>Servers ({servers.length})</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="servers" className="mt-4">
          {servers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Hostname</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servers.map((server) => {
                    const environment = getEnvironmentById(server.environmentId)
                    return (
                      <TableRow key={server.id}>
                        <TableCell className="font-medium">
                          <Link href={`/servers/${server.id}`} className="hover:underline">
                            {server.name}
                          </Link>
                        </TableCell>
                        <TableCell>{server.hostname}</TableCell>
                        <TableCell>{server.ipAddress}</TableCell>
                        <TableCell>
                          {environment ? (
                            <Link href={`/environments/${environment.id}`} className="hover:underline">
                              {environment.name}
                            </Link>
                          ) : (
                            "Unknown"
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={server.status} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
              <div className="text-center">
                <h3 className="text-lg font-medium">No servers found</h3>
                <p className="text-sm text-muted-foreground mt-1">This project doesn't have any servers yet.</p>
                <Button asChild className="mt-4">
                  <Link href="/servers">View All Servers</Link>
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <EditProjectModal project={project} open={isEditModalOpen} onOpenChange={setIsEditModalOpen} />

      <DeleteProjectModal project={project} open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} />
    </div>
  )
}
