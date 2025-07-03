"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useServerConfigurationsStore } from "@/lib/store/server_configurations";
import { useStore } from "@/lib/store";
import { useServersStore } from "@/lib/store/servers";
import { useConfigurationsStore } from "@/lib/store/configurations";
import { useServerTemplatesStore } from "@/lib/store/server_templates";
import type { CreateServerConfigurationData } from "@/types/entities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export function CreateServerConfigurationModal() {
  const { isCreateServerConfigurationModalOpen, closeCreateServerConfigurationModal, selectedExecutionGroup } = useStore();
  const { addServerConfiguration, reloadServerConfigurations } = useServerConfigurationsStore();
  const { servers, fetchServers } = useServersStore();
  const { configurations, fetchConfigurations } = useConfigurationsStore();
  const { serverTemplates, fetchServerTemplates } = useServerTemplatesStore();

  const { register, handleSubmit, reset, setValue } = useForm<CreateServerConfigurationData>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServers();
    fetchConfigurations();
    fetchServerTemplates();
  }, [fetchServers, fetchConfigurations, fetchServerTemplates]);

  useEffect(() => {
    if (isCreateServerConfigurationModalOpen && selectedExecutionGroup?.id) {
      setValue("execution_group_id", selectedExecutionGroup.id);
    }
    if (!isCreateServerConfigurationModalOpen) {
      reset();
    }
  }, [isCreateServerConfigurationModalOpen, selectedExecutionGroup, setValue, reset]);

  const onSubmit = async (data: CreateServerConfigurationData) => {
    if (!data.server_id) {
      alert("Veuillez sélectionner un serveur.");
      return;
    }
    if (!data.execution_group_id) {
      alert("Aucun groupe d'exécution n'est sélectionné.");
      return;
    }
    setLoading(true);
    try {
      await addServerConfiguration({
        ...data,
        started_at: data.started_at ? new Date(data.started_at).toISOString() : undefined,
        finished_at: data.finished_at ? new Date(data.finished_at).toISOString() : undefined,
      });
      await reloadServerConfigurations();
      reset();
      closeCreateServerConfigurationModal();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création. Vérifiez vos champs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isCreateServerConfigurationModalOpen} onOpenChange={closeCreateServerConfigurationModal}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une exécution serveur/configuration</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

          {/* Server Selection */}
          <Select onValueChange={(value) => setValue("server_id", parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un serveur" />
            </SelectTrigger>
            <SelectContent>
              {servers.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.name} ({s.ip_address ?? "IP inconnue"})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Configuration Selection */}
          <Select onValueChange={(value) => setValue("configuration_id", parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une configuration (optionnel)" />
            </SelectTrigger>
            <SelectContent>
              {configurations.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name} (#{c.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Server Template Selection */}
          <Select onValueChange={(value) => setValue("server_template_id", parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un server template (optionnel)" />
            </SelectTrigger>
            <SelectContent>
              {serverTemplates.map((st) => (
                <SelectItem key={st.id} value={st.id.toString()}>
                  {st.template.name} (ServerTemplate #{st.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Selection */}
          <Select onValueChange={(value) => setValue("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          {/* Source Selection */}
          <Select onValueChange={(value) => setValue("source", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Source (manual/template/custom)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="template">Template</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          <Input {...register("custom_command")} placeholder="Commande personnalisée (si source=custom)" />
          <Input {...register("log_path")} placeholder="Chemin du fichier log (optionnel)" />
          <Input {...register("stdout")} placeholder="Sortie standard (optionnel)" />
          <Input {...register("stderr")} placeholder="Sortie erreur (optionnel)" />
          <Input
            type="number"
            {...register("return_code", { valueAsNumber: true })}
            placeholder="Code retour (optionnel)"
          />

          {/* Datetime fields */}
          <Input
            type="datetime-local"
            {...register("started_at")}
            placeholder="Démarré à (optionnel)"
          />
          <Input
            type="datetime-local"
            {...register("finished_at")}
            placeholder="Terminé à (optionnel)"
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Création..." : "Créer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
