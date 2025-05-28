"use client"

import { useRouter } from "next/navigation"
import { Briefcase, AlertTriangle } from "lucide-react"

import type { Project } from "@/types/entities"
import { getServersByProjectId } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface DeleteProjectModalProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteProjectModal({ project, open, onOpenChange }: DeleteProjectModalProps) {
  const router = useRouter()
  const { toast } = useToast()

  const servers = getServersByProjectId(project.id)
  const hasServers = servers.length > 0

  function onDelete() {
    // In a real app, this would call an API to delete the project
    console.log(`Deleting project: ${project.id}`)

    toast({
      title: "Project deleted",
      description: `Project "${project.name}" has been deleted successfully.`,
    })

    onOpenChange(false)

    // In a real app, we would navigate back to the projects list
    // For now, just refresh the page
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            <span>Delete Project</span>
          </DialogTitle>
          <DialogDescription>Are you sure you want to delete this project?</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <div className="font-medium">{project.name}</div>
            <div className="text-sm text-muted-foreground mt-1">{project.description}</div>
          </div>

          {hasServers && (
            <div className="rounded-md bg-destructive/10 p-4 text-destructive flex gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Warning: This project has associated servers</p>
                <p className="text-sm mt-1">
                  This project has {servers.length} server{servers.length > 1 ? "s" : ""} associated with it. Deleting
                  this project may cause issues with these servers.
                </p>
              </div>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            This action cannot be undone. This will permanently delete the project and all associated data.
          </p>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
