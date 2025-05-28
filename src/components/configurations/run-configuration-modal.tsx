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
import { servers, getOperatingSystemById } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  serverIds: z.array(z.string()).min(1, "At least one server is required"),
})

type FormValues = z.infer<typeof formSchema>

export function RunConfigurationModal() {
  const { isRunConfigurationModalOpen, closeRunConfigurationModal, selectedConfiguration } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverIds: [],
    },
  })

  // Filter servers by compatible OS
  const compatibleServers = selectedConfiguration
    ? servers.filter((server) => selectedConfiguration.compatibleOsIds.includes(server.operatingSystemId))
    : []

  const onSubmit = async (values: FormValues) => {
    if (!selectedConfiguration) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    closeRunConfigurationModal()
    form.reset()

    toast({
      title: "Configuration execution started",
      description: `${selectedConfiguration.name} is now running on ${values.serverIds.length} server(s).`,
    })

    // Navigate to executions page
    router.push("/executions")
  }

  return (
    <Dialog open={isRunConfigurationModalOpen} onOpenChange={closeRunConfigurationModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Run Configuration</DialogTitle>
          <DialogDescription>
            {selectedConfiguration
              ? `Select servers to run "${selectedConfiguration.name}" on.`
              : "Select servers to run this configuration on."}
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
                                    <FormLabel className="font-normal">
                                      {server.name} ({server.hostname}) - {os?.name} {os?.version}
                                    </FormLabel>
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
              <Button type="button" variant="outline" onClick={closeRunConfigurationModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || compatibleServers.length === 0}>
                {isLoading ? "Starting..." : "Run Configuration"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
