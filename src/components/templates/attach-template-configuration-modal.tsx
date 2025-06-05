"use client"

import { useEffect, useState } from "react"
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
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

import { useStore } from "@/lib/store"
import { getConfigurationShorts } from "@/lib/api/configuration"
import { bulkAttachConfigurations } from "@/lib/api/template_configuration"

import type { ConfigurationShort } from "@/types/entities"

const configItemSchema = z.object({
  configuration_id: z.number(),
  order: z.union([z.number(), z.literal(null)]),
  comment: z.string().nullable().optional(),
})

const formSchema = z.object({
  configurations: z.array(configItemSchema).min(1, "At least one configuration is required"),
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  onAttached?: () => void
}

export function AttachTemplateConfigurationModal({ onAttached }: Props) {
  const {
    isAttachConfigToTemplateModalOpen,
    closeAttachConfigToTemplateModal,
    selectedTemplate,
  } = useStore()
  const { toast } = useToast()

  const [configs, setConfigs] = useState<ConfigurationShort[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { configurations: [] },
  })

  useEffect(() => {
    getConfigurationShorts().then(setConfigs)
  }, [])

  useEffect(() => {
    if (isAttachConfigToTemplateModalOpen) {
      form.reset({ configurations: [] })
    }
  }, [isAttachConfigToTemplateModalOpen, form])

  const addConfiguration = (id: number) => {
    const current = form.getValues("configurations")
    form.setValue("configurations", [
      ...current,
      { configuration_id: id, order: null, comment: null },
    ])
  }

  const removeConfiguration = (index: number) => {
    const updated = [...form.getValues("configurations")]
    updated.splice(index, 1)
    form.setValue("configurations", updated)
  }

  const removeAllConfigurations = () => {
    form.setValue("configurations", [])
  }

  const onSubmit = async (values: FormValues) => {
    if (!selectedTemplate) return
    setLoading(true)

    try {
      await bulkAttachConfigurations({
        template_id: selectedTemplate.id,
        configurations: values.configurations,
      })

      toast({
        title: "✅ Attached",
        description: `${values.configurations.length} configuration(s) attached.`,
      })
      closeAttachConfigToTemplateModal()
      onAttached?.()
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "Bulk attachment failed",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isAttachConfigToTemplateModalOpen} onOpenChange={closeAttachConfigToTemplateModal}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Attach Configurations</DialogTitle>
          <DialogDescription>
            Add multiple configurations (duplicates allowed), then customize and attach them.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <FormLabel>Available Configurations</FormLabel>
              {configs.map((config) => (
                <div
                  key={config.id}
                  className="flex items-center justify-between border rounded p-2"
                >
                  <span>{config.name}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addConfiguration(config.id)}
                  >
                    + Add
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <FormLabel>Selected Configurations</FormLabel>
                <Button type="button" size="sm" variant="ghost" onClick={removeAllConfigurations}>
                  ✕ Remove All
                </Button>
              </div>

              {form.watch("configurations").map((selected, index) => {
                const cfg = configs.find((c) => c.id === selected.configuration_id)
                return (
                  <div key={index} className="border rounded p-3 bg-gray-50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {cfg?.name || `Config #${selected.configuration_id}`}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeConfiguration(index)}
                      >
                        ✕ Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        min={1}
                        placeholder="Order (optional)"
                        value={selected.order ?? ""}
                        onChange={(e) => {
                          const updated = [...form.getValues("configurations")]
                          const value = parseInt(e.target.value)
                          updated[index].order = isNaN(value) ? null : value
                          form.setValue("configurations", updated)
                        }}
                      />
                      <Input
                        placeholder="Comment (optional)"
                        value={selected.comment ?? ""}
                        onChange={(e) => {
                          const updated = [...form.getValues("configurations")]
                          updated[index].comment = e.target.value || null
                          form.setValue("configurations", updated)
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeAttachConfigToTemplateModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Attaching..." : "Attach Selected"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
