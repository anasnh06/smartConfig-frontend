"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { useStore } from "@/lib/store"
import { useUsersStore } from "@/lib/store/users"
import { CreateUserModal } from "@/components/users/create-user-modal"
import { EditUserModal } from "@/components/users/edit-user-modal"
import { DeleteUserModal } from "@/components/users/delete-user-modal"
import { HiOutlineSwitchHorizontal } from "react-icons/hi"
import { Users } from "lucide-react"

export default function UsersPage() {
  const { openCreateUserModal } = useStore()
  const { users, fetchUsers, loading } = useUsersStore()
  const [isActiveFilter, setIsActiveFilter] = useState<"" | "active" | "inactive">("")

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Filtrage par is_active
  const filteredUsers = users.filter(user => {
    if (isActiveFilter === "active") return user.is_active
    if (isActiveFilter === "inactive") return !user.is_active
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage user accounts and permissions"
        icon={<Users className="h-6 w-6" />}
        action={{
          label: "Add User",
          onClick: openCreateUserModal,
        }}
      />

      {/* Filtre is_active */}
      <div className="flex flex-row flex-wrap gap-4 items-start">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3">
          <HiOutlineSwitchHorizontal className="text-gray-500 text-lg" />
          <label className="text-sm font-medium text-gray-700" htmlFor="is-active-filter">
            Status
          </label>
          <select
            id="is-active-filter"
            className="ml-2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={isActiveFilter}
            onChange={e => setIsActiveFilter(e.target.value as "" | "active" | "inactive")}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
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
