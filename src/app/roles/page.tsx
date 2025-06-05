"use client"

import { useEffect } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { useStore } from "@/lib/store"
import { CreateRoleModal } from "@/components/roles/create-role-modal"
import { EditRoleModal } from "@/components/roles/edit-role-modal"
import { DeleteRoleModal } from "@/components/roles/delete-role-modal"
import { RoleCard } from "@/components/roles/role-card"
import { CardGrid } from "@/components/ui/card-grid"
import { useRolesStore } from "@/lib/store/roles"
import { Tag } from "lucide-react"

export default function RolesPage() {
  const store = useStore()
  const roles = useRolesStore((state) => state.roles)
  const fetchRoles = useRolesStore((state) => state.fetchRoles)
  const loading = useRolesStore((state) => state.loading)

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

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

      {loading ? (
        <p className="text-muted-foreground text-center">Loading roles...</p>
      ) : (
        <CardGrid>
          {roles.map((role) => (
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
