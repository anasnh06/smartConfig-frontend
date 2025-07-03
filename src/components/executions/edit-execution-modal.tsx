"use client"

import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useExecutionsStore } from "@/lib/store/executions"
import { useStore } from "@/lib/store"
import { useEffect, useState } from "react"
import type { UpdateExecutionData } from "@/types/entities"

export function EditExecutionModal() {
  const { isEditExecutionModalOpen, closeEditExecutionModal, selectedExecution } = useStore()
  const { updateExecution, reloadExecutions } = useExecutionsStore()
  const { register, handleSubmit, reset, setValue } = useForm<UpdateExecutionData>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedExecution) {
      setValue("title", selectedExecution.title ?? "")
    }
  }, [selectedExecution, setValue])

  const onSubmit = async (data: UpdateExecutionData) => {
    if (!selectedExecution?.id) return
    setLoading(true)
    try {
      await updateExecution(selectedExecution.id, data)
      await reloadExecutions()
      reset()
      closeEditExecutionModal()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isEditExecutionModalOpen} onOpenChange={closeEditExecutionModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'exécution</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("title")} placeholder="Titre de l'exécution" />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Modification..." : "Modifier"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
