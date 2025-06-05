"use client"

import Link from "next/link"
import {
  Cog,
  Server,
  LayoutTemplate,
  MoreHorizontal,
  Play,
  FileCode,   // Ajouté pour l'icône configuration (sidebar)
  Layers      // Ajouté pour l'icône template (sidebar)
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import type { Configuration } from "@/types/entities"
import { useStore } from "@/lib/store"

interface ConfigurationCardProps {
  configuration: Configuration
}

export function ConfigurationCard({ configuration }: ConfigurationCardProps) {
  const store = useStore()

  const osList = configuration.operating_systems
  const displayedOs = osList.slice(0, 2)
  const remainingCount = osList.length > 2 ? osList.length - 2 : 0

  const serverCount = configuration.configuration_servers?.length ?? 0
  const templateCount = configuration.configuration_templates?.length ?? 0

  return (
    <Card className="flex flex-col rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 flex-1 overflow-hidden">
          <CardTitle className="flex items-center gap-2 text-base font-semibold leading-snug">
            <FileCode className="h-4 w-4 text-muted-foreground" /> {/* Utilise FileCode (sidebar) */}
            <span className="truncate">{configuration.name}</span>
          </CardTitle>
          <div className="flex flex-wrap gap-1">
            {displayedOs.map((os) => (
              <Badge key={os.id} variant="outline" className="text-xs">
                {os.name} {os.version}
              </Badge>
            ))}
            {remainingCount > 0 && (
              <Badge variant="outline" className="text-xs">
                +{remainingCount} more
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
            <DropdownMenuItem onClick={() => store.openEditConfigurationModal(configuration)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => store.openDeleteConfigurationModal(configuration)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="flex-1 px-6 pt-1 pb-4 text-sm text-muted-foreground">
        <p className="line-clamp-2">{configuration.description}</p>
        <div className="mt-3 flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Layers className="h-4 w-4 text-muted-foreground" /> {/* Utilise Layers (sidebar) */}
            <span className="text-xs text-muted-foreground">
              {templateCount} template{templateCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Server className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {serverCount} server{serverCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0">
        <Button className="w-full gap-2" onClick={() => store.openRunConfigurationModal(configuration)}>
          <Play className="h-4 w-4" />
          Run Configuration
        </Button>
      </CardFooter>
    </Card>
  )
}
