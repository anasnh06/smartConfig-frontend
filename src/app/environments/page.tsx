"use client"

import { useEffect } from "react"
import { Globe, Plus } from "lucide-react"

import { useStore } from "@/lib/store"
import { useEnvironmentsStore } from "@/lib/store/environments"
import { PageHeader } from "@/components/ui/page-header"
import { CardGrid } from "@/components/ui/card-grid"
import { EnvironmentCard } from "@/components/environments/environment-card"
import { CreateEnvironmentModal } from "@/components/environments/create-environment-modal"
import { EditEnvironmentModal } from "@/components/environments/edit-environment-modal"
import { DeleteEnvironmentModal } from "@/components/environments/delete-environment-modal"

export default function EnvironmentsPage() {
  const store = useStore()
  const environments = useEnvironmentsStore((state) => state.environments)
  const fetchEnvironments = useEnvironmentsStore((state) => state.fetchEnvironments)
  const loading = useEnvironmentsStore((state) => state.loading)

  useEffect(() => {
    fetchEnvironments()
  }, [fetchEnvironments])

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Environments"
        description="Manage deployment environments for your infrastructure"
        icon={<Globe className="h-6 w-6" />}
        action={{
          label: "Add Environment",
          onClick: store.openCreateEnvironmentModal,
        }}
      />

      {loading ? (
        <p className="text-muted-foreground text-center">Loading environments...</p>
      ) : (
        <CardGrid>
          {environments.map((environment) => (
            <EnvironmentCard key={environment.id} environment={environment} />
          ))}
        </CardGrid>
      )}

      <CreateEnvironmentModal />
      <EditEnvironmentModal />
      <DeleteEnvironmentModal />
    </div>
  )
}
