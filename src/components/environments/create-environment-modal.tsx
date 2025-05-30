"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { useStore } from "@/lib/store"
import { useEnvironmentsStore } from "@/lib/store/environments"

const formSchema = z.object({
  name: z.string().min(2, "Environment name must be at least 2 characters."),
})

type FormValues = z.infer<typeof formSchema>

export function CreateEnvironmentModal() {
  const { isCreateEnvironmentModalOpen, closeCreateEnvironmentModal } = useStore()
  const addEnvironment = useEnvironmentsStore((state) => state.addEnvironment)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      await addEnvironment(values)
      toast({
        title: "✅ Environment created",
        description: `Environment "${values.name}" has been successfully created.`,
      })
      closeCreateEnvironmentModal()
      form.reset()
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "An error occurred while creating the environment.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isCreateEnvironmentModalOpen} onOpenChange={closeCreateEnvironmentModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Environment</DialogTitle>
          <DialogDescription>
            Add a new deployment environment to your infrastructure.
          </DialogDescription>
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
                    <Input placeholder="Production" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeCreateEnvironmentModal}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
