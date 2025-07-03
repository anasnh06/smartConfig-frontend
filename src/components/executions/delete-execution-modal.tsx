"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useExecutionsStore } from "@/lib/store/executions"
import { useStore } from "@/lib/store"
import { useState } from "react"

export function DeleteExecutionModal() {
  const { isDeleteExecutionModalOpen, closeDeleteExecutionModal, selectedExecution } = useStore()
  const { removeExecution, reloadExecutions } = useExecutionsStore()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!selectedExecution?.id) return
    setLoading(true)
    try {
      await removeExecution(selectedExecution.id)
      await reloadExecutions()
      closeDeleteExecutionModal()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isDeleteExecutionModalOpen} onOpenChange={closeDeleteExecutionModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer l'exécution</DialogTitle>
        </DialogHeader>
        <p>Êtes-vous sûr de vouloir supprimer cette exécution : <strong>{selectedExecution?.title}</strong> ?</p>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={closeDeleteExecutionModal}>Annuler</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
