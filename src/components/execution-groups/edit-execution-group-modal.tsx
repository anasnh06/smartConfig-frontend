"use client"

import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useExecutionGroupsStore } from "@/lib/store/execution_groups"
import { useStore } from "@/lib/store"
import { useEffect, useState } from "react"
import type { UpdateExecutionGroupData } from "@/types/entities"

export function EditExecutionGroupModal() {
  const { isEditExecutionGroupModalOpen, closeEditExecutionGroupModal, selectedExecutionGroup } = useStore()
  const { updateExecutionGroup, reloadExecutionGroups } = useExecutionGroupsStore()
  const { register, handleSubmit, reset, setValue } = useForm<UpdateExecutionGroupData>()
  const [loading, setLoading] = useState(false)

  // Préremplissage lors de l'ouverture de la modale
  useEffect(() => {
    if (selectedExecutionGroup) {
      setValue("name", selectedExecutionGroup.name ?? "")
      setValue("playbook_path", selectedExecutionGroup.playbook_path ?? "")
      setValue("inventory_path", selectedExecutionGroup.inventory_path ?? "")
    }
  }, [selectedExecutionGroup, setValue])

  // Nettoyage à la fermeture
  useEffect(() => {
    if (!isEditExecutionGroupModalOpen) {
      reset()
    }
  }, [isEditExecutionGroupModalOpen, reset])

  const onSubmit = async (data: UpdateExecutionGroupData) => {
    if (!selectedExecutionGroup?.id) return
    setLoading(true)
    try {
      await updateExecutionGroup(selectedExecutionGroup.id, data)
      await reloadExecutionGroups()
      reset()
      closeEditExecutionGroupModal()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isEditExecutionGroupModalOpen} onOpenChange={closeEditExecutionGroupModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le groupe d'exécution</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("name")} placeholder="Nom du groupe" />

          {selectedExecutionGroup?.execution ? (
            <Input
              value={
                selectedExecutionGroup.execution.title ??
                `Execution #${selectedExecutionGroup.execution.id}`
              }
              disabled
              placeholder="Exécution"
            />
          ) : (
            <Input
              disabled
              placeholder="Aucune exécution liée"
            />
          )}

          <Input {...register("playbook_path")} placeholder="Chemin du playbook" />
          <Input {...register("inventory_path")} placeholder="Chemin de l'inventory" />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Modification..." : "Modifier"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
