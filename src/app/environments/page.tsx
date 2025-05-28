"use client"

import { environments } from "@/lib/mock-data"
import { PageHeader } from "@/components/ui/page-header"
import { useStore } from "@/lib/store"
import { CreateEnvironmentModal } from "@/components/environments/create-environment-modal"
import { EditEnvironmentModal } from "@/components/environments/edit-environment-modal"
import { DeleteEnvironmentModal } from "@/components/environments/delete-environment-modal"
import { EnvironmentCard } from "@/components/environments/environment-card"
import { CardGrid } from "@/components/ui/card-grid"

export default function EnvironmentsPage() {
  const store = useStore()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Environments"
        description="Manage deployment environments for your infrastructure"
        action={{
          label: "Add Environment",
          onClick: store.openCreateEnvironmentModal,
        }}
      />

      <CardGrid>
        {environments.map((environment) => (
          <EnvironmentCard key={environment.id} environment={environment} />
        ))}
      </CardGrid>

      <CreateEnvironmentModal />
      <EditEnvironmentModal />
      <DeleteEnvironmentModal />
    </div>
  )
}
