"use client"

import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useServerTemplatesStore } from "@/lib/store/server_templates"
import { useStore } from "@/lib/store"
import { useState } from "react"
import type { CreateServerTemplateData } from "@/types/entities"

export function CreateServerTemplateModal() {
  const { isCreateServerTemplateModalOpen, closeCreateServerTemplateModal } = useStore()
  const { addServerTemplate, reloadServerTemplates } = useServerTemplatesStore()
  const { register, handleSubmit, reset } = useForm<CreateServerTemplateData>()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: CreateServerTemplateData) => {
    setLoading(true)
    try {
      await addServerTemplate(data)
      await reloadServerTemplates()
      reset()
      closeCreateServerTemplateModal()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isCreateServerTemplateModalOpen} onOpenChange={closeCreateServerTemplateModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attacher un template à un serveur</DialogTitle>
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
            {loading ? "Attachement..." : "Attacher"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
