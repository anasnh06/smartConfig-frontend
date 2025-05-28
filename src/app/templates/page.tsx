"use client"

import { templates } from "@/lib/mock-data"
import { PageHeader } from "@/components/ui/page-header"
import { useStore } from "@/lib/store"
import { CreateTemplateModal } from "@/components/templates/create-template-modal"
import { EditTemplateModal } from "@/components/templates/edit-template-modal"
import { DeleteTemplateModal } from "@/components/templates/delete-template-modal"
import { RunTemplateModal } from "@/components/templates/run-template-modal"
import { TemplateCard } from "@/components/templates/template-card"

export default function TemplatesPage() {
  const store = useStore()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Templates"
        description="Manage your automation templates for server provisioning"
        action={{
          label: "Add Template",
          onClick: store.openCreateTemplateModal,
        }}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      <CreateTemplateModal />
      <EditTemplateModal />
      <DeleteTemplateModal />
      <RunTemplateModal />
    </div>
  )
}
