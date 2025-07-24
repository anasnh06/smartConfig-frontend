"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Layers, ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

import { useServerTemplatesStore } from "@/lib/store/server_templates";
import { useStore } from "@/lib/store";

import { EditServerTemplateModal } from "@/components/server-templates/edit-server-template-modal";
import { DeleteServerTemplateModal } from "@/components/server-templates/delete-server-template-modal";

import { getServerConfigurationColumns } from "@/app/server-configurations/columns";
import { CreateServerConfigurationModal } from "@/components/server-configurations/create-server-configuration-modal";
import { EditServerConfigurationModal } from "@/components/server-configurations/edit-server-configuration-modal";
import { DeleteServerConfigurationModal } from "@/components/server-configurations/delete-server-configuration-modal";

export default function ServerTemplateDetailPage() {
  const { serverTemplateId } = useParams<{ serverTemplateId: string }>();
  const router = useRouter();

  const { serverTemplates, fetchServerTemplates, loading } = useServerTemplatesStore();
  const { openEditServerTemplateModal, openDeleteServerTemplateModal, isEditServerConfigurationModalOpen, isDeleteServerConfigurationModalOpen } = useStore();

  const serverTemplate = serverTemplates.find(
    (st) => st.id === Number(serverTemplateId)
  );

  useEffect(() => {
    fetchServerTemplates();
  }, [fetchServerTemplates]);

  // Rafraîchir après édition ou suppression d'une server configuration
  useEffect(() => {
    if (!isEditServerConfigurationModalOpen && !isDeleteServerConfigurationModalOpen) {
      fetchServerTemplates();
    }
  }, [isEditServerConfigurationModalOpen, isDeleteServerConfigurationModalOpen, fetchServerTemplates]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={
            serverTemplate
              ? `Server Template #${serverTemplate.id}`
              : "Loading..."
          }
          description="Detailed information and linked server configurations."
          icon={<Layers className="h-6 w-6" />}
          action={
            serverTemplate && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditServerTemplateModal(serverTemplate)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => openDeleteServerTemplateModal(serverTemplate)}
                >
                  Delete
                </Button>
              </div>
            )
          }
        />
      </div>

      {serverTemplate ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border rounded-lg shadow p-4 text-sm">
          <div>
            <strong>Status:</strong> {serverTemplate.status ?? "-"}
          </div>
          <div>
            <strong>Created At:</strong> {serverTemplate.created_at ?? "-"}
          </div>
          <div>
            <strong>Updated At:</strong> {serverTemplate.updated_at ?? "-"}
          </div>
          <div>
            <strong>Created By:</strong>{" "}
            {serverTemplate.created_by_user?.username ?? "-"}
          </div>
          <div>
            <strong>Updated By:</strong>{" "}
            {serverTemplate.updated_by_user?.username ?? "-"}
          </div>
          <div>
            <strong>Server:</strong>{" "}
            {serverTemplate.server
              ? `${serverTemplate.server.name} (#${serverTemplate.server.id})`
              : "-"}
          </div>
          <div>
            <strong>Template:</strong>{" "}
            {serverTemplate.template
              ? `${serverTemplate.template.name} (#${serverTemplate.template.id})`
              : "-"}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading server template details...</p>
      )}

      {/* ==== ServerConfigurations Section ==== */}
      <div className="pt-6 space-y-4">
        <PageHeader
          title="Server Configurations"
          description="Server configurations linked to this server template."
        />

        {serverTemplate?.server_configurations?.length === 0 ? (
          <p className="text-center text-gray-500">
            {loading
              ? "Loading configurations..."
              : "No configurations linked to this server template."}
          </p>
        ) : (
          <DataTable
            columns={getServerConfigurationColumns("group")}
            data={serverTemplate?.server_configurations ?? []}
            isLoading={loading}
          />
        )}
      </div>

      {/* Modals */}
      <EditServerTemplateModal />
      <DeleteServerTemplateModal />
      <CreateServerConfigurationModal />
      <EditServerConfigurationModal />
      <DeleteServerConfigurationModal />
    </div>
  );
}
