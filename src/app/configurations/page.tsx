"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { useStore } from "@/lib/store"
import { useConfigurationsStore } from "@/lib/store/configurations"
import { CreateConfigurationModal } from "@/components/configurations/create-configuration-modal"
import { EditConfigurationModal } from "@/components/configurations/edit-configuration-modal"
import { DeleteConfigurationModal } from "@/components/configurations/delete-configuration-modal"
// import { RunConfigurationModal } from "@/components/configurations/run-configuration-modal"
import { ConfigurationCard } from "@/components/configurations/configuration-card"  
import { getOperatingSystems } from "@/lib/api/operating-system"
import type { OperatingSystemShort } from "@/types/entities/operating-system"
import { HiOutlineDesktopComputer, HiOutlineSearch } from "react-icons/hi"
import { FileCode } from "lucide-react"

export default function ConfigurationsPage() {
  const store = useStore()
  const { configurations, fetchConfigurations } = useConfigurationsStore()
  const [oss, setOss] = useState<OperatingSystemShort[]>([])
  const [osFilter, setOsFilter] = useState<number | "">("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchConfigurations()
    getOperatingSystems().then(setOss)
  }, [fetchConfigurations])

  // Filtrage par OS + recherche
  const filteredConfigurations = configurations.filter((configuration) => {
    const matchOs =
      !osFilter ||
      (Array.isArray(configuration.operating_systems) &&
        configuration.operating_systems.some((os) => os.id === osFilter))
    const matchSearch =
      !search ||
      configuration.name.toLowerCase().includes(search.toLowerCase()) ||
      (configuration.description &&
        configuration.description.toLowerCase().includes(search.toLowerCase()))
    return matchOs && matchSearch
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurations"
        description="Manage your automation configurations"
        icon={<FileCode className="h-6 w-6" />}
        action={{
          label: "Add Configuration",
          onClick: store.openCreateConfigurationModal,
        }}
      />

      {/* Filtres en haut à gauche */}
      <div className="flex flex-row flex-wrap gap-4 items-start">
        <div className="flex flex-row flex-wrap gap-4 bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3">
          {/* OS */}
          <div className="flex items-center gap-2 min-w-[220px]">
            <HiOutlineDesktopComputer className="text-gray-500 text-lg" />
            <label className="text-sm font-medium text-gray-700" htmlFor="os-filter">
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
            placeholder="Search configurations..."
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredConfigurations.length === 0 ? (
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
            {configurations.length === 0
              ? "No configurations found in the database."
              : "No configurations match your filter."}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredConfigurations.map((configuration) => (
            <ConfigurationCard key={configuration.id} configuration={configuration} />
          ))}
        </div>
      )}

      <CreateConfigurationModal />
      <EditConfigurationModal />
      <DeleteConfigurationModal />
      {/* <RunConfigurationModal /> */}
    </div>
  )
}
