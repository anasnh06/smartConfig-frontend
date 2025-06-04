"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { deleteTemplateConfiguration } from "@/lib/api/template_configuration"

type Props = {
  onDeleted?: () => void
}

export function DeleteTemplateConfigurationModal({ onDeleted }: Props) {
  const {
    isDeleteTemplateConfigurationModalOpen,
    closeDeleteTemplateConfigurationModal,
    selectedTemplateConfiguration,
  } = useStore()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!selectedTemplateConfiguration) return

    try {
      await deleteTemplateConfiguration(selectedTemplateConfiguration.id)

      toast({
        title: "✅ Deleted",
        description: "The configuration has been unlinked from the template.",
      })

      onDeleted?.()
      closeDeleteTemplateConfigurationModal()
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to delete configuration link.",
      })
    }
  }

  return (
    <Dialog open={isDeleteTemplateConfigurationModalOpen} onOpenChange={closeDeleteTemplateConfigurationModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Configuration Link</DialogTitle>
          <DialogDescription>
            Are you sure you want to unlink this configuration from the template? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={closeDeleteTemplateConfigurationModal}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
