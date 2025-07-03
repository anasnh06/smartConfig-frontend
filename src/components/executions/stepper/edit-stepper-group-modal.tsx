"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { FormMultiSelect } from "@/components/shared/form-multi-select"
import { StepGroupElementForm } from "@/components/executions/stepper/step-group-element-form"
import { useToast } from "@/components/ui/use-toast"

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

export function EditStepperGroupModal() {
  const {
    isEditExecutionGroupModalOpen,
    closeEditExecutionGroupModal,
    draftExecutionGroups,
    selectedDraftGroupIndex,
    setSelectedDraftGroupIndex,
  } = useStore()

  const { toast } = useToast()

  const defaultValues = draftExecutionGroups[selectedDraftGroupIndex ?? 0] ?? {
    servers: [],
    elements: [],
    comment: "",
  }

  const form = useForm<z.infer<typeof groupSchema>>({
    resolver: zodResolver(groupSchema),
    defaultValues,
  })

  const onSubmit = (data: z.infer<typeof groupSchema>) => {
    if (selectedDraftGroupIndex !== null) {
      draftExecutionGroups[selectedDraftGroupIndex] = data
    }
    toast({ title: "✅ Groupe modifié avec succès" })
    closeEditExecutionGroupModal()
    setSelectedDraftGroupIndex(null)
  }

  return (
    <Dialog open={isEditExecutionGroupModalOpen} onOpenChange={closeEditExecutionGroupModal}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>Modifier le groupe d'exécution</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Sélection des serveurs */}
          <FormMultiSelect
            label="Serveurs"
            name="servers"
            control={form.control}
            placeholder="Sélectionnez les serveurs"
            options={[]} // à remplir dynamiquement plus tard
          />

          <StepGroupElementForm />

          <Input
            placeholder="Commentaire (optionnel)"
            {...form.register("comment")}
          />

          <div className="flex justify-end">
            <Button type="submit">Enregistrer les modifications</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
