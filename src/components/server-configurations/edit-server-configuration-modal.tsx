"use client"

import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useServerConfigurationsStore } from "@/lib/store/server_configurations"
import { useStore } from "@/lib/store"
import { useEffect, useState } from "react"
import type { UpdateServerConfigurationData } from "@/types/entities"

export function EditServerConfigurationModal() {
  const { isEditServerConfigurationModalOpen, closeEditServerConfigurationModal, selectedServerConfiguration } = useStore()
  const { updateServerConfiguration, reloadServerConfigurations } = useServerConfigurationsStore()
  const { register, handleSubmit, reset, setValue } = useForm<UpdateServerConfigurationData>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedServerConfiguration) {
      setValue("server_id", selectedServerConfiguration.server.id)
      setValue("execution_group_id", selectedServerConfiguration.execution_group.id)
      if (selectedServerConfiguration.configuration) {
        setValue("configuration_id", selectedServerConfiguration.configuration.id)
      }
      if (selectedServerConfiguration.server_template) {
        setValue("server_template_id", selectedServerConfiguration.server_template.id)
      }
      setValue("status", selectedServerConfiguration.status ?? "")
      setValue("source", selectedServerConfiguration.source ?? "")
      setValue("custom_command", selectedServerConfiguration.custom_command ?? "")
    }
  }, [selectedServerConfiguration, setValue])

  const onSubmit = async (data: UpdateServerConfigurationData) => {
    if (!selectedServerConfiguration?.id) return
    setLoading(true)
    try {
      await updateServerConfiguration(selectedServerConfiguration.id, data)
      await reloadServerConfigurations()
      reset()
      closeEditServerConfigurationModal()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isEditServerConfigurationModalOpen} onOpenChange={closeEditServerConfigurationModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'exécution serveur/configuration</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="number"
            {...register("server_id", { valueAsNumber: true })}
            placeholder="ID du serveur"
          />
          <Input
            type="number"
            {...register("execution_group_id", { valueAsNumber: true })}
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
          <Input {...register("status")} placeholder="Status (pending/running/success/failed)" />
          <Input {...register("source")} placeholder="Source (manual/template/custom)" />
          <Input {...register("custom_command")} placeholder="Commande personnalisée (si source=manual)" />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Modification..." : "Modifier"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
