"use client"

import { useEffect, useState } from "react"
import { Briefcase, Plus } from "lucide-react"
import { HiOutlineSearch } from "react-icons/hi"

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
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // Filtrage par recherche
  const filteredProjects = projects.filter((project) => {
    return (
      !search ||
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(search.toLowerCase()))
    )
  })

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

      {/* Barre de recherche alignée à gauche */}
      <div className="mt-2 w-full sm:w-72">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects..."
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center">Loading projects...</p>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <svg
            className="w-16 h-16 mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-lg font-semibold">
            {projects.length === 0
              ? "No projects found in the database."
              : "No projects match your filter."}
          </span>
        </div>
      ) : (
        <CardGrid>
          {filteredProjects.map((project) => (
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
