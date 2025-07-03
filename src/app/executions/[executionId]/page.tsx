"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Layers } from "lucide-react"

import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"

import { useExecutionsStore } from "@/lib/store/executions"
import { useExecutionGroupsStore } from "@/lib/store/execution_groups"
import { useStore } from "@/lib/store"

import { ExecutionGroupColumns } from "@/app/execution-groups/columns"
import { CreateExecutionGroupModal } from "@/components/execution-groups/create-execution-group-modal"
import { EditExecutionGroupModal } from "@/components/execution-groups/edit-execution-group-modal"
import { DeleteExecutionGroupModal } from "@/components/execution-groups/delete-execution-group-modal"

import { EditExecutionModal } from "@/components/executions/edit-execution-modal"
import { DeleteExecutionModal } from "@/components/executions/delete-execution-modal"

export default function ExecutionDetailPage() {
  const { executionId } = useParams<{ executionId: string }>()
  const router = useRouter()

  const {
    executions,
    fetchExecutions,
    removeExecution,
    loading: loadingExecution,
  } = useExecutionsStore()
  const {
    executionGroups,
    fetchExecutionGroups,
    loading: loadingGroups,
  } = useExecutionGroupsStore()
  const {
    openCreateExecutionGroupModal,
    openEditExecutionModal,
    openDeleteExecutionModal,
    setSelectedExecution,
  } = useStore()

  const execution = executions.find((exe) => exe.id === Number(executionId))
  const filteredGroups = executionGroups.filter(
    (group) => group.execution.id === Number(executionId)
  )

  useEffect(() => {
    fetchExecutions()
    fetchExecutionGroups()
  }, [fetchExecutions, fetchExecutionGroups])

  useEffect(() => {
    if (execution) {
      setSelectedExecution(execution)
    }
  }, [execution, setSelectedExecution])

  const handleDelete = async () => {
    if (!execution) return
    await removeExecution(execution.id)
    router.push("/executions")
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={execution ? execution.title ?? `Execution #${execution.id}` : "Loading..."}
        description="Details and groups linked to this execution."
        icon={<Layers className="h-6 w-6" />}
        action={
          execution && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openEditExecutionModal(execution)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => router.push("/executions")}
              >
                Back to Executions
              </Button>
            </div>
          )
        }
      />

      {execution ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border rounded-lg shadow p-4 text-sm">
          <div><strong>Status:</strong> {execution.status ?? "-"}</div>
          <div><strong>Started at:</strong> {execution.started_at ?? "-"}</div>
          <div><strong>Finished at:</strong> {execution.finished_at ?? "-"}</div>
          <div><strong>Created at:</strong> {execution.created_at}</div>
          <div><strong>Updated at:</strong> {execution.updated_at ?? "-"}</div>
          <div><strong>Created by:</strong> {execution.created_by_user?.username ?? "-"}</div>
          <div><strong>Updated by:</strong> {execution.updated_by_user?.username ?? "-"}</div>
        </div>
      ) : (
        <p className="text-gray-500">Loading execution details...</p>
      )}

      <div className="pt-6 space-y-4">
        <PageHeader
          title="Execution Groups"
          description="Groups associated with this execution."
          action={{
            label: "Add Group",
            onClick: () => openCreateExecutionGroupModal(),
          }}
        />

        {filteredGroups.length === 0 ? (
          <p className="text-center text-gray-500">
            {loadingGroups ? "Loading groups..." : "No groups associated with this execution."}
          </p>
        ) : (
          <DataTable
            columns={ExecutionGroupColumns}
            data={filteredGroups}
            isLoading={loadingGroups}
          />
        )}
      </div>

      {/* Modals */}
      <CreateExecutionGroupModal />
      <EditExecutionGroupModal />
      <DeleteExecutionGroupModal />
      <EditExecutionModal />
      <DeleteExecutionModal />
    </div>
  )
}
