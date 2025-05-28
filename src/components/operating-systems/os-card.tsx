"use client"

import Link from "next/link"
import { MoreHorizontal, Monitor, Server } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { OperatingSystem } from "@/types/entities"
import { useStore } from "@/lib/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getServersByOperatingSystemId } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"

interface OsCardProps {
  os: OperatingSystem
}

export function OsCard({ os }: OsCardProps) {
  const store = useStore()
  const associatedServers = getServersByOperatingSystemId(os.id)
  const serverCount = associatedServers.length

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            <span className="line-clamp-1">{os.name}</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{os.version}</Badge>
            <Badge variant="outline">{os.architecture}</Badge>
          </div>
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
              <Link href={`/operating-systems/${os.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => store.openEditOsModal(os)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => store.openDeleteOsModal(os)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mt-2 flex items-center gap-1">
          <Server className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {serverCount} server{serverCount !== 1 ? "s" : ""}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/operating-systems/${os.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
