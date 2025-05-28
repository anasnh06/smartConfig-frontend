"use client"

import Link from "next/link"
import { MoreHorizontal, Play, Layers } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Template } from "@/types/entities"
import { useStore } from "@/lib/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getOperatingSystemById, getRoleById } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"

interface TemplateCardProps {
  template: Template
}

export function TemplateCard({ template }: TemplateCardProps) {
  const store = useStore()

  // Get role names for display
  const roleNames = template.compatibleRoleIds
    .map((id) => {
      const role = getRoleById(id)
      return role ? role.name : null
    })
    .filter(Boolean)
    .slice(0, 2)

  // Get OS names for display
  const osNames = template.compatibleOsIds
    .map((id) => {
      const os = getOperatingSystemById(id)
      return os ? os.name : null
    })
    .filter(Boolean)
    .slice(0, 2)

  // Get configuration count
  const configCount = template.configurationIds.length

  const remainingRoleCount = template.compatibleRoleIds.length - roleNames.length
  const remainingOsCount = template.compatibleOsIds.length - osNames.length

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="line-clamp-1">{template.name}</CardTitle>
          <div className="flex flex-wrap gap-1">
            {roleNames.map((name, i) => (
              <Badge key={`role-${i}`} variant="secondary" className="text-xs">
                {name}
              </Badge>
            ))}
            {remainingRoleCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                +{remainingRoleCount} more
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {osNames.map((name, i) => (
              <Badge key={`os-${i}`} variant="outline" className="text-xs">
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
              <Link href={`/templates/${template.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => store.openEditTemplateModal(template)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => store.openDeleteTemplateModal(template)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
        <div className="mt-2 flex items-center gap-1">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {configCount} configuration{configCount !== 1 ? "s" : ""}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full gap-2" onClick={() => store.openRunTemplateModal(template)}>
          <Play className="h-4 w-4" />
          Run Template
        </Button>
      </CardFooter>
    </Card>
  )
}
