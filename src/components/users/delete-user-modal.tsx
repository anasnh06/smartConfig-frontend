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
import { useUsersStore } from "@/lib/store/users"

type DeleteUserModalProps = {
  onDeleted?: () => void
}

export function DeleteUserModal({ onDeleted }: DeleteUserModalProps) {
  const { isDeleteUserModalOpen, closeDeleteUserModal, selectedUser } = useStore()
  const removeUser = useUsersStore((state) => state.removeUser)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!selectedUser) return

    setIsLoading(true)

    try {
      await removeUser(selectedUser.id)
      toast({
        title: "User deleted",
        description: `${selectedUser.username} has been deleted successfully.`,
      })
      closeDeleteUserModal()
      onDeleted?.()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isDeleteUserModalOpen} onOpenChange={closeDeleteUserModal}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user
            {selectedUser ? ` "${selectedUser.username}"` : ""} and remove their data from the system.
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
