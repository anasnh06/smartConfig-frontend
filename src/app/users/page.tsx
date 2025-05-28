"use client"

import { users } from "@/lib/mock-data"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { PageHeader } from "@/components/ui/page-header"
import { useStore } from "@/lib/store"
import { CreateUserModal } from "@/components/users/create-user-modal"
import { EditUserModal } from "@/components/users/edit-user-modal"
import { DeleteUserModal } from "@/components/users/delete-user-modal"

export default function UsersPage() {
  const store = useStore()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage user accounts and permissions"
        action={{
          label: "Add User",
          onClick: store.openCreateUserModal,
        }}
      />

      <DataTable columns={columns} data={users} searchColumn="name" searchPlaceholder="Search users..." />

      <CreateUserModal />
      <EditUserModal />
      <DeleteUserModal />
    </div>
  )
}
