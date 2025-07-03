"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Execution } from "@/types/entities"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"

export const ExecutionColumns: ColumnDef<Execution>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => row.original.id,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/executions/${row.original.id}`}
        className="text-blue-600 hover:underline"
      >
        {row.original.title ?? "-"}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.original.status ?? "-",
  },
  {
    accessorKey: "execution_groups",
    header: "Groups",
    cell: ({ row }) => row.original.execution_groups?.length ?? 0,
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
    accessorKey: "started_at",
    header: "Started",
    cell: ({ row }) =>
      row.original.started_at ? formatDateTime(row.original.started_at) : "-",
  },
  {
    accessorKey: "finished_at",
    header: "Finished",
    cell: ({ row }) =>
      row.original.finished_at ? formatDateTime(row.original.finished_at) : "-",
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
    id: "groups_count",
    header: "Groups",
    cell: ({ row }) => (
          <span>
              {row.original.execution_groups ? row.original.execution_groups.length : 0}
          </span>
      ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const execution = row.original
      const { openEditExecutionModal, openDeleteExecutionModal } = useStore()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              aria-label="Open menu"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/executions/${execution.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => openEditExecutionModal(execution)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openDeleteExecutionModal(execution)}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]
