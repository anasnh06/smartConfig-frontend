"use client"

import { useEffect } from "react"
import { Monitor } from "lucide-react"

import { PageHeader } from "@/components/ui/page-header"
import { useStore } from "@/lib/store"
import { useOperatingSystemsStore } from "@/lib/store/operating-systems"
import { CardGrid } from "@/components/ui/card-grid"
import { OsCard } from "@/components/operating-systems/os-card"
import { CreateOsModal } from "@/components/operating-systems/create-os-modal"
import { EditOsModal } from "@/components/operating-systems/edit-os-modal"
import { DeleteOsModal } from "@/components/operating-systems/delete-os-modal"

export default function OperatingSystemsPage() {
  const store = useStore()
  const operatingSystems = useOperatingSystemsStore((state) => state.operatingSystems)
  const fetchOperatingSystems = useOperatingSystemsStore((state) => state.fetchOperatingSystems)
  const loading = useOperatingSystemsStore((state) => state.loading)

  useEffect(() => {
    fetchOperatingSystems()
  }, [fetchOperatingSystems])

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Operating Systems"
        description="Manage operating systems for your infrastructure"
        icon={<Monitor className="h-6 w-6" />}
        action={{
          label: "Add Operating System",
          onClick: store.openCreateOsModal,
        }}
      />

      {loading ? (
        <p className="text-muted-foreground text-center">Loading operating systems...</p>
      ) : (
        <CardGrid>
          {operatingSystems.map((os) => (
            <OsCard key={os.id} os={os} />
          ))}
        </CardGrid>
      )}

      <CreateOsModal />
      <EditOsModal />
      <DeleteOsModal />
    </div>
  )
}
