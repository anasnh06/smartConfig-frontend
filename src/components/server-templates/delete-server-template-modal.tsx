"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useServerTemplatesStore } from "@/lib/store/server_templates"
import { useStore } from "@/lib/store"
import { useState } from "react"

export function DeleteServerTemplateModal() {
  const { isDeleteServerTemplateModalOpen, closeDeleteServerTemplateModal, selectedServerTemplate } = useStore()
  const { removeServerTemplate, reloadServerTemplates } = useServerTemplatesStore()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!selectedServerTemplate?.id) return
    setLoading(true)
    try {
      await removeServerTemplate(selectedServerTemplate.id)
      await reloadServerTemplates()
      closeDeleteServerTemplateModal()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isDeleteServerTemplateModalOpen} onOpenChange={closeDeleteServerTemplateModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer l'attachement serveur/template</DialogTitle>
        </DialogHeader>
        <p>
          Êtes-vous sûr de vouloir supprimer cet attachement :
          <strong> {selectedServerTemplate?.template.name} sur {selectedServerTemplate?.server.name} </strong> ?
        </p>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={closeDeleteServerTemplateModal}>Annuler</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
