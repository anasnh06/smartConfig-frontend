"use client"

import { useEffect, useState } from "react"
import { Globe, Plus } from "lucide-react"
import { HiOutlineSearch } from "react-icons/hi"

import { useStore } from "@/lib/store"
import { useEnvironmentsStore } from "@/lib/store/environments"
import { PageHeader } from "@/components/ui/page-header"
import { CardGrid } from "@/components/ui/card-grid"
import { EnvironmentCard } from "@/components/environments/environment-card"
import { CreateEnvironmentModal } from "@/components/environments/create-environment-modal"
import { EditEnvironmentModal } from "@/components/environments/edit-environment-modal"
import { DeleteEnvironmentModal } from "@/components/environments/delete-environment-modal"

export default function EnvironmentsPage() {
  const store = useStore()
  const environments = useEnvironmentsStore((state) => state.environments)
  const fetchEnvironments = useEnvironmentsStore((state) => state.fetchEnvironments)
  const loading = useEnvironmentsStore((state) => state.loading)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchEnvironments()
  }, [fetchEnvironments])

  // Filtrage par nom uniquement
  const filteredEnvironments = environments.filter((environment) => {
    return (
      !search ||
      environment.name.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Environments"
        description="Manage deployment environments for your infrastructure"
        icon={<Globe className="h-6 w-6" />}
        action={{
          label: "Add Environment",
          onClick: store.openCreateEnvironmentModal,
        }}
      />

      {/* Barre de recherche alignée à gauche */}
      <div className="mt-2 w-full sm:w-72">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          <input
            type="text"
            placeholder="Search environments..."
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center">Loading environments...</p>
      ) : filteredEnvironments.length === 0 ? (
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
            {environments.length === 0
              ? "No environments found in the database."
              : "No environments match your filter."}
          </span>
        </div>
      ) : (
        <CardGrid>
          {filteredEnvironments.map((environment) => (
            <EnvironmentCard key={environment.id} environment={environment} />
          ))}
        </CardGrid>
      )}

      <CreateEnvironmentModal />
      <EditEnvironmentModal />
      <DeleteEnvironmentModal />
    </div>
  )
}
