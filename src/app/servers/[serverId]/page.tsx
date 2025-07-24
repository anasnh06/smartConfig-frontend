"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash, ServerIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import { useServersStore } from "@/lib/store/servers";
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
  const { getServerSshStatus, serverStatus } = useServersStore();

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

  // Charger le statut SSH au montage
  useEffect(() => {
    if (serverId) {
      getServerSshStatus(serverId);
    }
  }, [serverId, getServerSshStatus]);

  useEffect(() => {
    fetchServer();
  }, [serverId]);

  // Déterminer le statut SSH
  const sshStatus = serverStatus[serverId] || "offline";

  const configurationColumns: ColumnDef<any>[] = [
    {
      accessorKey: "configuration.name",
      header: "Configuration",
      cell: ({ row }) => {
        const config = row.original.configuration;
        if (!config) {
          return <span className="text-gray-400 italic">No configuration</span>;
        }
        return (
          <Link href={`/configurations/${config.id}`} className="font-medium hover:underline">
            {config.name}
          </Link>
        );
      },
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

  if (isLoading) return <p className="text-center py-16 text-gray-500">Loading...</p>;

  if (!server) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Server not found</h1>
          <p className="mt-2 text-gray-500">The server you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/servers">Back to Servers</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10 px-2 sm:px-8">
      <div className="w-full space-y-8">
        {/* Header + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="border border-gray-200 bg-white hover:bg-gray-100">
              <Link href="/servers">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <PageHeader title={server.name} description="Server details" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => store.openEditServerModal(server)}>
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50" onClick={() => store.openDeleteServerModal(server)}>
              <Trash className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow border border-gray-100 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900 text-lg">Server Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-y-3">
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Name</dt>
                  <dd className="text-sm text-gray-900">{server.name}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">IP Address</dt>
                  <dd className="text-sm text-gray-900">{server.ip_address}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">SSH Port</dt>
                  <dd className="text-sm text-gray-900">{server.ssh_port}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">SSH User</dt>
                  <dd className="text-sm text-gray-900">{server.ssh_user}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Private Key Path</dt>
                  <dd className="text-sm text-gray-900 break-all">{server.ssh_private_key_path}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Created By</dt>
                  <dd className="text-sm text-gray-900">{server.created_by_user?.username || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Created At</dt>
                  <dd className="text-sm text-gray-900">{server.created_at ? new Date(server.created_at).toLocaleString() : "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Updated By</dt>
                  <dd className="text-sm text-gray-900">{server.updated_by_user?.username || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Updated At</dt>
                  <dd className="text-sm text-gray-900">{server.updated_at ? new Date(server.updated_at).toLocaleString() : "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">SSH Status</dt>
                  <dd>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        sshStatus === "online"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {sshStatus === "online" ? "Online" : "Offline"}
                    </span>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="shadow border border-gray-100 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900 text-lg">Associated Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-y-3">
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Operating System</dt>
                  <dd className="text-sm">
                    <Link href={`/operating-systems/${server.operating_system.id}`} className="hover:underline text-gray-900">
                      {server.operating_system.name} {server.operating_system.version}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Environment</dt>
                  <dd className="text-sm">
                    <Link href={`/environments/${server.environment.id}`} className="hover:underline text-gray-900">
                      {server.environment.name}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Project</dt>
                  <dd className="text-sm">
                    <Link href={`/projects/${server.project.id}`} className="hover:underline text-gray-900">
                      {server.project.name}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Roles</dt>
                  <dd className="text-sm flex flex-wrap gap-2">
                    {server.roles.map((role) => (
                      <Link
                        key={role.id}
                        href={`/roles/${role.id}`}
                        className="hover:underline bg-gray-100 rounded px-2 py-0.5 text-xs text-gray-800"
                      >
                        {role.name}
                      </Link>
                    ))}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Configuration History */}
        <DetailSection title="Configuration History">
          {server.server_configurations.length > 0 ? (
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-2">
              <DataTable columns={configurationColumns} data={server.server_configurations} />
            </div>
          ) : (
            <Card className="border border-gray-100 bg-white">
              <CardContent className="py-6 text-center">
                <ServerIcon className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-2 text-gray-400">No configuration history available.</p>
              </CardContent>
            </Card>
          )}
        </DetailSection>

        {/* Template History */}
        <DetailSection title="Template History">
          {server.server_templates.length > 0 ? (
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-2">
              <DataTable columns={templateColumns} data={server.server_templates} />
            </div>
          ) : (
            <Card className="border border-gray-100 bg-white">
              <CardContent className="py-6 text-center">
                <ServerIcon className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-2 text-gray-400">No template history available.</p>
              </CardContent>
            </Card>
          )}
        </DetailSection>

        <EditServerModal onUpdated={fetchServer} />
        <DeleteServerModal onDeleted={handleDeleted} />
      </div>
    </div>
  );
}
