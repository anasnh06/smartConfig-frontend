"use client"

import Link from "next/link"
import { MoreHorizontal, Tag, Server } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Role } from "@/types/entities"
import { useStore } from "@/lib/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getServersByRoleId } from "@/lib/mock-data"

interface RoleCardProps {
  role: Role
}

export function RoleCard({ role }: RoleCardProps) {
  const store = useStore()
  const associatedServers = getServersByRoleId(role.id)
  const serverCount = associatedServers.length

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="line-clamp-1">{role.name}</span>
          </CardTitle>
        </div>
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
              <Link href={`/roles/${role.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => store.openEditRoleModal(role)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => store.openDeleteRoleModal(role)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">{role.description}</p>
        <div className="mt-2 flex items-center gap-1">
          <Server className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {serverCount} server{serverCount !== 1 ? "s" : ""}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/roles/${role.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
