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
import { deleteTemplate } from "@/lib/api/template"

type Props = {
  onDeleted?: () => void
}

export function DeleteTemplateModal({ onDeleted }: Props) {
  const { isDeleteTemplateModalOpen, closeDeleteTemplateModal, selectedTemplate } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!selectedTemplate) return
    setIsLoading(true)
    try {
      await deleteTemplate(selectedTemplate.id)
      toast({
        title: "✅ Template deleted",
        description: `"${selectedTemplate.name}" has been successfully deleted.`,
      })
      closeDeleteTemplateModal()
      onDeleted?.()
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to delete the template.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isDeleteTemplateModalOpen} onOpenChange={closeDeleteTemplateModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete
            {selectedTemplate ? ` "${selectedTemplate.name}"` : " this template"} and remove all associated data.
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
