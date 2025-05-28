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
import { StatusBadge } from "@/components/ui/status-badge"
import { getEnvironmentById, getOperatingSystemById, getProjectById, getRoleById } from "@/lib/mock-data"

export const columns: ColumnDef<Server>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link href={`/servers/${row.original.id}`} className="font-medium hover:underline">
          {row.getValue("name")}
        </Link>
      )
    },
  },
  {
    accessorKey: "hostname",
    header: "Hostname",
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
  },
  {
    accessorKey: "operatingSystemId",
    header: "OS",
    cell: ({ row }) => {
      const osId = row.getValue("operatingSystemId") as string
      const os = getOperatingSystemById(osId)
      return os ? `${os.name} ${os.version}` : "Unknown"
    },
  },
  {
    accessorKey: "roleIds",
    header: "Role",
    cell: ({ row }) => {
      const roleIds = row.getValue("roleIds") as string[]
      if (!roleIds.length) return "None"

      const role = getRoleById(roleIds[0])
      return role ? role.name : "Unknown"
    },
  },
  {
    accessorKey: "environmentId",
    header: "Environment",
    cell: ({ row }) => {
      const envId = row.getValue("environmentId") as string
      const env = getEnvironmentById(envId)
      return env ? env.name : "Unknown"
    },
  },
  {
    accessorKey: "projectId",
    header: "Project",
    cell: ({ row }) => {
      const projectId = row.getValue("projectId") as string
      const project = getProjectById(projectId)
      return project ? project.name : "Unknown"
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as "online" | "offline" | "maintenance"
      return <StatusBadge status={status} />
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const server = row.original
      const store = useStore()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/servers/${server.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => store.openEditServerModal(server)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => store.openDeleteServerModal(server)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
