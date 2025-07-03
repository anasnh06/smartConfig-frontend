import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface StatusBadgeProps {
  status:
    | "online"
    | "offline"
    | "maintenance"
    | "pending"
    | "running"
    | "completed"
    | "success"
    | "partial_success"
    | "failed"
    | "canceled"
    | "draft"
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
        status === "success" && "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
        status === "partial_success" && "bg-orange-100 text-orange-800 hover:bg-orange-100",
        status === "failed" && "bg-red-100 text-red-800 hover:bg-red-100",
        status === "canceled" && "bg-gray-100 text-gray-800 hover:bg-gray-100",
        status === "draft" && "bg-sky-100 text-sky-800 hover:bg-sky-100"
      )}
    >
      {status.replace("_", " ")}
    </Badge>
  )
}
