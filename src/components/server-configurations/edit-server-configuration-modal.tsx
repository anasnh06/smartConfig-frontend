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
import type { UpdateServerConfigurationData } from "@/types/entities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export function EditServerConfigurationModal() {
  const { isEditServerConfigurationModalOpen, closeEditServerConfigurationModal, selectedServerConfiguration } = useStore();
  const { updateServerConfiguration, reloadServerConfigurations } = useServerConfigurationsStore();
  const { servers, fetchServers } = useServersStore();
  const { configurations, fetchConfigurations } = useConfigurationsStore();
  const { serverTemplates, fetchServerTemplates } = useServerTemplatesStore();

  const { register, handleSubmit, reset, setValue, watch } = useForm<UpdateServerConfigurationData>();
  const [loading, setLoading] = useState(false);

  const serverId = watch("server_id");
  const configurationId = watch("configuration_id");
  const serverTemplateId = watch("server_template_id");
  const status = watch("status");
  const source = watch("source");

  useEffect(() => {
    fetchServers();
    fetchConfigurations();
    fetchServerTemplates();
  }, [fetchServers, fetchConfigurations, fetchServerTemplates]);

  useEffect(() => {
    if (selectedServerConfiguration) {
      setValue("status", selectedServerConfiguration.status ?? "");
      setValue("return_code", selectedServerConfiguration.return_code ?? undefined);
      setValue("stdout", selectedServerConfiguration.stdout ?? "");
      setValue("stderr", selectedServerConfiguration.stderr ?? "");
      setValue("log_path", selectedServerConfiguration.log_path ?? "");
      setValue("started_at", selectedServerConfiguration.started_at ? new Date(selectedServerConfiguration.started_at).toISOString().slice(0, 16) : "");
      setValue("finished_at", selectedServerConfiguration.finished_at ? new Date(selectedServerConfiguration.finished_at).toISOString().slice(0, 16) : "");
      setValue("source", selectedServerConfiguration.source ?? "");
      setValue("custom_command", selectedServerConfiguration.custom_command ?? "");
      setValue("server_id", selectedServerConfiguration.server?.id ?? undefined);
      setValue("execution_group_id", selectedServerConfiguration.execution_group?.id ?? undefined);
      setValue("configuration_id", selectedServerConfiguration.configuration?.id ?? undefined);
      setValue("server_template_id", selectedServerConfiguration.server_template?.id ?? undefined);
    }
    if (!isEditServerConfigurationModalOpen) {
      reset();
    }
  }, [isEditServerConfigurationModalOpen, selectedServerConfiguration, setValue, reset]);

  const onSubmit = async (data: UpdateServerConfigurationData) => {
    if (!selectedServerConfiguration?.id) return;
    setLoading(true);
    try {
      await updateServerConfiguration(selectedServerConfiguration.id, {
        ...data,
        started_at: data.started_at ? new Date(data.started_at).toISOString() : undefined,
        finished_at: data.finished_at ? new Date(data.finished_at).toISOString() : undefined,
      });
      await reloadServerConfigurations();
      reset();
      closeEditServerConfigurationModal();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la modification. Vérifiez vos champs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isEditServerConfigurationModalOpen} onOpenChange={closeEditServerConfigurationModal}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'exécution serveur/configuration</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

          {/* Server Selection */}
          <Select
            onValueChange={(value) => setValue("server_id", parseInt(value))}
            value={serverId !== undefined ? serverId.toString() : ""}
          >
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
          <Select
            onValueChange={(value) => setValue("configuration_id", parseInt(value))}
            value={configurationId !== undefined ? configurationId.toString() : ""}
          >
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
          <Select
            onValueChange={(value) => setValue("server_template_id", parseInt(value))}
            value={serverTemplateId !== undefined ? serverTemplateId.toString() : ""}
          >
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
          <Select
            onValueChange={(value) => setValue("status", value)}
            value={status ?? ""}
          >
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
          <Select
            onValueChange={(value) => setValue("source", value)}
            value={source ?? ""}
          >
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
            {loading ? "Modification..." : "Modifier"}
          </Button>
        </form>
      </DialogContent>  
    </Dialog>
  );
}
