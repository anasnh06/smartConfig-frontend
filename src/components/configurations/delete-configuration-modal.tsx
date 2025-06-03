"use client"

import { useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useStore } from "@/lib/store"
import { useConfigurationsStore } from "@/lib/store/configurations"
import { useToast } from "@/components/ui/use-toast"

interface DeleteConfigurationModalProps {
  onDeleted?: () => void
}

export function DeleteConfigurationModal({ onDeleted }: DeleteConfigurationModalProps) {
  const { isDeleteConfigurationModalOpen, closeDeleteConfigurationModal, selectedConfiguration } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { removeConfiguration } = useConfigurationsStore()

  const handleDelete = async () => {
    if (!selectedConfiguration) return

    setIsLoading(true)
    try {
      await removeConfiguration(selectedConfiguration.id)
      toast({
        title: "✅ Configuration deleted",
        description: `"${selectedConfiguration.name}" has been deleted successfully.`,
      })
      closeDeleteConfigurationModal()
      if (onDeleted) onDeleted()
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isDeleteConfigurationModalOpen} onOpenChange={closeDeleteConfigurationModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete
            {selectedConfiguration ? ` "${selectedConfiguration.name}"` : " this configuration"} and remove it from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
