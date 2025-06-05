"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Server } from "@/types/entities"
import { useStore } from "@/lib/store"

export const columns: ColumnDef<Server>[] = [
  {
    accessorKey: "name",
    header: () => <span className="text-gray-900 font-medium">Name</span>,
    cell: ({ row }) => (
      <Link
        href={`/servers/${row.original.id}`}
        className="font-medium text-gray-800 hover:underline"
      >
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "ip_address",
    header: () => <span className="text-gray-900 font-medium">IP Address</span>,
    cell: ({ row }) => (
      <span className="font-mono text-gray-700">{row.getValue("ip_address")}</span>
    ),
  },
  {
    accessorKey: "operating_system",
    header: () => <span className="text-gray-900 font-medium">OS</span>,
    cell: ({ row }) => {
      const os = row.original.operating_system
      return os ? (
        <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs">
          {os.name}{os.version ? ` ${os.version}` : ""}
        </span>
      ) : (
        <span className="text-gray-400 italic">Unknown</span>
      )
    },
  },
  {
    accessorKey: "environment",
    header: () => <span className="text-gray-900 font-medium">Environment</span>,
    cell: ({ row }) => {
      const env = row.original.environment
      return env ? (
        <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs">
          {env.name}
        </span>
      ) : (
        <span className="text-gray-400 italic">Unknown</span>
      )
    },
  },
  {
    accessorKey: "project",
    header: () => <span className="text-gray-900 font-medium">Project</span>,
    cell: ({ row }) => {
      const project = row.original.project
      return project ? (
        <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs">
          {project.name}
        </span>
      ) : (
        <span className="text-gray-400 italic">Unknown</span>
      )
    },
  },
  {
    accessorKey: "roles",
    header: () => <span className="text-gray-900 font-medium">Roles</span>,
    cell: ({ row }) => {
      const roles = row.original.roles
      return roles.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {roles.map((r) => (
            <span
              key={r.id}
              className="inline-block px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs"
            >
              {r.name}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-gray-400 italic">None</span>
      )
    },
  },
  {
    accessorKey: "server_templates",
    header: () => <span className="text-gray-900 font-medium">Templates</span>,
    cell: ({ row }) => {
      const templates = row.original.server_templates
      return (
        <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs">
          {templates ? templates.length : 0}
        </span>
      )
    },
  },
  {
    accessorKey: "server_configurations",
    header: () => <span className="text-gray-900 font-medium">Configurations</span>,
    cell: ({ row }) => {
      const configs = row.original.server_configurations
      return (
        <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs">
          {configs ? configs.length : 0}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const server = row.original
      const store = useStore()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
              aria-label="Open menu"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-lg shadow-lg border border-gray-100">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/servers/${server.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => store.openEditServerModal(server)}
              className="text-gray-700"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => store.openDeleteServerModal(server)}
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
