"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Layers } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

import { useServerConfigurationsStore } from "@/lib/store/server_configurations";
import { useStore } from "@/lib/store";

import { EditServerConfigurationModal } from "@/components/server-configurations/edit-server-configuration-modal";
import { DeleteServerConfigurationModal } from "@/components/server-configurations/delete-server-configuration-modal";

export default function ServerConfigurationDetailPage() {
  const { serverConfigurationId } = useParams<{ serverConfigurationId: string }>();
  const router = useRouter();

  const { serverConfigurations, fetchServerConfigurations, loading } = useServerConfigurationsStore();
  const { openEditServerConfigurationModal, openDeleteServerConfigurationModal } = useStore();

  const serverConfiguration = serverConfigurations.find(
    (sc) => sc.id === Number(serverConfigurationId)
  );

  useEffect(() => {
    fetchServerConfigurations();
  }, [fetchServerConfigurations]);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={
          serverConfiguration
            ? `Server Configuration #${serverConfiguration.id}`
            : "Loading..."
        }
        description="Detailed information and linked entities."
        icon={<Layers className="h-6 w-6" />}
        action={
          serverConfiguration && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openEditServerConfigurationModal(serverConfiguration)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => openDeleteServerConfigurationModal(serverConfiguration)}
              >
                Delete
              </Button>
            </div>
          )
        }
      />

      {serverConfiguration ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border rounded-lg shadow p-4 text-sm">
          <div>
            <strong>Status:</strong> {serverConfiguration.status ?? "-"}
          </div>
          <div>
            <strong>Return Code:</strong>{" "}
            {serverConfiguration.return_code !== undefined
              ? serverConfiguration.return_code
              : "-"}
          </div>
          <div>
            <strong>Started At:</strong> {serverConfiguration.started_at ?? "-"}
          </div>
          <div>
            <strong>Finished At:</strong> {serverConfiguration.finished_at ?? "-"}
          </div>
          <div>
            <strong>Source:</strong> {serverConfiguration.source ?? "-"}
          </div>
          <div>
            <strong>Custom Command:</strong> {serverConfiguration.custom_command ?? "-"}
          </div>
          <div>
            <strong>Log Path:</strong> {serverConfiguration.log_path ?? "-"}
          </div>
          <div>
            <strong>Stdout:</strong>
            <pre className="whitespace-pre-wrap break-all">
              {serverConfiguration.stdout ?? "-"}
            </pre>
          </div>
          <div>
            <strong>Stderr:</strong>
            <pre className="whitespace-pre-wrap break-all">
              {serverConfiguration.stderr ?? "-"}
            </pre>
          </div>
          <div>
            <strong>Created At:</strong> {serverConfiguration.created_at}
          </div>
          <div>
            <strong>Updated At:</strong> {serverConfiguration.updated_at ?? "-"}
          </div>
          <div>
            <strong>Created By:</strong>{" "}
            {serverConfiguration.created_by_user?.username ?? "-"}
          </div>
          <div>
            <strong>Updated By:</strong>{" "}
            {serverConfiguration.updated_by_user?.username ?? "-"}
          </div>
          <div>
            <strong>Server:</strong>{" "}
            {serverConfiguration.server
              ? `${serverConfiguration.server.name} (#${serverConfiguration.server.id})`
              : "-"}
          </div>
          <div>
            <strong>Execution Group:</strong>{" "}
            {serverConfiguration.execution_group
              ? `${serverConfiguration.execution_group.name} (#${serverConfiguration.execution_group.id})`
              : "-"}
          </div>
          <div>
            <strong>Configuration:</strong>{" "}
            {serverConfiguration.configuration
              ? `${serverConfiguration.configuration.name} (#${serverConfiguration.configuration.id})`
              : "-"}
          </div>
          <div>
            <strong>Server Template:</strong>{" "}
            {serverConfiguration.server_template
              ? `${serverConfiguration.server_template.template.name} (#${serverConfiguration.server_template.id})`
              : "-"}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading server configuration details...</p>
      )}

      {/* Modals */}
      <EditServerConfigurationModal />
      <DeleteServerConfigurationModal />
    </div>
  );
}
