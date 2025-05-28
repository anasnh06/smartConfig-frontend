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

export function DeleteConfigurationModal() {
  const { isDeleteConfigurationModalOpen, closeDeleteConfigurationModal, selectedConfiguration } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!selectedConfiguration) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    closeDeleteConfigurationModal()

    toast({
      title: "Configuration deleted",
      description: `${selectedConfiguration.name} has been deleted successfully.`,
    })
  }

  return (
    <AlertDialog open={isDeleteConfigurationModalOpen} onOpenChange={closeDeleteConfigurationModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the configuration
            {selectedConfiguration ? ` "${selectedConfiguration.name}"` : ""} and remove its data from the system.
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
