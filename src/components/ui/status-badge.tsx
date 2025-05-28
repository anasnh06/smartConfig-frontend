import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "online" | "offline" | "maintenance" | "pending" | "running" | "completed" | "failed"
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "capitalize",
        status === "online" && "bg-green-100 text-green-800 hover:bg-green-100",
        status === "offline" && "bg-red-100 text-red-800 hover:bg-red-100",
        status === "maintenance" && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        status === "pending" && "bg-blue-100 text-blue-800 hover:bg-blue-100",
        status === "running" && "bg-purple-100 text-purple-800 hover:bg-purple-100",
        status === "completed" && "bg-green-100 text-green-800 hover:bg-green-100",
        status === "failed" && "bg-red-100 text-red-800 hover:bg-red-100",
      )}
    >
      {status}
    </Badge>
  )
}
