"use client"

import Link from "next/link"
import {
  MoreHorizontal,
  Play,
  Layers,
  Server,
  ShieldCheck
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { Template } from "@/types/entities"
import { useStore } from "@/lib/store"

interface TemplateCardProps {
  template: Template
}

export function TemplateCard({ template }: TemplateCardProps) {
  const store = useStore()

  const osList = template.operating_systems || []
  const displayedOs = osList.slice(0, 2)
  const remainingOsCount = osList.length > 2 ? osList.length - 2 : 0

  const configCount = template.template_configurations?.length ?? 0
  const serverCount = template.template_servers?.length ?? 0

  return (
    <Card className="flex flex-col rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 flex-1 overflow-hidden">
          <CardTitle className="flex items-center gap-2 text-base font-semibold leading-snug">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{template.name}</span>
          </CardTitle>

          <div className="flex flex-wrap gap-1">
            {template.role?.name && (
              <Badge variant="secondary" className="text-xs">
                {template.role.name}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {displayedOs.map((os) => (
              <Badge key={os.id} variant="outline" className="text-xs">
                {os.name} {os.version}
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
              <Link href={`/templates/${template.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => store.openEditTemplateModal(template)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => store.openDeleteTemplateModal(template)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="flex-1 px-6 pt-1 pb-4 text-sm text-muted-foreground">
        <p className="line-clamp-2">{template.description}</p>
        <div className="mt-3 flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {configCount} configuration{configCount !== 1 ? "s" : ""}
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
        <Button className="w-full gap-2" onClick={() => store.openRunTemplateModal(template)}>
          <Play className="h-4 w-4" />
          Run Template
        </Button>
      </CardFooter>
    </Card>
  )
}
