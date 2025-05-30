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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { useOperatingSystemsStore } from "@/lib/store/operating-systems"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  version: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface EditOsModalProps {
  onUpdated?: () => void
}

export function EditOsModal({ onUpdated }: EditOsModalProps) {
  const { isEditOsModalOpen, closeEditOsModal, selectedOs } = useStore()
  const updateOperatingSystem = useOperatingSystemsStore((state) => state.updateOperatingSystem)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      version: "",
    },
  })

  useEffect(() => {
    if (selectedOs) {
      form.reset({
        name: selectedOs.name || "",
        version: selectedOs.version || "",
      })
    }
  }, [selectedOs, form])

  const onSubmit = async (values: FormValues) => {
    if (!selectedOs) return
    setIsLoading(true)

    try {
      await updateOperatingSystem(selectedOs.id, values)
      toast({
        title: "Operating System updated",
        description: `${values.name} ${values.version ?? ""} has been updated successfully.`,
      })
      closeEditOsModal()
      onUpdated?.()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update operating system",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isEditOsModalOpen} onOpenChange={closeEditOsModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Operating System</DialogTitle>
          <DialogDescription>Update operating system information.</DialogDescription>
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
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeEditOsModal}>
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
