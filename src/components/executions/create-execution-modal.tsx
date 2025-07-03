"use client"

import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useExecutionsStore } from "@/lib/store/executions"
import { useStore } from "@/lib/store"
import { useState } from "react"
import type { CreateExecutionData } from "@/types/entities"

export function CreateExecutionModal() {
  const { isCreateExecutionModalOpen, closeCreateExecutionModal } = useStore()
  const { addExecution, reloadExecutions } = useExecutionsStore()
  const { register, handleSubmit, reset } = useForm<CreateExecutionData>()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: CreateExecutionData) => {
    setLoading(true)
    try {
      await addExecution(data)
      await reloadExecutions()
      reset()
      closeCreateExecutionModal()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isCreateExecutionModalOpen} onOpenChange={closeCreateExecutionModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une exécution</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("title")} placeholder="Titre de l'exécution" />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Création..." : "Créer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
