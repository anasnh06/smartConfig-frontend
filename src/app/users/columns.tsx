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
import type { User } from "@/types/entities"
import { useStore } from "@/lib/store"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <Link href={`/users/${row.original.id}`} className="font-medium hover:underline">
        {row.getValue("username")}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      <span className={row.getValue("is_active") ? "text-green-600" : "text-muted-foreground"}>
        {row.getValue("is_active") ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    accessorKey: "created_by_user",
    header: "Creator",
    cell: ({ row }) => row.original.creator?.username || "-",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const value = row.getValue("created_at") as string
      return value ? new Date(value).toLocaleDateString() : "-"
    },
  },
  {
    accessorKey: "updated_by_user",
    header: "Updater",
    cell: ({ row }) => row.original.updater?.username || "-",
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ row }) => {
      const value = row.getValue("updated_at") as string
      return value ? new Date(value).toLocaleDateString() : "-"
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original
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
              <Link href={`/users/${user.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => store.openEditUserModal(user)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => store.openDeleteUserModal(user)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
