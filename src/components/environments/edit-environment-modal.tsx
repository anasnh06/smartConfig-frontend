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
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { useEnvironmentsStore } from "@/lib/store/environments"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

type FormValues = z.infer<typeof formSchema>

type EditEnvironmentModalProps = {
  onUpdated?: () => void
}

export function EditEnvironmentModal({ onUpdated }: EditEnvironmentModalProps) {
  const { isEditEnvironmentModalOpen, closeEditEnvironmentModal, selectedEnvironment } = useStore()
  const updateEnvironment = useEnvironmentsStore((state) => state.updateEnvironment)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  useEffect(() => {
    if (selectedEnvironment) {
      form.reset({ name: selectedEnvironment.name })
    }
  }, [selectedEnvironment, form])

  const onSubmit = async (values: FormValues) => {
    if (!selectedEnvironment) return
    setIsLoading(true)

    try {
      await updateEnvironment(selectedEnvironment.id, values)
      toast({
        title: "Environment updated",
        description: `${values.name} has been updated successfully.`,
      })
      closeEditEnvironmentModal()
      form.reset()
      onUpdated?.()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update the environment. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isEditEnvironmentModalOpen} onOpenChange={closeEditEnvironmentModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Environment</DialogTitle>
          <DialogDescription>Update environment information.</DialogDescription>
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeEditEnvironmentModal}>
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
