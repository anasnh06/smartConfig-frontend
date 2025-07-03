"use client";

import Link from "next/link";
import type { ColumnDef, Row } from "@tanstack/react-table";
import type {
  ServerConfigurationShortForExecution,
  ServerConfigurationShort,
  ServerConfigurationShortForConfiguration,
} from "@/types/entities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Eye, Edit, Trash } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

type Context = "group" | "server" | "configuration";

type SC =
  | ServerConfigurationShortForExecution
  | ServerConfigurationShort
  | ServerConfigurationShortForConfiguration;

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
    ...(context !== "configuration"
      ? [
          {
            accessorKey: "server",
            header: "Server",
            cell: ({ row }: { row: Row<SC> }) =>
              hasField(row.original, "server") && (row.original as any).server
                ? `${(row.original as any).server.name} (${
                    (row.original as any).server.ip_address ?? "-"
                  })`
                : "-",
          },
        ]
      : []),
    ...(context !== "server"
      ? [
          {
            accessorKey: "configuration",
            header: "Configuration",
            cell: ({ row }: { row: Row<SC> }) =>
              hasField(row.original, "configuration") && (row.original as any).configuration
                ? (row.original as any).configuration.name ?? "-"
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
      accessorKey: "custom_command",
      header: "Command",
      cell: ({ row }: { row: Row<SC> }) => (row.original as any).custom_command ?? "-",
    },
    {
      accessorKey: "started_at",
      header: "Started",
      cell: ({ row }: { row: Row<SC> }) =>
        (row.original as any).started_at ? formatDateTime((row.original as any).started_at) : "-",
    },
    {
      accessorKey: "finished_at",
      header: "Finished",
      cell: ({ row }: { row: Row<SC> }) =>
        (row.original as any).finished_at ? formatDateTime((row.original as any).finished_at) : "-",
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }: { row: Row<SC> }) =>
        (row.original as any).created_at ? formatDateTime((row.original as any).created_at) : "-",
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      cell: ({ row }: { row: Row<SC> }) =>
        (row.original as any).updated_at ? formatDateTime((row.original as any).updated_at) : "-",
    },
    {
      accessorKey: "server_template",
      header: "Server Template",
      cell: ({ row }: { row: Row<SC> }) =>
        hasField(row.original, "server_template") && (row.original as any).server_template
          ? `${(row.original as any).server_template.template?.name ?? "-"} (#${
              (row.original as any).server_template.id
            })`
          : "-",
    },
    {
      accessorKey: "created_by_user",
      header: "Created By",
      cell: ({ row }: { row: Row<SC> }) =>
        (row.original as any).created_by_user?.username ?? "-",
    },
    {
      accessorKey: "updated_by_user",
      header: "Updated By",
      cell: ({ row }: { row: Row<SC> }) =>
        (row.original as any).updated_by_user?.username ?? "-",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: Row<SC> }) => {
        const { openEditServerConfigurationModal, openDeleteServerConfigurationModal } = useStore();
        return (
          <div className="flex gap-2">
            <Link href={`/server-configurations/${row.original.id}`}>
              <Button size="icon" variant="secondary">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
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
