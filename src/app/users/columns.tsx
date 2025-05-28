"use client"

import type { ColumnDef } from "@tanstack/react-table"
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
import type { User } from "@/types/entities"
import { useStore } from "@/lib/store"
import Link from "next/link"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link href={`/users/${row.original.id}`} className="font-medium hover:underline">
          {row.getValue("username")}
        </Link>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString()
    },
  },
  {
    id: "actions",
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
