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
import { useRolesStore } from "@/lib/store/roles"

type DeleteRoleModalProps = {
  onDeleted?: () => void
}

export function DeleteRoleModal({ onDeleted }: DeleteRoleModalProps) {
  const { isDeleteRoleModalOpen, closeDeleteRoleModal, selectedRole } = useStore()
  const removeRole = useRolesStore((state) => state.removeRole)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!selectedRole) return

    setIsLoading(true)

    try {
      await removeRole(selectedRole.id)
      toast({
        title: "Role deleted",
        description: `${selectedRole.name} has been deleted successfully.`,
      })
      closeDeleteRoleModal()
      onDeleted?.() // ✅ Callback pour rediriger
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete role. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isDeleteRoleModalOpen} onOpenChange={closeDeleteRoleModal}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the role
            {selectedRole ? ` "${selectedRole.name}"` : ""} and remove its data from the system.
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
