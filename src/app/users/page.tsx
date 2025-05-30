"use client"

import { useEffect } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { useStore } from "@/lib/store"
import { useUsersStore } from "@/lib/store/users"
import { CreateUserModal } from "@/components/users/create-user-modal"
import { EditUserModal } from "@/components/users/edit-user-modal"
import { DeleteUserModal } from "@/components/users/delete-user-modal"

export default function UsersPage() {
  const { openCreateUserModal } = useStore()
  const { users, fetchUsers, loading } = useUsersStore()

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage user accounts and permissions"
        action={{
          label: "Add User",
          onClick: openCreateUserModal,
        }}
      />

      <DataTable
        columns={columns}
        data={users}
        isLoading={loading}
        searchColumn="username"
        searchPlaceholder="Search users..."
      />

      <CreateUserModal />
      <EditUserModal />
      <DeleteUserModal />
    </div>
  )
}
