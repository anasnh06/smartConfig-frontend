"use client"

import { useState, useMemo } from "react"

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
import { useOperatingSystemsStore } from "@/lib/store/operating-systems"

interface DeleteOsModalProps {
  onDeleted?: () => void
}

export function DeleteOsModal({ onDeleted }: DeleteOsModalProps) {
  const { isDeleteOsModalOpen, closeDeleteOsModal, selectedOs } = useStore()
  const removeOperatingSystem = useOperatingSystemsStore((state) => state.removeOperatingSystem)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const serverCount = useMemo(() => selectedOs?.servers?.length ?? 0, [selectedOs])
  const isInUse = serverCount > 0

  const handleDelete = async () => {
    if (!selectedOs) return
    setIsLoading(true)

    try {
      await removeOperatingSystem(selectedOs.id)
      toast({
        title: "Operating System deleted",
        description: `${selectedOs.name} ${selectedOs.version ?? ""} has been deleted.`,
      })
      closeDeleteOsModal()
      onDeleted?.()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete OS",
      })
    } finally {
      setIsLoading(false)
    }
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
                  Warning: This operating system is used by {serverCount} server{serverCount !== 1 ? "s" : ""}.
                </p>
                <p>
                  Deleting it will affect these servers. This action is irreversible and may break provisioning logic.
                </p>
              </>
            ) : (
              <p>
                This will permanently delete the operating system
                {selectedOs ? ` "${selectedOs.name} ${selectedOs.version ?? ""}"` : ""}. This action cannot be undone.
              </p>
            )}
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
