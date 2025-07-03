"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import type { ServerTemplate, ServerTemplateShort } from "@/types/entities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Edit, Trash } from "lucide-react";

type Context = "server" | "template" | "group";
type ST = ServerTemplateShort | ServerTemplate;

export function getServerTemplateColumns(context: Context): ColumnDef<ST>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: { row: Row<ST> }) => row.original.id,
    },
    ...(context !== "server"
      ? [
          {
            accessorKey: "server.name",
            header: "Server",
            cell: ({ row }: { row: Row<ST> }) => row.original.server?.name ?? "-",
          },
        ]
      : []),
    ...(context !== "template"
      ? [
          {
            accessorKey: "template.name",
            header: "Template",
            cell: ({ row }: { row: Row<ST> }) => row.original.template?.name ?? "-",
          },
        ]
      : []),
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: Row<ST> }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.status ?? "unknown"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: Row<ST> }) => {
        const { openEditServerTemplateModal, openDeleteServerTemplateModal } = useStore();
        return (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => openEditServerTemplateModal(row.original as ServerTemplate)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => openDeleteServerTemplateModal(row.original as ServerTemplate)}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}
