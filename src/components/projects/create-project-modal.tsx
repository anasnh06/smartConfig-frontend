"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
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
  name: z.string().min(2, "Project name must be at least 2 characters."),
  description: z.string().min(5, "Description must be at least 5 characters."),
})

type FormValues = z.infer<typeof formSchema>

export function CreateProjectModal() {
  const { isCreateProjectModalOpen, closeCreateProjectModal } = useStore()
  const addProject = useProjectsStore((state) => state.addProject)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      await addProject(values)
      toast({
        title: "✅ Project created",
        description: `Project "${values.name}" has been successfully created.`,
      })
      closeCreateProjectModal()
      form.reset()
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "An error occurred while creating the project.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isCreateProjectModalOpen} onOpenChange={closeCreateProjectModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Add a new infrastructure project to manage related servers and templates.</DialogDescription>
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
                    <Input placeholder="Monitoring System" {...field} />
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
                    <Textarea placeholder="Short description of the project..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeCreateProjectModal}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
