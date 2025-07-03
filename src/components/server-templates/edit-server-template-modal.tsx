"use client"

import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useServerTemplatesStore } from "@/lib/store/server_templates"
import { useStore } from "@/lib/store"
import { useEffect, useState } from "react"
import type { UpdateServerTemplateData } from "@/types/entities"

export function EditServerTemplateModal() {
  const { isEditServerTemplateModalOpen, closeEditServerTemplateModal, selectedServerTemplate } = useStore()
  const { updateServerTemplate, reloadServerTemplates } = useServerTemplatesStore()
  const { register, handleSubmit, reset, setValue } = useForm<UpdateServerTemplateData>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedServerTemplate) {
      setValue("server_id", selectedServerTemplate.server.id)
      setValue("template_id", selectedServerTemplate.template.id)
      setValue("status", selectedServerTemplate.status ?? "")
    }
  }, [selectedServerTemplate, setValue])

  const onSubmit = async (data: UpdateServerTemplateData) => {
    if (!selectedServerTemplate?.id) return
    setLoading(true)
    try {
      await updateServerTemplate(selectedServerTemplate.id, data)
      await reloadServerTemplates()
      reset()
      closeEditServerTemplateModal()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isEditServerTemplateModalOpen} onOpenChange={closeEditServerTemplateModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'attachement serveur/template</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="number"
            {...register("server_id", { required: true, valueAsNumber: true })}
            placeholder="ID du serveur"
          />
          <Input
            type="number"
            {...register("template_id", { required: true, valueAsNumber: true })}
            placeholder="ID du template"
          />
          <Input {...register("status")} placeholder="Status (optionnel)" />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Modification..." : "Modifier"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
