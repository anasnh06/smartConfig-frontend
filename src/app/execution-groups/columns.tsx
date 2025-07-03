"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { ExecutionGroup } from "@/types/entities"
import { formatDateTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"

export const ExecutionGroupColumns: ColumnDef<ExecutionGroup>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => row.original.id,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name ?? "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.original.status ?? "-",
  },
  {
    accessorKey: "started_at",
    header: "Started At",
    cell: ({ row }) =>
      row.original.started_at ? formatDateTime(row.original.started_at) : "-",
  },
  {
    accessorKey: "finished_at",
    header: "Finished At",
    cell: ({ row }) =>
      row.original.finished_at ? formatDateTime(row.original.finished_at) : "-",
  },
  {
    accessorKey: "created_by_user.username",
    header: "Created By",
    cell: ({ row }) => row.original.created_by_user?.username ?? "-",
  },
  {
    accessorKey: "updated_by_user.username",
    header: "Updated By",
    cell: ({ row }) => row.original.updated_by_user?.username ?? "-",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => formatDateTime(row.original.created_at),
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ row }) =>
      row.original.updated_at ? formatDateTime(row.original.updated_at) : "-",
  },
  {
    id: "server_configurations_count",
    header: "Server/Configuration",
    cell: ({ row }) => (
          <span>
              {row.original.server_configurations ? row.original.server_configurations.length : 0}
          </span>
      ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const router = useRouter()
      const store = useStore()
      const group = row.original

      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/execution-groups/${group.id}`)}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => store.openEditExecutionGroupModal(group)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => store.openDeleteExecutionGroupModal(group)}
          >
            Delete
          </Button>
        </div>
      )
    },
  },
]
