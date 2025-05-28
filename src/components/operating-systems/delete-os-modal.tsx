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
import { getServersByOperatingSystemId } from "@/lib/mock-data"

export function DeleteOsModal() {
  const { isDeleteOsModalOpen, closeDeleteOsModal, selectedOs } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Check if OS is in use
  const associatedServers = selectedOs ? getServersByOperatingSystemId(selectedOs.id) : []
  const isInUse = associatedServers.length > 0

  const handleDelete = async () => {
    if (!selectedOs) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    closeDeleteOsModal()

    toast({
      title: "Operating System deleted",
      description: `${selectedOs.name} ${selectedOs.version} has been deleted successfully.`,
    })
  }

  return (
    <AlertDialog open={isDeleteOsModalOpen} onOpenChange={closeDeleteOsModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {isInUse ? (
              <>
                <p className="mb-2 font-semibold text-destructive">
                  Warning: This operating system is currently used by {associatedServers.length} server
                  {associatedServers.length !== 1 ? "s" : ""}.
                </p>
                <p>
                  Deleting this operating system will affect these servers. This action cannot be undone and may cause
                  server operations to fail.
                </p>
              </>
            ) : (
              <p>
                This action cannot be undone. This will permanently delete the operating system
                {selectedOs ? ` "${selectedOs.name} ${selectedOs.version}"` : ""} and remove its data from the system.
              </p>
            )}
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
