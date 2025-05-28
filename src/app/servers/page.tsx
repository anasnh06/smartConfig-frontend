"use client"

import { useState } from "react"
import { servers, environments, roles, operatingSystems, projects } from "@/lib/mock-data"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { PageHeader } from "@/components/ui/page-header"
import { useStore } from "@/lib/store"
import { CreateServerModal } from "@/components/servers/create-server-modal"
import { EditServerModal } from "@/components/servers/edit-server-modal"
import { DeleteServerModal } from "@/components/servers/delete-server-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function ServersPage() {
  const store = useStore()
  const [filteredServers, setFilteredServers] = useState(servers)
  const [filters, setFilters] = useState({
    role: "",
    environment: "",
    os: "",
    project: "",
  })

  const applyFilters = () => {
    let result = [...servers]

    if (filters.role) {
      result = result.filter((server) => server.roleIds.includes(filters.role))
    }

    if (filters.environment) {
      result = result.filter((server) => server.environmentId === filters.environment)
    }

    if (filters.os) {
      result = result.filter((server) => server.operatingSystemId === filters.os)
    }

    if (filters.project) {
      result = result.filter((server) => server.projectId === filters.project)
    }

    setFilteredServers(result)
  }

  const resetFilters = () => {
    setFilters({
      role: "",
      environment: "",
      os: "",
      project: "",
    })
    setFilteredServers(servers)
  }

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Servers"
        description="Manage your infrastructure servers"
        action={{
          label: "Add Server",
          onClick: store.openCreateServerModal,
        }}
      />

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="role-filter">Role</Label>
              <Select value={filters.role} onValueChange={(value) => handleFilterChange("role", value)}>
                <SelectTrigger id="role-filter">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="environment-filter">Environment</Label>
              <Select value={filters.environment} onValueChange={(value) => handleFilterChange("environment", value)}>
                <SelectTrigger id="environment-filter">
                  <SelectValue placeholder="All Environments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Environments</SelectItem>
                  {environments.map((env) => (
                    <SelectItem key={env.id} value={env.id}>
                      {env.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="os-filter">Operating System</Label>
              <Select value={filters.os} onValueChange={(value) => handleFilterChange("os", value)}>
                <SelectTrigger id="os-filter">
                  <SelectValue placeholder="All Operating Systems" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Operating Systems</SelectItem>
                  {operatingSystems.map((os) => (
                    <SelectItem key={os.id} value={os.id}>
                      {os.name} {os.version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-filter">Project</Label>
              <Select value={filters.project} onValueChange={(value) => handleFilterChange("project", value)}>
                <SelectTrigger id="project-filter">
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={resetFilters} className="gap-2">
              <X className="h-4 w-4" />
              Reset
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      <DataTable columns={columns} data={filteredServers} searchColumn="name" searchPlaceholder="Search servers..." />

      <CreateServerModal />
      <EditServerModal />
      <DeleteServerModal />
    </div>
  )
}
