"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Layers, Server, Link } from "lucide-react"

import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"

import { useExecutionGroupsStore } from "@/lib/store/execution_groups"
import { useServerConfigurationsStore } from "@/lib/store/server_configurations"
import { useServerTemplatesStore } from "@/lib/store/server_templates"
import { useStore } from "@/lib/store"

import { getServerConfigurationColumns } from "@/app/server-configurations/columns"
import { getServerTemplateColumns } from "@/app/server-templates/columns"

import { EditExecutionGroupModal } from "@/components/execution-groups/edit-execution-group-modal"
import { DeleteExecutionGroupModal } from "@/components/execution-groups/delete-execution-group-modal"
import { CreateServerConfigurationModal } from "@/components/server-configurations/create-server-configuration-modal"
import { EditServerConfigurationModal } from "@/components/server-configurations/edit-server-configuration-modal"
import { DeleteServerConfigurationModal } from "@/components/server-configurations/delete-server-configuration-modal"
import { EditServerTemplateModal } from "@/components/server-templates/edit-server-template-modal"
import { DeleteServerTemplateModal } from "@/components/server-templates/delete-server-template-modal"

export default function ExecutionGroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const router = useRouter()
  const { openEditExecutionGroupModal, openDeleteExecutionGroupModal, openCreateServerConfigurationModal, setSelectedExecutionGroup } = useStore()

  const { executionGroups, fetchExecutionGroups, loading: loadingGroup } = useExecutionGroupsStore()
  const { serverConfigurations, fetchServerConfigurations, loading: loadingServerConfigs } = useServerConfigurationsStore()
  const { serverTemplates, fetchServerTemplates, loading: loadingServerTemplates } = useServerTemplatesStore()

  const group = executionGroups.find((g) => g.id === Number(groupId))
  const filteredServerConfigs = serverConfigurations.filter(
    (sc) => sc.execution_group.id === Number(groupId)
  )

  const uniqueServerTemplateIds = Array.from(
    new Set(
      filteredServerConfigs
        .filter((sc) => sc.server_template)
        .map((sc) => sc.server_template!.id)
    )
  )
  const filteredServerTemplates = serverTemplates.filter((st) =>
    uniqueServerTemplateIds.includes(st.id)
  )

  useEffect(() => {
    if (group) {
      setSelectedExecutionGroup(group)
    }
  }, [group, setSelectedExecutionGroup])

  useEffect(() => {
    fetchExecutionGroups()
    fetchServerConfigurations()
    fetchServerTemplates()
  }, [fetchExecutionGroups, fetchServerConfigurations, fetchServerTemplates])

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={group ? group.name ?? `Group #${group.id}` : "Loading..."}
        description="Details and linked server configurations / templates."
        icon={<Layers className="h-6 w-6" />}
        action={
          group && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openEditExecutionGroupModal(group)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => openDeleteExecutionGroupModal(group)}
              >
                Delete
              </Button>
            </div>
          )
        }
      />

      {group ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border rounded-lg shadow p-4 text-sm">
          <div><strong>Status:</strong> {group.status ?? "-"}</div>
          <div><strong>Playbook path:</strong> {group.playbook_path ?? "-"}</div>
          <div><strong>Inventory path:</strong> {group.inventory_path ?? "-"}</div>
          <div><strong>Started at:</strong> {group.started_at ?? "-"}</div>
          <div><strong>Finished at:</strong> {group.finished_at ?? "-"}</div>
          <div><strong>Created at:</strong> {group.created_at}</div>
          <div><strong>Updated at:</strong> {group.updated_at ?? "-"}</div>
          <div><strong>Created by:</strong> {group.created_by_user?.username ?? "-"}</div>
          <div><strong>Updated by:</strong> {group.updated_by_user?.username ?? "-"}</div>
        </div>
      ) : (
        <p className="text-gray-500">Loading execution group details...</p>
      )}

      {/* ==== ServerConfigurations Section ==== */}
      <div className="pt-6 space-y-4">
        <PageHeader
          title="Server Configurations"
          description="Server configurations linked to this group."
          icon={<Server className="h-5 w-5" />}
          action={
            <Button onClick={() => openCreateServerConfigurationModal()}>
              Add Server Configuration
            </Button>
          }
        />

        {filteredServerConfigs.length === 0 ? (
          <p className="text-center text-gray-500">
            {loadingServerConfigs ? "Loading configurations..." : "No configurations linked to this group."}
          </p>
        ) : (
          <DataTable
            columns={getServerConfigurationColumns("group")}
            data={filteredServerConfigs}
            isLoading={loadingServerConfigs}
          />
        )}
      </div>

      {/* ==== ServerTemplates Section ==== */}
      <div className="pt-6 space-y-4">
        <PageHeader
          title="Server Templates"
          description="Server templates linked indirectly through configurations."
          icon={<Link className="h-5 w-5" />}
        />

        {filteredServerTemplates.length === 0 ? (
          <p className="text-center text-gray-500">
            {loadingServerTemplates ? "Loading templates..." : "No templates found for this group."}
          </p>
        ) : (
          <DataTable
            columns={getServerTemplateColumns("group")}
            data={filteredServerTemplates}
            isLoading={loadingServerTemplates}
          />
        )}
      </div>

      {/* Modals */}
      <EditExecutionGroupModal />
      <DeleteExecutionGroupModal />
      <CreateServerConfigurationModal />
      <EditServerConfigurationModal />
      <DeleteServerConfigurationModal />
      <EditServerTemplateModal />
      <DeleteServerTemplateModal />
    </div>
  )
}
