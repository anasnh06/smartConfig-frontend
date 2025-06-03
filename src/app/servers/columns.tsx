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
    header: "Name",
    cell: ({ row }) => (
      <Link href={`/servers/${row.original.id}`} className="font-medium hover:underline">
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "ip_address",
    header: "IP Address",
  },
  {
    accessorKey: "operating_system",
    header: "OS",
    cell: ({ row }) => {
      const os = row.original.operating_system
      return os ? `${os.name} ${os.version}` : "Unknown"
    },
  },
  {
    accessorKey: "environment",
    header: "Environment",
    cell: ({ row }) => {
      const env = row.original.environment
      return env ? env.name : "Unknown"
    },
  },
  {
    accessorKey: "project",
    header: "Project",
    cell: ({ row }) => {
      const project = row.original.project
      return project ? project.name : "Unknown"
    },
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const roles = row.original.roles
      return roles.length > 0 ? roles.map((r) => r.name).join(", ") : "None"
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
