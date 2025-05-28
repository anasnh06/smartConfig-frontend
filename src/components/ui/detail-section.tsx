import type { ReactNode } from "react"

interface DetailSectionProps {
  title: string
  children: ReactNode
}

export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </div>
  )
}
