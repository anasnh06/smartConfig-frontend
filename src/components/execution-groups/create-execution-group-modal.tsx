"use client"

import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useExecutionGroupsStore } from "@/lib/store/execution_groups"
import { useExecutionsStore } from "@/lib/store/executions"
import { useStore } from "@/lib/store"
import { useEffect, useState } from "react"
import type { CreateExecutionGroupData } from "@/types/entities"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CreateExecutionGroupModal() {
  const { isCreateExecutionGroupModalOpen, closeCreateExecutionGroupModal, selectedExecution } = useStore()
  const { executions, fetchExecutions } = useExecutionsStore()
  const { addExecutionGroup, reloadExecutionGroups } = useExecutionGroupsStore()
  const { register, handleSubmit, reset, setValue, watch } = useForm<CreateExecutionGroupData>()
  const [loading, setLoading] = useState(false)
  const executionId = watch("execution_id")

  useEffect(() => {
    fetchExecutions()
  }, [fetchExecutions])

  useEffect(() => {
    if (isCreateExecutionGroupModalOpen && selectedExecution?.id !== undefined) {
      setValue("execution_id", selectedExecution.id)
    }
  }, [isCreateExecutionGroupModalOpen, selectedExecution, setValue])

  useEffect(() => {
  if (!isCreateExecutionGroupModalOpen) {
    reset(); // Clean form when closing
  }
}, [isCreateExecutionGroupModalOpen, reset]);
  const onSubmit = async (data: CreateExecutionGroupData) => {
    if (!data.execution_id) {
      alert("Veuillez sélectionner une exécution.")
      return
    }
    setLoading(true)
    try {
      await addExecutionGroup(data)
      await reloadExecutionGroups()
      reset()
      closeCreateExecutionGroupModal()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isCreateExecutionGroupModalOpen} onOpenChange={closeCreateExecutionGroupModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un groupe d'exécution</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("name", { required: true })} placeholder="Nom du groupe" />

          {selectedExecution ? (
            <Input
              value={selectedExecution.title ?? `Execution #${selectedExecution.id}`}
              disabled
              placeholder="Exécution"
            />
          ) : (
            <Select onValueChange={(value) => setValue("execution_id", parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une exécution" />
              </SelectTrigger>
              <SelectContent>
                {executions.map((exe) => (
                  <SelectItem key={exe.id} value={exe.id.toString()}>
                    {exe.title ?? `Execution #${exe.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Création..." : "Créer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
