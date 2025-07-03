"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useExecutionGroupsStore } from "@/lib/store/execution_groups"
import { useStore } from "@/lib/store"
import { useState } from "react"

export function DeleteExecutionGroupModal() {
  const { isDeleteExecutionGroupModalOpen, closeDeleteExecutionGroupModal, selectedExecutionGroup } = useStore()
  const { removeExecutionGroup, reloadExecutionGroups } = useExecutionGroupsStore()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!selectedExecutionGroup?.id) return
    setLoading(true)
    try {
      await removeExecutionGroup(selectedExecutionGroup.id)
      await reloadExecutionGroups()
      closeDeleteExecutionGroupModal()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isDeleteExecutionGroupModalOpen} onOpenChange={closeDeleteExecutionGroupModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le groupe d'exécution</DialogTitle>
        </DialogHeader>
        <p>Êtes-vous sûr de vouloir supprimer le groupe : <strong>{selectedExecutionGroup?.name}</strong> ?</p>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={closeDeleteExecutionGroupModal}>Annuler</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
