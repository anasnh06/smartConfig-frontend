"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { PageHeader } from "@/components/ui/page-header"
import { CreateTemplateModal } from "@/components/templates/create-template-modal"
import { EditTemplateModal } from "@/components/templates/edit-template-modal"
import { DeleteTemplateModal } from "@/components/templates/delete-template-modal"
import { RunTemplateModal } from "@/components/templates/run-template-modal"
import { TemplateCard } from "@/components/templates/template-card"
import { getTemplates } from "@/lib/api/template"
import type { Template } from "@/types/entities"

export default function TemplatesPage() {
  const store = useStore()
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    fetchTemplates()
  }, [])

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

      {isLoading ? (
        <p className="text-center">Loading templates...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}

      <CreateTemplateModal onCreated={fetchTemplates} />
      <EditTemplateModal onUpdated={fetchTemplates} />
      <DeleteTemplateModal onDeleted={fetchTemplates} />
      <RunTemplateModal />
    </div>
  )
}
