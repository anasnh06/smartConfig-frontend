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
import { useProjectsStore } from "@/lib/store/projects"
import { useToast } from "@/components/ui/use-toast"

type DeleteProjectModalProps = {
  onDeleted?: () => void
}

export function DeleteProjectModal({ onDeleted }: DeleteProjectModalProps) {
  const { isDeleteProjectModalOpen, closeDeleteProjectModal, selectedProject } = useStore()
  const removeProject = useProjectsStore((state) => state.removeProject)
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!selectedProject) return
    setIsLoading(true)

    try {
      await removeProject(selectedProject.id)
      toast({
        title: "Project deleted",
        description: `"${selectedProject.name}" has been successfully removed.`,
      })
      closeDeleteProjectModal()
      onDeleted?.()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the project. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isDeleteProjectModalOpen} onOpenChange={closeDeleteProjectModal}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the project
            {selectedProject ? ` "${selectedProject.name}"` : ""} and all its associated data. This action cannot be undone.
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
