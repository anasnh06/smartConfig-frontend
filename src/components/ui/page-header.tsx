import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  description?: string
  icon?: ReactNode         // ✅ Ajout ici
  action?: {
    label: string
    onClick: () => void
  }
}

export function PageHeader({ title, description, icon, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between pb-6">
      <div className="flex items-center gap-3">
        {icon && <div className="text-primary">{icon}</div>}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-muted-foreground">{description}</p>}
        </div>
      </div>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  )
}
