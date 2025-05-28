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
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { servers, getOperatingSystemById, getRoleById } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  serverIds: z.array(z.string()).min(1, "At least one server is required"),
})

type FormValues = z.infer<typeof formSchema>

export function RunTemplateModal() {
  const { isRunTemplateModalOpen, closeRunTemplateModal, selectedTemplate } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverIds: [],
    },
  })

  // Filter servers by compatible OS and roles
  const compatibleServers = selectedTemplate
    ? servers.filter((server) => {
        const osCompatible = selectedTemplate.compatibleOsIds.includes(server.operatingSystemId)
        const roleCompatible = server.roleIds.some((roleId) => selectedTemplate.compatibleRoleIds.includes(roleId))
        return osCompatible && roleCompatible
      })
    : []

  const onSubmit = async (values: FormValues) => {
    if (!selectedTemplate) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    closeRunTemplateModal()
    form.reset()

    toast({
      title: "Template execution started",
      description: `${selectedTemplate.name} is now running on ${values.serverIds.length} server(s).`,
    })

    // Navigate to executions page
    router.push("/executions")
  }

  return (
    <Dialog open={isRunTemplateModalOpen} onOpenChange={closeRunTemplateModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Run Template</DialogTitle>
          <DialogDescription>
            {selectedTemplate
              ? `Select servers to run "${selectedTemplate.name}" on.`
              : "Select servers to run this template on."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serverIds"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel>Target Servers</FormLabel>
                  </div>
                  {compatibleServers.length > 0 ? (
                    <div className="max-h-[300px] overflow-y-auto border rounded-md p-2">
                      <div className="grid gap-2">
                        {compatibleServers.map((server) => {
                          const os = getOperatingSystemById(server.operatingSystemId)
                          const serverRoles = server.roleIds.map((id) => getRoleById(id)).filter(Boolean)
                          return (
                            <FormField
                              key={server.id}
                              control={form.control}
                              name="serverIds"
                              render={({ field }) => {
                                return (
                                  <FormItem key={server.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(server.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, server.id])
                                            : field.onChange(field.value?.filter((value) => value !== server.id))
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1">
                                      <FormLabel className="font-normal">
                                        {server.name} ({server.hostname})
                                      </FormLabel>
                                      <div className="text-xs text-muted-foreground">
                                        {os?.name} {os?.version} -{serverRoles.map((role) => role?.name).join(", ")}
                                      </div>
                                    </div>
                                  </FormItem>
                                )
                              }}
                            />
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4 border rounded-md">
                      <p className="text-muted-foreground">No compatible servers found.</p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeRunTemplateModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || compatibleServers.length === 0}>
                {isLoading ? "Starting..." : "Run Template"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
