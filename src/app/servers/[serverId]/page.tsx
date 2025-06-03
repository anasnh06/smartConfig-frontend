"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash, ServerIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import { getServer } from "@/lib/api/server";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailSection } from "@/components/ui/detail-section";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { EditServerModal } from "@/components/servers/edit-server-modal";
import { DeleteServerModal } from "@/components/servers/delete-server-modal";
import type { Server } from "@/types/entities";

export default function ServerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serverId = Number(params.serverId);
  const store = useStore();

  const [server, setServer] = useState<Server | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServer = async () => {
    setIsLoading(true);
    try {
      const data = await getServer(serverId);
      setServer(data);
    } catch (error) {
      console.error("Failed to fetch server", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleted = () => router.push("/servers");

  useEffect(() => {
    fetchServer();
  }, [serverId]);

  const configurationColumns: ColumnDef<any>[] = [
    {
      accessorKey: "configuration.name",
      header: "Configuration",
      cell: ({ row }) => (
        <Link href={`/configurations/${row.original.configuration.id}`} className="font-medium hover:underline">
          {row.original.configuration.name}
        </Link>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={(row.original.status || "unknown") as any} />,
    },
  ];

  const templateColumns: ColumnDef<any>[] = [
    {
      accessorKey: "template.name",
      header: "Template",
      cell: ({ row }) => (
        <Link href={`/templates/${row.original.template.id}`} className="font-medium hover:underline">
          {row.original.template.name}
        </Link>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={(row.original.status || "unknown") as any} />,
    },
  ];

  if (isLoading) return <p className="text-center">Loading...</p>;

  if (!server) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Server not found</h1>
          <p className="mt-2 text-muted-foreground">The server you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/servers">Back to Servers</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/servers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title={server.name} description="Server details" />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" className="gap-2" onClick={() => store.openEditServerModal(server)}>
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button variant="outline" className="gap-2 text-destructive" onClick={() => store.openDeleteServerModal(server)}>
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Server Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-sm">{server.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">IP Address</dt>
                <dd className="text-sm">{server.ip_address}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">SSH Port</dt>
                <dd className="text-sm">{server.ssh_port}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">SSH User</dt>
                <dd className="text-sm">{server.ssh_user}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Private Key Path</dt>
                <dd className="text-sm break-all">{server.ssh_private_key_path}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created By</dt>
                <dd className="text-sm">{server.created_by_user?.username || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
                <dd className="text-sm">{server.created_at ? new Date(server.created_at).toLocaleString() : "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Updated By</dt>
                <dd className="text-sm">{server.updated_by_user?.username || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Updated At</dt>
                <dd className="text-sm">{server.updated_at ? new Date(server.updated_at).toLocaleString() : "—"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Associated Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Operating System</dt>
                <dd className="text-sm">
                  <Link href={`/operating-systems/${server.operating_system.id}`} className="hover:underline">
                    {server.operating_system.name} {server.operating_system.version}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Environment</dt>
                <dd className="text-sm">
                  <Link href={`/environments/${server.environment.id}`} className="hover:underline">
                    {server.environment.name}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Project</dt>
                <dd className="text-sm">
                  <Link href={`/projects/${server.project.id}`} className="hover:underline">
                    {server.project.name}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Roles</dt>
                <dd className="text-sm flex flex-wrap gap-2">
                  {server.roles.map((role) => (
                    <Link key={role.id} href={`/roles/${role.id}`} className="hover:underline">
                      {role.name}
                    </Link>
                  ))}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <DetailSection title="Configuration History">
        {server.server_configurations.length > 0 ? (
          <DataTable columns={configurationColumns} data={server.server_configurations} />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <ServerIcon className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No configuration history available.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      <DetailSection title="Template History">
        {server.server_templates.length > 0 ? (
          <DataTable columns={templateColumns} data={server.server_templates} />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <ServerIcon className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No template history available.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      <EditServerModal onUpdated={fetchServer} />
      <DeleteServerModal onDeleted={handleDeleted} />
    </div>
  );
}
