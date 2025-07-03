"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import type {
  ServerConfigurationShortForExecution,
  ServerConfigurationShort,
  ServerConfigurationShortForConfiguration,
} from "@/types/entities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Edit, Trash } from "lucide-react";

type Context = "group" | "server" | "configuration";

type SC =
  | ServerConfigurationShortForExecution
  | ServerConfigurationShort
  | ServerConfigurationShortForConfiguration;

/**
 * Helper pour vérifier si un champ existe
 */
function hasField<T extends object>(obj: T, key: string): boolean {
  return key in obj && obj[key as keyof T] !== undefined;
}

export function getServerConfigurationColumns(context: Context): ColumnDef<SC>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: { row: Row<SC> }) => row.original.id,
    },
    ...(context !== "server"
      ? [
          {
            accessorKey: "server.name",
            header: "Server",
            cell: ({ row }: { row: Row<SC> }) =>
              hasField(row.original, "server")
                ? (row.original as any).server?.name ?? "-"
                : "-",
          },
        ]
      : []),
    ...(context !== "configuration"
      ? [
          {
            accessorKey: "configuration.name",
            header: "Configuration",
            cell: ({ row }: { row: Row<SC> }) =>
              hasField(row.original, "configuration")
                ? (row.original as any).configuration?.name ?? "-"
                : "-",
          },
        ]
      : []),
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: Row<SC> }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.status ?? "unknown"}
        </Badge>
      ),
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }: { row: Row<SC> }) =>
        hasField(row.original, "source") ? (row.original as any).source ?? "-" : "-",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: Row<SC> }) => {
        const { openEditServerConfigurationModal, openDeleteServerConfigurationModal } = useStore();
        return (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => openEditServerConfigurationModal(row.original as any)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => openDeleteServerConfigurationModal(row.original as any)}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}
