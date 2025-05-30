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
import { useToast } from "@/components/ui/use-toast"
import { useEnvironmentsStore } from "@/lib/store/environments"

type DeleteEnvironmentModalProps = {
  onDeleted?: () => void
}

export function DeleteEnvironmentModal({ onDeleted }: DeleteEnvironmentModalProps) {
  const { isDeleteEnvironmentModalOpen, closeDeleteEnvironmentModal, selectedEnvironment } = useStore()
  const removeEnvironment = useEnvironmentsStore((state) => state.removeEnvironment)
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!selectedEnvironment) return
    setIsLoading(true)

    try {
      await removeEnvironment(selectedEnvironment.id)
      toast({
        title: "Environment deleted",
        description: `"${selectedEnvironment.name}" has been successfully removed.`,
      })
      closeDeleteEnvironmentModal()
      onDeleted?.()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the environment. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isDeleteEnvironmentModalOpen} onOpenChange={closeDeleteEnvironmentModal}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the environment
            {selectedEnvironment ? ` "${selectedEnvironment.name}"` : ""}. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
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
