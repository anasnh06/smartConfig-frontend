"use client"

import { useEffect } from "react"
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
import { useToast } from "@/components/ui/use-toast"

import { useStore } from "@/lib/store"
import { updateTemplateConfiguration } from "@/lib/api/template_configuration"

const rawSchema = z.object({
  order: z
    .preprocess((val) => {
      if (val === "" || val === null || val === undefined) return null
      const parsed = Number(val)
      return isNaN(parsed) ? null : parsed
    }, z.number().nullable().refine((val) => val === null || val > 0, {
      message: "Order must be a positive number.",
    })),
  comment: z.string().nullable().optional(), // <-- Ajouté pour gérer le champ comment
})

type FormValues = {
  order: number | null
  comment?: string | null
}

type Props = {
  onUpdated?: () => void
}

export function EditTemplateConfigurationModal({ onUpdated }: Props) {
  const {
    isEditTemplateConfigurationModalOpen,
    closeEditTemplateConfigurationModal,
    selectedTemplateConfiguration,
  } = useStore()
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(rawSchema) as any, // 👈 seule solution fiable ici
    defaultValues: {
      order: null,
      comment: null,
    },
  })

  useEffect(() => {
    if (selectedTemplateConfiguration) {
      form.reset({
        order: selectedTemplateConfiguration.order ?? null,
        comment: selectedTemplateConfiguration.comment ?? "",
      })
    }
  }, [selectedTemplateConfiguration, form])

  const onSubmit = async (values: FormValues) => {
    if (!selectedTemplateConfiguration) return

    try {
      await updateTemplateConfiguration(selectedTemplateConfiguration.id, {
        order: values.order,
        comment: values.comment,
      })

      toast({
        title: "✅ Updated",
        description: "The configuration link has been updated.",
      })

      closeEditTemplateConfigurationModal()
      onUpdated?.()
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "Update failed.",
      })
    }
  }

  return (
    <Dialog open={isEditTemplateConfigurationModalOpen} onOpenChange={closeEditTemplateConfigurationModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Configuration Link</DialogTitle>
          <DialogDescription>Update the order and comment for this configuration.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeEditTemplateConfigurationModal}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
