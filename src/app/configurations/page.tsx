"use client"

import { useEffect } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { useStore } from "@/lib/store"
import { useConfigurationsStore } from "@/lib/store/configurations"
import { CreateConfigurationModal } from "@/components/configurations/create-configuration-modal"
import { EditConfigurationModal } from "@/components/configurations/edit-configuration-modal"
import { DeleteConfigurationModal } from "@/components/configurations/delete-configuration-modal"
// import { RunConfigurationModal } from "@/components/configurations/run-configuration-modal"
import { ConfigurationCard } from "@/components/configurations/configuration-card"

export default function ConfigurationsPage() {
  const store = useStore()
  const { configurations, fetchConfigurations } = useConfigurationsStore()

  useEffect(() => {
    fetchConfigurations()
  }, [fetchConfigurations])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurations"
        description="Manage your automation configurations"
        action={{
          label: "Add Configuration",
          onClick: store.openCreateConfigurationModal,
        }}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {configurations.map((configuration) => (
          <ConfigurationCard key={configuration.id} configuration={configuration} />
        ))}
      </div>

      <CreateConfigurationModal />
      <EditConfigurationModal />
      <DeleteConfigurationModal />
      {/* <RunConfigurationModal /> */}
    </div>
  )
}
