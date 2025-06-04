import type { ReactNode } from "react"
import { Button } from "./button"

interface DetailSectionProps {
  title: string
  children: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export function DetailSection({ title, children, action }: DetailSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        {action && (
          <Button variant="outline" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
      {children}
    </div>
  )
}
