"use client"

import { roles } from "@/lib/mock-data"
import { PageHeader } from "@/components/ui/page-header"
import { useStore } from "@/lib/store"
import { CreateRoleModal } from "@/components/roles/create-role-modal"
import { EditRoleModal } from "@/components/roles/edit-role-modal"
import { DeleteRoleModal } from "@/components/roles/delete-role-modal"
import { RoleCard } from "@/components/roles/role-card"
import { CardGrid } from "@/components/ui/card-grid"

export default function RolesPage() {
  const store = useStore()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles"
        description="Manage server roles for your infrastructure"
        action={{
          label: "Add Role",
          onClick: store.openCreateRoleModal,
        }}
      />

      <CardGrid>
        {roles.map((role) => (
          <RoleCard key={role.id} role={role} />
        ))}
      </CardGrid>

      <CreateRoleModal />
      <EditRoleModal />
      <DeleteRoleModal />
    </div>
  )
}
