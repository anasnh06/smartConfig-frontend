"use client"

import { useState } from "react"
import { Briefcase, Plus } from "lucide-react"

import { projects } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { CardGrid } from "@/components/ui/card-grid"
import { PageHeader } from "@/components/ui/page-header"
import { ProjectCard } from "@/components/projects/project-card"
import { CreateProjectModal } from "@/components/projects/create-project-modal"

export default function ProjectsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Projects"
        description="Manage your infrastructure projects"
        icon={<Briefcase className="h-6 w-6" />}
        actions={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        }
      />

      <CardGrid>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </CardGrid>

      <CreateProjectModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  )
}
