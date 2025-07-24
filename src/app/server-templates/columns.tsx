"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import type { ServerTemplate, ServerTemplateShort } from "@/types/entities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Edit, Trash, Eye } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";

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
      cell: ({ row }) => <StatusBadge status={(row.original.status || "unknown") as any} />,
    },
    {
      accessorKey: "server_configurations",
      header: "Configs Count",
      cell: ({ row }: { row: Row<ST> }) =>
        (row.original as ServerTemplate).server_configurations
          ? (row.original as ServerTemplate).server_configurations.length
          : "-",
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }: { row: Row<ST> }) =>
        (row.original as ServerTemplate).created_at
          ? formatDateTime((row.original as ServerTemplate).created_at!)
          : "-",
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      cell: ({ row }: { row: Row<ST> }) =>
        (row.original as ServerTemplate).updated_at
          ? formatDateTime((row.original as ServerTemplate).updated_at!)
          : "-",
    },
    {
      accessorKey: "created_by_user.username",
      header: "Created By",
      cell: ({ row }: { row: Row<ST> }) =>
        (row.original as ServerTemplate).created_by_user?.username ?? "-",
    },
    {
      accessorKey: "updated_by_user.username",
      header: "Updated By",
      cell: ({ row }: { row: Row<ST> }) =>
        (row.original as ServerTemplate).updated_by_user?.username ?? "-",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: Row<ST> }) => {
        const { openEditServerTemplateModal, openDeleteServerTemplateModal } = useStore();
        const template = row.original as ServerTemplate;
        return (
          <div className="flex gap-2">
            <Link href={`/server-templates/${template.id}`}>
              <Button size="icon" variant="secondary">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              size="icon"
              variant="outline"
              onClick={() => openEditServerTemplateModal(template)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => openDeleteServerTemplateModal(template)}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}
