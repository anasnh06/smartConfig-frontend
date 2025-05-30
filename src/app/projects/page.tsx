"use client"

import { useEffect } from "react"
import { Briefcase, Plus } from "lucide-react"

import { useStore } from "@/lib/store"
import { useProjectsStore } from "@/lib/store/projects"
import { PageHeader } from "@/components/ui/page-header"
import { CardGrid } from "@/components/ui/card-grid"
import { ProjectCard } from "@/components/projects/project-card"
import { CreateProjectModal } from "@/components/projects/create-project-modal"
import { EditProjectModal } from "@/components/projects/edit-project-modal"
import { DeleteProjectModal } from "@/components/projects/delete-project-modal"

export default function ProjectsPage() {
  const store = useStore()
  const projects = useProjectsStore((state) => state.projects)
  const fetchProjects = useProjectsStore((state) => state.fetchProjects)
  const loading = useProjectsStore((state) => state.loading)

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Projects"
        description="Manage your infrastructure projects"
        icon={<Briefcase className="h-6 w-6" />}
        action={{
          label: "Add Project",
          onClick: store.openCreateProjectModal,
        }}
      />

      {loading ? (
        <p className="text-muted-foreground text-center">Loading projects...</p>
      ) : (
        <CardGrid>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </CardGrid>
      )}

      <CreateProjectModal />
      <EditProjectModal />
      <DeleteProjectModal />
    </div>
  )
}
