"use client"

import Link from "next/link"
import { MoreHorizontal, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Configuration } from "@/types/entities"
import { useStore } from "@/lib/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getOperatingSystemById } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"

interface ConfigurationCardProps {
  configuration: Configuration
}

export function ConfigurationCard({ configuration }: ConfigurationCardProps) {
  const store = useStore()

  // Get OS names for display
  const osNames = configuration.compatibleOsIds
    .map((id) => {
      const os = getOperatingSystemById(id)
      return os ? os.name : null
    })
    .filter(Boolean)
    .slice(0, 2)

  const remainingOsCount = configuration.compatibleOsIds.length - osNames.length

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="line-clamp-1">{configuration.name}</CardTitle>
          <div className="flex flex-wrap gap-1">
            {osNames.map((name, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {name}
              </Badge>
            ))}
            {remainingOsCount > 0 && (
              <Badge variant="outline" className="text-xs">
                +{remainingOsCount} more
              </Badge>
            )}
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
              <Link href={`/configurations/${configuration.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => store.openEditConfigurationModal(configuration)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => store.openDeleteConfigurationModal(configuration)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">{configuration.description}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full gap-2" onClick={() => store.openRunConfigurationModal(configuration)}>
          <Play className="h-4 w-4" />
          Run Configuration
        </Button>
      </CardFooter>
    </Card>
  )
}
