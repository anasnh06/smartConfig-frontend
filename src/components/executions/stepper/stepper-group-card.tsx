// components/executions/stepper/stepper-group-card.tsx

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { ExecutionGroupDraft } from "@/lib/store"
import { StepperElementCard } from "./stepper-element-card"

interface StepperGroupCardProps {
  group: ExecutionGroupDraft
  index: number
}

export function StepperGroupCard({ group, index }: StepperGroupCardProps) {
  const { removeDraftGroup, openEditDraftExecutionGroupModal } = useStore()

  const handleEdit = () => {
    openEditDraftExecutionGroupModal(index) // Pas besoin de données réelles, le modal récupérera le groupe via l'index
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Groupe #{index + 1}</CardTitle>
          {group.comment && <p className="text-sm text-muted-foreground">{group.comment}</p>}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleEdit}>Modifier</Button>
          <Button size="sm" variant="destructive" onClick={() => removeDraftGroup(index)}>Supprimer</Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {group.servers.map((serverId) => (
          <Badge key={serverId} variant="secondary">Serveur ID {serverId}</Badge>
        ))}
        {group.elements.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun élément ajouté.</p>
        )}
        {group.elements.map((element, idx) => (
          <StepperElementCard key={idx} element={element} />
        ))}
      </CardContent>
    </Card>
  )
}
