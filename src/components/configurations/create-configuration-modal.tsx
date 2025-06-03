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
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

import { useStore } from "@/lib/store"
import { useOperatingSystemsStore } from "@/lib/store/operating-systems"
import { useConfigurationsStore } from "@/lib/store/configurations"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  command: z.string().min(3, "Command must be at least 3 characters"),
  description: z.string().optional(),
  operating_system_ids: z.array(z.number()).min(1, "Select at least one OS"),
})

type FormValues = z.infer<typeof formSchema>

export function CreateConfigurationModal() {
  const { isCreateConfigurationModalOpen, closeCreateConfigurationModal } = useStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const { operatingSystems, fetchOperatingSystems } = useOperatingSystemsStore()
  const { addConfiguration } = useConfigurationsStore()

  useEffect(() => {
    fetchOperatingSystems()
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      command: "",
      description: "",
      operating_system_ids: [],
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    try {
      await addConfiguration(values)
      toast({ title: "✅ Configuration created", description: `${values.name} added successfully.` })
      form.reset()
      closeCreateConfigurationModal()
    } catch (error: any) {
      toast({ title: "❌ Error", description: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isCreateConfigurationModalOpen} onOpenChange={closeCreateConfigurationModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Configuration</DialogTitle>
          <DialogDescription>Add a new automation configuration for selected OS.</DialogDescription>
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
              name="command"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Command</FormLabel>
                  <FormControl>
                    <Textarea placeholder="ansible-playbook nginx.yml" className="min-h-[80px]" {...field} />
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
                    <Textarea placeholder="Optional description" className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="operating_system_ids"
              render={() => (
                <FormItem>
                  <FormLabel>Compatible OS</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {operatingSystems.map((os) => (
                      <FormField
                        key={os.id}
                        control={form.control}
                        name="operating_system_ids"
                        render={({ field }) => (
                          <FormItem key={os.id} className="flex flex-row items-start space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value.includes(os.id)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, os.id]
                                    : field.value.filter((id) => id !== os.id)
                                  field.onChange(newValue)
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{os.name} {os.version}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeCreateConfigurationModal}>Cancel</Button>
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
