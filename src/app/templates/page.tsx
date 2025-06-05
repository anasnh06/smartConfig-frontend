"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { PageHeader } from "@/components/ui/page-header"
import { CreateTemplateModal } from "@/components/templates/create-template-modal"
import { EditTemplateModal } from "@/components/templates/edit-template-modal"
import { DeleteTemplateModal } from "@/components/templates/delete-template-modal"
// import { RunTemplateModal } from "@/components/templates/run-template-modal"
import { TemplateCard } from "@/components/templates/template-card"
import { getTemplates } from "@/lib/api/template"
import { getRoles } from "@/lib/api/role"
import { getOperatingSystems } from "@/lib/api/operating-system"
import type { Template } from "@/types/entities"
import type { RoleShort } from "@/types/entities/role"
import type { OperatingSystemShort } from "@/types/entities/operating-system"
import { HiOutlineAdjustments, HiOutlineDesktopComputer, HiOutlineSearch } from "react-icons/hi"
import { Layers, Tag } from "lucide-react" // Ajoute Tag ici

export default function TemplatesPage() {
  const store = useStore()
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [roles, setRoles] = useState<RoleShort[]>([])
  const [oss, setOss] = useState<OperatingSystemShort[]>([])
  const [roleFilter, setRoleFilter] = useState<number | "">("")
  const [osFilter, setOsFilter] = useState<number | "">("")
  const [search, setSearch] = useState("")

  const fetchTemplates = async () => {
    setIsLoading(true)
    try {
      const data = await getTemplates()
      setTemplates(data)
    } catch (error) {
      console.error("Failed to fetch templates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFilters = async () => {
    try {
      const [rolesData, osData] = await Promise.all([
        getRoles(),
        getOperatingSystems(),
      ])
      setRoles(rolesData)
      setOss(osData)
    } catch (error) {
      // handle error if needed
    }
  }

  useEffect(() => {
    fetchTemplates()
    fetchFilters()
  }, [])

  // Filtering logic (ajoute recherche sur description)
  const filteredTemplates = templates.filter((template) => {
    const matchRole =
      !roleFilter || (template.role && template.role.id === roleFilter)
    const matchOs =
      !osFilter ||
      template.operating_systems.some((os) => os.id === osFilter)
    const lowerSearch = search.trim().toLowerCase()
    const matchSearch =
      !lowerSearch ||
      (template.name && template.name.toLowerCase().includes(lowerSearch)) ||
      (template.description && template.description.toLowerCase().includes(lowerSearch))
    return matchRole && matchOs && matchSearch
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Templates"
        description="Manage your automation templates for server provisioning"
        icon={<Layers className="h-6 w-6" />}
        action={{
          label: "Add Template",
          onClick: store.openCreateTemplateModal,
        }}
      />

      {/* Filtres en haut à gauche */}
      <div className="flex flex-row flex-wrap gap-4 items-start">
        <div className="flex flex-row flex-wrap gap-4 bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3">
          {/* Role */}
          <div className="flex items-center gap-2 min-w-[180px]">
            <Tag className="text-gray-500 w-5 h-5" /> {/* Utilise Tag (sidebar) pour l'icône rôle */}
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="role-filter"
            >
              Role
            </label>
            <select
              id="role-filter"
              className="ml-2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="">All</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          {/* OS */}
          <div className="flex items-center gap-2 min-w-[220px]">
            <HiOutlineDesktopComputer className="text-gray-500 text-lg" />
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="os-filter"
            >
              Operating System
            </label>
            <select
              id="os-filter"
              className="ml-2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={osFilter}
              onChange={(e) =>
                setOsFilter(e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="">All</option>
              {oss.map((os) => (
                <option key={os.id} value={os.id}>
                  {os.name}
                  {os.version ? ` ${os.version}` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Barre de recherche juste en dessous, alignée à gauche */}
      <div className="mt-2 w-full sm:w-72">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          <input
            type="text"
            placeholder="Search templates..."
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-center">Loading templates...</p>
      ) : filteredTemplates.length === 0 ? (
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
            {templates.length === 0
              ? "No templates found in the database."
              : "No templates match your filters."}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}

      <CreateTemplateModal onCreated={fetchTemplates} />
      <EditTemplateModal onUpdated={fetchTemplates} />
      <DeleteTemplateModal onDeleted={fetchTemplates} />
      {/* <RunTemplateModal /> */}
    </div>
  )
}
