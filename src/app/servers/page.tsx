"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { useServersStore } from "@/lib/store/servers"
import { useProjectsStore } from "@/lib/store/projects"
import { useRolesStore } from "@/lib/store/roles"
import { useOperatingSystemsStore } from "@/lib/store/operating-systems"
import { useEnvironmentsStore } from "@/lib/store/environments"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { PageHeader } from "@/components/ui/page-header"
import { CreateServerModal } from "@/components/servers/create-server-modal"
import { EditServerModal } from "@/components/servers/edit-server-modal"
import { DeleteServerModal } from "@/components/servers/delete-server-modal"

export default function ServersPage() {
  const { openCreateServerModal } = useStore()
  const { servers, fetchServers } = useServersStore()
  const { fetchProjects } = useProjectsStore()
  const { fetchEnvironments } = useEnvironmentsStore()
  const { fetchRoles } = useRolesStore()
  const { fetchOperatingSystems } = useOperatingSystemsStore()

  useEffect(() => {
    fetchServers()
    fetchProjects()
    fetchEnvironments()
    fetchRoles()
    fetchOperatingSystems()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Servers"
        description="Manage your infrastructure servers"
        action={{
          label: "Add Server",
          onClick: openCreateServerModal,
        }}
      />

      <DataTable
        columns={columns}
        data={servers}
        searchColumn="name"
        searchPlaceholder="Search servers..."
      />

      <CreateServerModal />
      <EditServerModal />
      <DeleteServerModal />
    </div>
  )
}
