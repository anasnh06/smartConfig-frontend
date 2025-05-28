"use client"

import { operatingSystems } from "@/lib/mock-data"
import { PageHeader } from "@/components/ui/page-header"
import { useStore } from "@/lib/store"
import { CreateOsModal } from "@/components/operating-systems/create-os-modal"
import { EditOsModal } from "@/components/operating-systems/edit-os-modal"
import { DeleteOsModal } from "@/components/operating-systems/delete-os-modal"
import { OsCard } from "@/components/operating-systems/os-card"
import { CardGrid } from "@/components/ui/card-grid"

export default function OperatingSystemsPage() {
  const store = useStore()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operating Systems"
        description="Manage operating systems for your infrastructure"
        action={{
          label: "Add Operating System",
          onClick: store.openCreateOsModal,
        }}
      />

      <CardGrid>
        {operatingSystems.map((os) => (
          <OsCard key={os.id} os={os} />
        ))}
      </CardGrid>

      <CreateOsModal />
      <EditOsModal />
      <DeleteOsModal />
    </div>
  )
}
