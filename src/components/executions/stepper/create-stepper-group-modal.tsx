"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useStore } from "@/lib/store"
import { MultiSelect } from "@/components/shared/multi-select"
import { FormMultiSelect } from "@/components/shared/form-multi-select"
import { StepGroupElementForm } from "./step-group-element-form"

const groupSchema = z.object({
  servers: z.array(z.number()).min(1, "Sélectionnez au moins un serveur."),
  elements: z
    .array(
      z.object({
        type: z.enum(["template", "configuration", "manual"]),
        id: z.number().optional(),
        command: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        order: z.number().optional(),
      })
    )
    .min(1, "Ajoutez au moins un élément."),
  comment: z.string().optional(),
})

export function CreateStepperGroupModal() {
  const {
    isCreateExecutionGroupModalOpen,
    closeCreateExecutionGroupModal,
    addDraftGroup,
  } = useStore()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof groupSchema>>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      servers: [],
      elements: [],
      comment: "",
    },
  })

  const onSubmit = (data: z.infer<typeof groupSchema>) => {
    addDraftGroup(data)
    form.reset()
    toast({ title: "✅ Groupe ajouté au stepper" })
    closeCreateExecutionGroupModal()
  }

  return (
    <Dialog open={isCreateExecutionGroupModalOpen} onOpenChange={closeCreateExecutionGroupModal}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>Ajouter un groupe d'exécution</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Sélection des serveurs */}
          <FormMultiSelect
            label="Serveurs"
            name="servers"
            control={form.control}
            placeholder="Sélectionnez les serveurs"
            options={[]} // à remplacer plus tard
        />

          <StepGroupElementForm />

          <div className="text-sm text-muted-foreground">
            Gestion des éléments à venir ici (templates, configurations, commandes)
          </div>

          <Input
            placeholder="Commentaire (optionnel)"
            {...form.register("comment")}
          />

          <div className="flex justify-end">
            <Button type="submit">Ajouter le groupe</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
