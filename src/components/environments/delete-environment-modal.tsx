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
import { getServersByEnvironmentId, projects } from "@/lib/mock-data"

export function DeleteEnvironmentModal() {
  const { isDeleteEnvironmentModalOpen, closeDeleteEnvironmentModal, selectedEnvironment } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Check if environment is in use by servers
  const associatedServers = selectedEnvironment ? getServersByEnvironmentId(selectedEnvironment.id) : []
  const isInUseByServers = associatedServers.length > 0

  // Check if environment is in use by projects
  const associatedProjects = selectedEnvironment
    ? projects.filter((project) => project.environmentIds.includes(selectedEnvironment.id))
    : []
  const isInUseByProjects = associatedProjects.length > 0

  const isInUse = isInUseByServers || isInUseByProjects

  const handleDelete = async () => {
    if (!selectedEnvironment) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    closeDeleteEnvironmentModal()

    toast({
      title: "Environment deleted",
      description: `${selectedEnvironment.name} has been deleted successfully.`,
    })
  }

  return (
    <AlertDialog open={isDeleteEnvironmentModalOpen} onOpenChange={closeDeleteEnvironmentModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {isInUse ? (
              <>
                <p className="mb-2 font-semibold text-destructive">Warning: This environment is currently in use.</p>
                {isInUseByServers && (
                  <p className="mb-2">
                    • Used by {associatedServers.length} server{associatedServers.length !== 1 ? "s" : ""}.
                  </p>
                )}
                {isInUseByProjects && (
                  <p className="mb-2">
                    • Used by {associatedProjects.length} project{associatedProjects.length !== 1 ? "s" : ""}.
                  </p>
                )}
                <p>
                  Deleting this environment will affect these resources. This action cannot be undone and may cause
                  operations to fail.
                </p>
              </>
            ) : (
              <p>
                This action cannot be undone. This will permanently delete the environment
                {selectedEnvironment ? ` "${selectedEnvironment.name}"` : ""} and remove its data from the system.
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
