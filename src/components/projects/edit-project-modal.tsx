"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { useProjectsStore } from "@/lib/store/projects"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
})

type FormValues = z.infer<typeof formSchema>

type EditProjectModalProps = {
  onUpdated?: () => void
}

export function EditProjectModal({ onUpdated }: EditProjectModalProps) {
  const { isEditProjectModalOpen, closeEditProjectModal, selectedProject } = useStore()
  const updateProject = useProjectsStore((state) => state.updateProject)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  useEffect(() => {
    if (selectedProject) {
      form.reset({
        name: selectedProject.name,
        description: selectedProject.description || "",
      })
    }
  }, [selectedProject, form])

  const onSubmit = async (values: FormValues) => {
    if (!selectedProject) return
    setIsLoading(true)

    try {
      await updateProject(selectedProject.id, values)
      toast({
        title: "Project updated",
        description: `${values.name} has been updated successfully.`,
      })
      closeEditProjectModal()
      form.reset()
      onUpdated?.()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update the project. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isEditProjectModalOpen} onOpenChange={closeEditProjectModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update project information.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeEditProjectModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
