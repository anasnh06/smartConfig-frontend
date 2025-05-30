"use client"

import { useState } from "react"
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
import { useOperatingSystemsStore } from "@/lib/store/operating-systems"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  version: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function CreateOsModal() {
  const { isCreateOsModalOpen, closeCreateOsModal } = useStore()
  const addOperatingSystem = useOperatingSystemsStore((state) => state.addOperatingSystem)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      version: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    try {
      await addOperatingSystem(values)
      toast({
        title: "Operating System created",
        description: `${values.name} ${values.version ?? ""} has been added successfully.`,
      })
      closeCreateOsModal()
      form.reset()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create operating system",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isCreateOsModalOpen} onOpenChange={closeCreateOsModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Operating System</DialogTitle>
          <DialogDescription>Add a new OS to your infrastructure.</DialogDescription>
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
                    <Input placeholder="Ubuntu" {...field} />
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
                    <Input placeholder="22.04 LTS" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeCreateOsModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
