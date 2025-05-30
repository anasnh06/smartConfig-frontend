"use client"

import Link from "next/link"
import { Globe, MoreHorizontal, Server, Pencil, Trash, Eye } from "lucide-react"

import type { Environment } from "@/types/entities"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"

interface EnvironmentCardProps {
  environment: Environment
}

export function EnvironmentCard({ environment }: EnvironmentCardProps) {
  const store = useStore()
  const serverCount = environment.servers?.length ?? 0

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 leading-normal">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="line-clamp-1">{environment.name}</span>
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
              <Link href={`/environments/${environment.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => store.openEditEnvironmentModal(environment)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => store.openDeleteEnvironmentModal(environment)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="flex-1 leading-normal">
        <div className="mt-2 flex items-center gap-1">
          <Server className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {serverCount} server{serverCount !== 1 ? "s" : ""}
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/environments/${environment.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
