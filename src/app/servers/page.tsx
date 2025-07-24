"use client"

import { useEffect, useState } from "react"
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
import { HiOutlineDesktopComputer, HiOutlineUserGroup, HiOutlineGlobeAlt, HiOutlineAdjustments, HiOutlineSearch } from "react-icons/hi"
import { Briefcase, Tag, Server } from "lucide-react" // Ajout de Server
import type { OperatingSystemShort } from "@/types/entities/operating-system"
import type { ProjectShort } from "@/types/entities/project"
import type { RoleShort } from "@/types/entities/role"
import type { EnvironmentShort } from "@/types/entities/environment"

export default function ServersPage() {
  const { openCreateServerModal } = useStore()
  const { servers, fetchServers, getServerSshStatus, serverStatus } = useServersStore()
  const { projects, fetchProjects } = useProjectsStore()
  const { environments, fetchEnvironments } = useEnvironmentsStore()
  const { roles, fetchRoles } = useRolesStore()
  const { operatingSystems, fetchOperatingSystems } = useOperatingSystemsStore()

  // Filtres
  const [osFilter, setOsFilter] = useState<number | "">("")
  const [projectFilter, setProjectFilter] = useState<number | "">("")
  const [envFilter, setEnvFilter] = useState<number | "">("")
  const [roleFilter, setRoleFilter] = useState<number | "">("")
  const [sshStatusFilter, setSshStatusFilter] = useState<"" | "online" | "offline">("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchServers()
    fetchProjects()
    fetchEnvironments()
    fetchRoles()
    fetchOperatingSystems()
  }, [])

  // Fetch SSH status for all servers when servers change
  useEffect(() => {
    servers.forEach(server => {
      if (!serverStatus[server.id]) {
        getServerSshStatus(server.id)
      }
    })
  }, [servers, getServerSshStatus, serverStatus])

  // Filtrage côté client (supporte plusieurs rôles + recherche + ssh status)
  const filteredServers = servers.filter((server) => {
    const matchOs =
      !osFilter ||
      (server.operating_system && server.operating_system.id === osFilter)
    const matchProject =
      !projectFilter ||
      (server.project && server.project.id === projectFilter)
    const matchEnv =
      !envFilter ||
      (server.environment && server.environment.id === envFilter)
    const matchRole =
      !roleFilter ||
      (server.roles && server.roles.some((role) => role.id === roleFilter))
    const lowerSearch = search.trim().toLowerCase()
    const matchSearch =
      !lowerSearch ||
      (server.name && server.name.toLowerCase().includes(lowerSearch)) ||
      (server.ip_address && server.ip_address.toLowerCase().includes(lowerSearch))
    // SSH status filter
    const status = serverStatus[server.id] || "offline"
    const matchSshStatus =
      !sshStatusFilter || status === sshStatusFilter

    return matchOs && matchProject && matchEnv && matchRole && matchSearch && matchSshStatus
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Servers"
        description="Manage your infrastructure servers"
        icon={<Server className="h-6 w-6" />}
        action={{
          label: "Add Server",
          onClick: openCreateServerModal,
        }}
      />

      {/* Filtres stylés */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3 flex flex-row flex-wrap gap-4 items-center w-full">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <HiOutlineDesktopComputer className="text-gray-500 text-lg" />
          <label className="block text-sm font-medium text-gray-700" htmlFor="os-filter">
            Operating System
          </label>
          <select
            id="os-filter"
            className="ml-2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            value={osFilter}
            onChange={(e) =>
              setOsFilter(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">All</option>
            {operatingSystems.map((os: OperatingSystemShort) => (
              <option key={os.id} value={os.id}>
                {os.name}{os.version ? ` ${os.version}` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Briefcase className="text-gray-500 w-5 h-5" />
          <label className="block text-sm font-medium text-gray-700" htmlFor="project-filter">
            Project
          </label>
          <select
            id="project-filter"
            className="ml-2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            value={projectFilter}
            onChange={(e) =>
              setProjectFilter(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">All</option>
            {projects.map((project: ProjectShort) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <HiOutlineGlobeAlt className="text-gray-500 text-lg" />
          <label className="block text-sm font-medium text-gray-700" htmlFor="env-filter">
            Environment
          </label>
          <select
            id="env-filter"
            className="ml-2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            value={envFilter}
            onChange={(e) =>
              setEnvFilter(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">All</option>
            {environments.map((env: EnvironmentShort) => (
              <option key={env.id} value={env.id}>
                {env.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Tag className="text-gray-500 w-5 h-5" />
          <label className="block text-sm font-medium text-gray-700" htmlFor="role-filter">
            Role
          </label>
          <select
            id="role-filter"
            className="ml-2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">All</option>
            {roles.map((role: RoleShort) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          {/* SSH Status Filter */}
          <HiOutlineAdjustments className="text-gray-500 text-lg" />
          <label className="block text-sm font-medium text-gray-700" htmlFor="ssh-status-filter">
            SSH Status
          </label>
          <select
            id="ssh-status-filter"
            className="ml-2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            value={sshStatusFilter}
            onChange={e => setSshStatusFilter(e.target.value as "" | "online" | "offline")}
          >
            <option value="">All</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Barre de recherche unique (par name et ip address) */}
      <div className="mt-2 w-full sm:w-72">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or IP address..."
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tableau */}
      {filteredServers.length === 0 ? (
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
            {servers.length === 0
              ? "No servers found in the database."
              : "No servers match your filters."}
          </span>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredServers}
        />
      )}

      <CreateServerModal />
      <EditServerModal />
      <DeleteServerModal />
    </div>
  )
}
