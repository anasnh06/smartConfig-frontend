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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

import { useStore } from "@/lib/store"
import { createTemplate } from "@/lib/api/template"
import { bulkAttachConfigurations } from "@/lib/api/template_configuration"
import { getOperatingSystemShorts } from "@/lib/api/operating-system"
import { getRoleShorts } from "@/lib/api/role"
import { getConfigurationShorts } from "@/lib/api/configuration"

import type { OperatingSystemShort, RoleShort, ConfigurationShort } from "@/types/entities"

const formSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  role_id: z.number(),
  operating_system_ids: z.array(z.number()).min(1),
  configurations: z.array(
    z.object({
      configuration_id: z.number(),
      order: z.number().nullable().optional().refine(
        (val) => val == null || val > 0,
        { message: "Order must be greater than 0 if provided." }
      ),
      comment: z.string().nullable().optional(),
    })
  ).optional(),
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  onCreated?: () => void
}

export function CreateTemplateModal({ onCreated }: Props) {
  const { isCreateTemplateModalOpen, closeCreateTemplateModal } = useStore()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [roles, setRoles] = useState<RoleShort[]>([])
  const [oses, setOses] = useState<OperatingSystemShort[]>([])
  const [configs, setConfigs] = useState<ConfigurationShort[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      role_id: undefined as any,
      operating_system_ids: [],
      configurations: [],
    },
  })

  useEffect(() => {
    getRoleShorts().then(setRoles)
    getOperatingSystemShorts().then(setOses)
    getConfigurationShorts().then(setConfigs)
  }, [])

  const addConfig = (id: number) => {
    const current = form.getValues("configurations") || []
    form.setValue("configurations", [...current, { configuration_id: id, order: null, comment: null }])
  }

  const removeConfig = (index: number) => {
    const updated = [...(form.getValues("configurations") || [])]
    updated.splice(index, 1)
    form.setValue("configurations", updated)
  }

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    try {
      const template = await createTemplate({
        name: values.name,
        description: values.description,
        role_id: values.role_id,
        operating_system_ids: values.operating_system_ids,
      })

      if (values.configurations?.length) {
        await bulkAttachConfigurations({
          template_id: template.id,
          configurations: values.configurations,
        })
      }

      toast({
        title: "✅ Template created",
        description: `"${values.name}" has been created successfully.`,
      })
      onCreated?.()
      closeCreateTemplateModal()
      form.reset()
    } catch (error: any) {
      toast({ title: "❌ Error", description: error.message || "Failed to create template" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isCreateTemplateModalOpen} onOpenChange={closeCreateTemplateModal}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Template</DialogTitle>
          <DialogDescription>Define a template and assign configurations.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="role_id" render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <select
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="w-full rounded border px-3 py-2 text-sm max-h-40 overflow-y-auto"
                >
                  <option value="">-- Select Role --</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <FormMessage />
              </FormItem>
            )} />

            <Tabs defaultValue="os" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="os">Operating Systems</TabsTrigger>
                <TabsTrigger value="configs">Configurations</TabsTrigger>
              </TabsList>

              <TabsContent value="os" className="border rounded-md p-4 mt-2">
                <FormField
                  control={form.control}
                  name="operating_system_ids"
                  render={() => (
                    <FormItem>
                      <FormLabel>Compatible OS</FormLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {oses.map((os) => (
                          <FormField
                            key={os.id}
                            control={form.control}
                            name="operating_system_ids"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value.includes(os.id)}
                                    onCheckedChange={(checked) =>
                                      checked
                                        ? field.onChange([...field.value, os.id])
                                        : field.onChange(field.value.filter((v) => v !== os.id))
                                    }
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
              </TabsContent>

              <TabsContent value="configs" className="border rounded-md p-4 mt-2">
                <div className="space-y-2">
                  <FormLabel>Available Configurations</FormLabel>
                  {configs.map((config) => (
                    <div key={config.id} className="flex items-center justify-between border rounded p-2">
                      <span>
                        {config.name}
                        {config.operating_systems?.length
                          ? ` (${config.operating_systems.map((os) => `${os.name} ${os.version}`).join(", ")})`
                          : ""}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => addConfig(config.id)}
                      >
                        + Add
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-3">
                  <FormLabel>Selected Configurations</FormLabel>
                    <div className="flex justify-end mb-2">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => form.setValue("configurations", [])}
                    >
                      ✕ Remove All
                    </Button>
                    </div>
                  {form.watch("configurations")?.map((selected, index) => {
                    const cfg = configs.find((c) => c.id === selected.configuration_id)
                    return (
                      <div key={index} className="border rounded p-3 bg-gray-50 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {cfg?.name || `Config #${selected.configuration_id}`}
                            {cfg?.operating_systems?.length
                              ? ` (${cfg.operating_systems.map((os) => `${os.name} ${os.version}`).join(", ")})`
                              : ""}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeConfig(index)}
                          >
                            ✕ Remove
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            placeholder="Order (optional)"
                            min={1}
                            value={selected.order ?? ""}
                            onChange={(e) => {
                              const value = Number(e.target.value)
                              const updated = [...form.getValues("configurations")!]
                              updated[index].order = value > 0 ? value : null
                              form.setValue("configurations", updated)
                            }}
                          />
                          <Input
                            placeholder="Comment (optional)"
                            value={selected.comment ?? ""}
                            onChange={(e) => {
                              const updated = [...form.getValues("configurations")!]
                              updated[index].comment = e.target.value || null
                              form.setValue("configurations", updated)
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeCreateTemplateModal}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? "Creating..." : "Create Template"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
