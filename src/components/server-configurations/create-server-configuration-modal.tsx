"use client"

import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useServerConfigurationsStore } from "@/lib/store/server_configurations"
import { useStore } from "@/lib/store"
import { useState } from "react"
import type { CreateServerConfigurationData } from "@/types/entities"

export function CreateServerConfigurationModal() {
  const { isCreateServerConfigurationModalOpen, closeCreateServerConfigurationModal } = useStore()
  const { addServerConfiguration, reloadServerConfigurations } = useServerConfigurationsStore()
  const { register, handleSubmit, reset } = useForm<CreateServerConfigurationData>()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: CreateServerConfigurationData) => {
    setLoading(true)
    try {
      await addServerConfiguration(data)
      await reloadServerConfigurations()
      reset()
      closeCreateServerConfigurationModal()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isCreateServerConfigurationModalOpen} onOpenChange={closeCreateServerConfigurationModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une exécution serveur/configuration</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="number"
            {...register("server_id", { required: true, valueAsNumber: true })}
            placeholder="ID du serveur"
          />
          <Input
            type="number"
            {...register("execution_group_id", { required: true, valueAsNumber: true })}
            placeholder="ID du groupe d'exécution"
          />
          <Input
            type="number"
            {...register("configuration_id", { valueAsNumber: true })}
            placeholder="ID de la configuration (optionnel)"
          />
          <Input
            type="number"
            {...register("server_template_id", { valueAsNumber: true })}
            placeholder="ID du server template (optionnel)"
          />
          <Input {...register("source", { required: true })} placeholder="Source (manual/template/custom)" />
          <Input {...register("custom_command")} placeholder="Commande personnalisée (si source=manual)" />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Création..." : "Créer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
