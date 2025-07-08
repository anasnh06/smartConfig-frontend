"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStepperStore, ExecutionGroupDraft } from "@/lib/store/stepper"
import { useStore } from "@/lib/store"
import { StepperElementCard } from "./stepper-element-card"
import { useServersStore } from "@/lib/store/servers"

interface StepperGroupCardProps {
  group: ExecutionGroupDraft
  index: number
}

export function StepperGroupCard({ group, index }: StepperGroupCardProps) {
  const {
    removeDraftGroup,
    setSelectedDraftGroupIndex,
  } = useStepperStore()
  const { setIsEditExecutionGroupModalOpen } = useStepperStore()

  const { servers } = useServersStore()

  const handleEdit = () => {
    setSelectedDraftGroupIndex(index)
    setIsEditExecutionGroupModalOpen(true) // ✅ ouverture effective de la modale d'édition
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">
            {group.groupName?.trim() || `Groupe #${index + 1}`}
          </CardTitle>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleEdit}>Modifier</Button>
          <Button size="sm" variant="destructive" onClick={() => removeDraftGroup(index)}>Supprimer</Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {group.servers.length > 0 ? (
          group.servers.map((serverId: number) => {
            const server = servers.find((s) => s.id === serverId)
            return (
              <Badge key={serverId} variant="secondary" className="flex flex-col items-start px-3 py-2 min-w-[180px]">
                {server ? (
                  <>
                    <span className="font-semibold">{server.name}</span>
                    <span className="text-xs text-muted-foreground">IP: {server.ip_address}</span>
                    <span className="text-xs text-muted-foreground">OS: {server.operating_system?.name}</span>
                    {server.environment?.name && (
                      <span className="text-xs text-muted-foreground">Environnement: {server.environment.name}</span>
                    )}
                    {server.project?.name && (
                      <span className="text-xs text-muted-foreground">Projet: {server.project.name}</span>
                    )}
                    {Array.isArray(server.roles) && server.roles.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        Rôles: [{server.roles.map(r => r.name).join(", ")}]
                      </span>
                    )}
                  </>
                ) : (
                  <>Serveur ID {serverId}</>
                )}
              </Badge>
            )
          })
        ) : (
          <p className="text-sm text-muted-foreground">Aucun serveur sélectionné.</p>
        )}

        {group.elements.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun élément ajouté.</p>
        )}
        {group.elements.map((element, idx) => (
          <StepperElementCard
            key={`${element.type}-${element.id ?? idx}`}
            element={element}
          />
        ))}
      </CardContent>
    </Card>
  )
}
