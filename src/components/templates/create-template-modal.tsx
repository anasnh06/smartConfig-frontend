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
import { operatingSystems, roles, configurations } from "@/lib/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  compatibleOsIds: z.array(z.string()).min(1, "At least one operating system is required"),
  compatibleRoleIds: z.array(z.string()).min(1, "At least one role is required"),
  configurationIds: z.array(z.string()).min(1, "At least one configuration is required"),
})

type FormValues = z.infer<typeof formSchema>

export function CreateTemplateModal() {
  const { isCreateTemplateModalOpen, closeCreateTemplateModal } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      compatibleOsIds: [],
      compatibleRoleIds: [],
      configurationIds: [],
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    closeCreateTemplateModal()
    form.reset()

    toast({
      title: "Template created",
      description: `${values.name} has been created successfully.`,
    })
  }

  return (
    <Dialog open={isCreateTemplateModalOpen} onOpenChange={closeCreateTemplateModal}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create Template</DialogTitle>
          <DialogDescription>Add a new automation template for server provisioning.</DialogDescription>
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
                    <Input placeholder="Web Server Stack" {...field} />
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
                    <Textarea
                      placeholder="Complete web server stack with NGINX and PHP"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Tabs defaultValue="os" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="os">Operating Systems</TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
                <TabsTrigger value="configs">Configurations</TabsTrigger>
              </TabsList>
              <TabsContent value="os" className="border rounded-md p-4 mt-2">
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
              </TabsContent>
              <TabsContent value="roles" className="border rounded-md p-4 mt-2">
                <FormField
                  control={form.control}
                  name="compatibleRoleIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel>Compatible Roles</FormLabel>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {roles.map((role) => (
                          <FormField
                            key={role.id}
                            control={form.control}
                            name="compatibleRoleIds"
                            render={({ field }) => {
                              return (
                                <FormItem key={role.id} className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(role.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, role.id])
                                          : field.onChange(field.value?.filter((value) => value !== role.id))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{role.name}</FormLabel>
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
              </TabsContent>
              <TabsContent value="configs" className="border rounded-md p-4 mt-2">
                <FormField
                  control={form.control}
                  name="configurationIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel>Included Configurations</FormLabel>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {configurations.map((config) => (
                          <FormField
                            key={config.id}
                            control={form.control}
                            name="configurationIds"
                            render={({ field }) => {
                              return (
                                <FormItem key={config.id} className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(config.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, config.id])
                                          : field.onChange(field.value?.filter((value) => value !== config.id))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{config.name}</FormLabel>
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
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeCreateTemplateModal}>
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
