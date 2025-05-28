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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  version: z.string().min(1, "Version is required"),
  architecture: z.string().min(1, "Architecture is required"),
})

type FormValues = z.infer<typeof formSchema>

export function EditOsModal() {
  const { isEditOsModalOpen, closeEditOsModal, selectedOs } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      version: "",
      architecture: "",
    },
  })

  useEffect(() => {
    if (selectedOs) {
      form.reset({
        name: selectedOs.name,
        version: selectedOs.version,
        architecture: selectedOs.architecture,
      })
    }
  }, [selectedOs, form])

  const onSubmit = async (values: FormValues) => {
    if (!selectedOs) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    closeEditOsModal()

    toast({
      title: "Operating System updated",
      description: `${values.name} ${values.version} has been updated successfully.`,
    })
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
            <FormField
              control={form.control}
              name="architecture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Architecture</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an architecture" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="x86_64">x86_64</SelectItem>
                      <SelectItem value="aarch64">aarch64</SelectItem>
                      <SelectItem value="armv7">armv7</SelectItem>
                      <SelectItem value="i386">i386</SelectItem>
                    </SelectContent>
                  </Select>
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
