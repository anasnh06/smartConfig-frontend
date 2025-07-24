"use client"

import { useEffect, useState } from "react"
import { Monitor } from "lucide-react"
import { HiOutlineSearch } from "react-icons/hi"

import { PageHeader } from "@/components/ui/page-header"
import { useStore } from "@/lib/store"
import { useOperatingSystemsStore } from "@/lib/store/operating-systems"
import { CardGrid } from "@/components/ui/card-grid"
import { OsCard } from "@/components/operating-systems/os-card"
import { CreateOsModal } from "@/components/operating-systems/create-os-modal"
import { EditOsModal } from "@/components/operating-systems/edit-os-modal"
import { DeleteOsModal } from "@/components/operating-systems/delete-os-modal"

export default function OperatingSystemsPage() {
  const store = useStore()
  const operatingSystems = useOperatingSystemsStore((state) => state.operatingSystems)
  const fetchOperatingSystems = useOperatingSystemsStore((state) => state.fetchOperatingSystems)
  const loading = useOperatingSystemsStore((state) => state.loading)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchOperatingSystems()
  }, [fetchOperatingSystems])

  // Filtrage par recherche
  const filteredOperatingSystems = operatingSystems.filter((os) => {
    return (
      !search ||
      os.name.toLowerCase().includes(search.toLowerCase()) ||
      (os.version && os.version.toLowerCase().includes(search.toLowerCase()))
    )
  })

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Operating Systems"
        description="Manage operating systems for your infrastructure"
        icon={<Monitor className="h-6 w-6" />}
        action={{
          label: "Add Operating System",
          onClick: store.openCreateOsModal,
        }}
      />

      {/* Barre de recherche alignée à gauche */}
      <div className="mt-2 w-full sm:w-72">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          <input
            type="text"
            placeholder="Search operating systems..."
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center">Loading operating systems...</p>
      ) : filteredOperatingSystems.length === 0 ? (
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
            {operatingSystems.length === 0
              ? "No operating systems found in the database."
              : "No operating systems match your filter."}
          </span>
        </div>
      ) : (
        <CardGrid>
          {filteredOperatingSystems.map((os) => (
            <OsCard key={os.id} os={os} />
          ))}
        </CardGrid>
      )}

      <CreateOsModal />
      <EditOsModal />
      <DeleteOsModal />
    </div>
  )
}
