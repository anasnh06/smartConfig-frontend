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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { operatingSystems } from "@/lib/mock-data"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  compatibleOsIds: z.array(z.string()).min(1, "At least one operating system is required"),
})

type FormValues = z.infer<typeof formSchema>

export function CreateConfigurationModal() {
  const { isCreateConfigurationModalOpen, closeCreateConfigurationModal } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      compatibleOsIds: [],
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    closeCreateConfigurationModal()
    form.reset()

    toast({
      title: "Configuration created",
      description: `${values.name} has been created successfully.`,
    })
  }

  return (
    <Dialog open={isCreateConfigurationModalOpen} onOpenChange={closeCreateConfigurationModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Configuration</DialogTitle>
          <DialogDescription>Add a new automation configuration.</DialogDescription>
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
                    <Input placeholder="NGINX Setup" {...field} />
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
                    <Textarea placeholder="Basic NGINX web server configuration" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="compatibleOsIds"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel>Compatible Operating Systems</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {operatingSystems.map((os) => (
                      <FormField
                        key={os.id}
                        control={form.control}
                        name="compatibleOsIds"
                        render={({ field }) => {
                          return (
                            <FormItem key={os.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(os.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, os.id])
                                      : field.onChange(field.value?.filter((value) => value !== os.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {os.name} {os.version}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeCreateConfigurationModal}>
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
