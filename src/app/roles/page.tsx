"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { useStore } from "@/lib/store"
import { CreateRoleModal } from "@/components/roles/create-role-modal"
import { EditRoleModal } from "@/components/roles/edit-role-modal"
import { DeleteRoleModal } from "@/components/roles/delete-role-modal"
import { RoleCard } from "@/components/roles/role-card"
import { CardGrid } from "@/components/ui/card-grid"
import { useRolesStore } from "@/lib/store/roles"
import { Tag } from "lucide-react"
import { HiOutlineSearch } from "react-icons/hi"

export default function RolesPage() {
  const store = useStore()
  const roles = useRolesStore((state) => state.roles)
  const fetchRoles = useRolesStore((state) => state.fetchRoles)
  const loading = useRolesStore((state) => state.loading)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  // Filtrage par nom uniquement
  const filteredRoles = roles.filter((role) =>
    !search || role.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles"
        description="Manage server roles for your infrastructure"
        icon={<Tag className="h-6 w-6" />}
        action={{
          label: "Add Role",
          onClick: store.openCreateRoleModal,
        }}
      />

      {/* Barre de recherche alignée à gauche */}
      <div className="mt-2 w-full sm:w-72">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          <input
            type="text"
            placeholder="Search roles..."
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center">Loading roles...</p>
      ) : filteredRoles.length === 0 ? (
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
            {roles.length === 0
              ? "No roles found in the database."
              : "No roles match your filter."}
          </span>
        </div>
      ) : (
        <CardGrid>
          {filteredRoles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </CardGrid>
      )}

      <CreateRoleModal />
      <EditRoleModal />
      <DeleteRoleModal />
    </div>
  )
}
