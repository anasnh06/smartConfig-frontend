"use client"

import { useEffect, useState } from "react"
import { PlayCircle } from "lucide-react"

import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"

import { useExecutionsStore } from "@/lib/store/executions"
import { useStore } from "@/lib/store"
import { useStepperStore } from "@/lib/store/stepper"

import { ExecutionColumns } from "./columns"

import { CreateExecutionModal } from "@/components/executions/create-execution-modal"
import { EditExecutionModal } from "@/components/executions/edit-execution-modal"
import { DeleteExecutionModal } from "@/components/executions/delete-execution-modal"
import { StepperExecutionModal } from "@/components/executions/stepper/stepper-execution-modal"

export default function ExecutionsPage() {
  const { executions, fetchExecutions, loading } = useExecutionsStore()
  const { openCreateExecutionModal } = useStore()
  const { openStepperExecutionModal } = useStepperStore()
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchExecutions()
  }, [fetchExecutions])

  // Simple search by title
  const filteredExecutions = executions.filter((execution) => {
    const lowerSearch = search.trim().toLowerCase()
    return (
      !lowerSearch ||
      (execution.title && execution.title.toLowerCase().includes(lowerSearch))
    )
  })

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Executions"
        description="List of all executions with their status and timestamps."
        icon={<PlayCircle className="h-6 w-6" />}
      />

      {/* Boutons d'action */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={openCreateExecutionModal}>➕ Add Execution</Button>
        <Button onClick={openStepperExecutionModal}>🚀 Run via Stepper</Button>
      </div>

      {/* Search bar */}
      <div className="mt-4 w-full sm:w-72">
        <input
          type="text"
          placeholder="Search executions by title..."
          className="pl-3 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredExecutions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <svg
            className="w-16 h-16 mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-lg font-semibold">
            {executions.length === 0
              ? "No executions found in the database."
              : "No executions match your search."}
          </span>
        </div>
      ) : (
        <DataTable
          columns={ExecutionColumns}
          data={filteredExecutions}
          isLoading={loading}
        />
      )}

      {/* Modales CRUD classiques */}
      <CreateExecutionModal />
      <EditExecutionModal />
      <DeleteExecutionModal />

      {/* Stepper modal */}
      <StepperExecutionModal />
    </div>
  )
}
