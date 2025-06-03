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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"

import { useStore } from "@/lib/store"
import { useConfigurationsStore } from "@/lib/store/configurations"
import { useOperatingSystemsStore } from "@/lib/store/operating-systems"

const formSchema = z.object({
  name: z.string().min(2),
  command: z.string().min(1, "Command is required"),
  description: z.string().optional(),
  compatibleOsIds: z.array(z.number()).min(1),
})

type FormValues = z.infer<typeof formSchema>

interface EditConfigurationModalProps {
  onUpdated?: () => Promise<void>
}

export function EditConfigurationModal({ onUpdated }: EditConfigurationModalProps) {
  const { isEditConfigurationModalOpen, closeEditConfigurationModal, selectedConfiguration } = useStore()
  const { updateConfiguration } = useConfigurationsStore()
  const { operatingSystems } = useOperatingSystemsStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      command: "",
      description: "",
      compatibleOsIds: [],
    },
  })

  useEffect(() => {
    if (selectedConfiguration) {
      form.reset({
        name: selectedConfiguration.name,
        command: selectedConfiguration.command,
        description: selectedConfiguration.description || "",
        compatibleOsIds: selectedConfiguration.operating_systems.map((os) => os.id),
      })
    }
  }, [selectedConfiguration, form])

  const onSubmit = async (values: FormValues) => {
    if (!selectedConfiguration) return
    setIsLoading(true)

    try {
      await updateConfiguration(selectedConfiguration.id, {
        name: values.name,
        command: values.command,
        description: values.description,
        operating_system_ids: values.compatibleOsIds,
      })

      toast({
        title: "✅ Configuration updated",
        description: `"${values.name}" has been updated successfully.`,
      })

      closeEditConfigurationModal()
      if (onUpdated) await onUpdated()
    } catch (error: any) {
      toast({
        title: "❌ Update failed",
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isEditConfigurationModalOpen} onOpenChange={closeEditConfigurationModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Configuration</DialogTitle>
          <DialogDescription>Update configuration settings.</DialogDescription>
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
              name="command"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Command</FormLabel>
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

            <FormField
              control={form.control}
              name="compatibleOsIds"
              render={() => (
                <FormItem>
                  <FormLabel>Compatible Operating Systems</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {operatingSystems.map((os) => (
                      <FormField
                        key={os.id}
                        control={form.control}
                        name="compatibleOsIds"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(os.id)}
                                onCheckedChange={(checked) =>
                                  checked
                                    ? field.onChange([...field.value, os.id])
                                    : field.onChange(field.value?.filter((v) => v !== os.id))
                                }
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {os.name} {os.version}
                            </FormLabel>
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
              <Button type="button" variant="outline" onClick={closeEditConfigurationModal}>
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
