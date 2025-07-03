"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useServerConfigurationsStore } from "@/lib/store/server_configurations"
import { useStore } from "@/lib/store"
import { useState } from "react"

export function DeleteServerConfigurationModal() {
  const { isDeleteServerConfigurationModalOpen, closeDeleteServerConfigurationModal, selectedServerConfiguration } = useStore()
  const { removeServerConfiguration, reloadServerConfigurations } = useServerConfigurationsStore()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!selectedServerConfiguration?.id) return
    setLoading(true)
    try {
      await removeServerConfiguration(selectedServerConfiguration.id)
      await reloadServerConfigurations()
      closeDeleteServerConfigurationModal()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isDeleteServerConfigurationModalOpen} onOpenChange={closeDeleteServerConfigurationModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer l'exécution serveur/configuration</DialogTitle>
        </DialogHeader>
        <p>Êtes-vous sûr de vouloir supprimer cette exécution serveur/configuration ?</p>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={closeDeleteServerConfigurationModal}>Annuler</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
