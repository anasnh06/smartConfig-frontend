"use client"

import { useState } from "react"
import Link from "next/link"
import { Briefcase, MoreVertical, Server, Globe, Pencil, Trash } from "lucide-react"

import type { Project } from "@/types/entities"
import { environments, getServersByProjectId } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { EditProjectModal } from "./edit-project-modal"
import { DeleteProjectModal } from "./delete-project-modal"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const servers = getServersByProjectId(project.id)
  const projectEnvironments = environments.filter((env) => project.environmentIds.includes(env.id))

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-primary/10 p-2">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{project.name}</CardTitle>
                <CardDescription className="text-xs">
                  {new Date(project.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Server className="h-3 w-3" />
              <span>{servers.length} Servers</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />
              <span>{projectEnvironments.length} Environments</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {projectEnvironments.slice(0, 3).map((env) => (
              <Badge key={env.id} variant="outline" className="text-xs">
                {env.name}
              </Badge>
            ))}
            {projectEnvironments.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{projectEnvironments.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-1">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href={`/projects/${project.id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>

      <EditProjectModal project={project} open={isEditModalOpen} onOpenChange={setIsEditModalOpen} />

      <DeleteProjectModal project={project} open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} />
    </>
  )
}
