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
import { getServersByRoleId } from "@/lib/mock-data"

export function DeleteRoleModal() {
  const { isDeleteRoleModalOpen, closeDeleteRoleModal, selectedRole } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Check if role is in use
  const associatedServers = selectedRole ? getServersByRoleId(selectedRole.id) : []
  const isInUse = associatedServers.length > 0

  const handleDelete = async () => {
    if (!selectedRole) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    closeDeleteRoleModal()

    toast({
      title: "Role deleted",
      description: `${selectedRole.name} has been deleted successfully.`,
    })
  }

  return (
    <AlertDialog open={isDeleteRoleModalOpen} onOpenChange={closeDeleteRoleModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {isInUse ? (
              <>
                <p className="mb-2 font-semibold text-destructive">
                  Warning: This role is currently assigned to {associatedServers.length} server
                  {associatedServers.length !== 1 ? "s" : ""}.
                </p>
                <p>
                  Deleting this role will remove it from all servers. This action cannot be undone and may affect server
                  operations.
                </p>
              </>
            ) : (
              <p>
                This action cannot be undone. This will permanently delete the role
                {selectedRole ? ` "${selectedRole.name}"` : ""} and remove its data from the system.
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
