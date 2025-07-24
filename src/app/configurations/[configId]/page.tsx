"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash, Play, FileCode, Server, LayoutTemplate, User } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { getConfiguration } from "@/lib/api/configuration"
import { EditConfigurationModal } from "@/components/configurations/edit-configuration-modal"
import { DeleteConfigurationModal } from "@/components/configurations/delete-configuration-modal"
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { useServerConfigurationsStore } from "@/lib/store/server_configurations";
import type { Configuration } from "@/types/entities"

export default function ConfigurationDetailPage() {
  const { configId } = useParams()
  const store = useStore()
  const { fetchServerConfigurationsByConfigId, serverConfigurations } = useServerConfigurationsStore();
  const [configuration, setConfiguration] = useState<Configuration | null>(null)
  const [serverConfigsLoading, setServerConfigsLoading] = useState(true);

  const fetchConfiguration = async () => {
    try {
      const data = await getConfiguration(Number(configId))
      setConfiguration(data)
    } catch (error) {
      console.error("Failed to load configuration", error)
    }
  }

  useEffect(() => {
    fetchConfiguration();
    setServerConfigsLoading(true);
    fetchServerConfigurationsByConfigId(Number(configId)).finally(() => setServerConfigsLoading(false));
  }, [configId])

  if (!configuration) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Configuration not found</h1>
          <p className="mt-2 text-gray-500">The configuration you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/configurations">Back to Configurations</Link>
          </Button>
        </div>
      </div>
    )
  }

  const serverCount = configuration.configuration_servers?.length ?? 0
  const templateCount = configuration.configuration_templates?.length ?? 0

  // Colonnes pour le tableau des serveurs associés à la configuration
  const serverConfigColumns: ColumnDef<any>[] = [
    {
      accessorKey: "server.name",
      header: "Server Name",
      cell: ({ row }) => (
        <Link href={`/servers/${row.original.server.id}`} className="font-medium hover:underline text-blue-700">
          {row.original.server.name}
        </Link>
      ),
    },
    {
      accessorKey: "server.ip_address",
      header: "IP Address",
      cell: ({ row }) => row.original.server.ip_address,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={(row.original.status || "unknown") as any} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10 px-2 sm:px-8">
      <div className="w-full space-y-8">
        {/* Header + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="border border-gray-200 bg-white hover:bg-gray-100">
              <Link href="/configurations">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <PageHeader title={configuration.name} description={configuration.description} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => store.openEditConfigurationModal(configuration)}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => store.openDeleteConfigurationModal(configuration)}
            >
              <Trash className="h-4 w-4" />
              Delete
            </Button>
            <Button className="gap-2 ml-auto bg-blue-600 hover:bg-blue-700 text-white" onClick={() => store.openRunConfigurationModal(configuration)}>
              <Play className="h-4 w-4" />
              Run Configuration
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Configuration Info */}
          <Card className="shadow border border-gray-100 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900 text-lg">Configuration Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-y-3">
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Name</dt>
                  <dd className="text-sm text-gray-900">{configuration.name}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Command</dt>
                  <dd className="text-sm text-gray-900">{configuration.command}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Description</dt>
                  <dd className="text-sm text-gray-900">{configuration.description}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Created At</dt>
                  <dd className="text-sm text-gray-900">{new Date(configuration.created_at).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Created By</dt>
                  <dd className="text-sm flex items-center gap-2 text-gray-900">
                    <User className="h-4 w-4" />
                    {configuration.created_by_user.username}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Updated At</dt>
                  <dd className="text-sm text-gray-900">
                    {configuration.updated_at ? new Date(configuration.updated_at).toLocaleString() : "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Updated By</dt>
                  <dd className="text-sm flex items-center gap-2 text-gray-900">
                    {configuration.updated_by_user ? (
                      <>
                        <User className="h-4 w-4" />
                        {configuration.updated_by_user.username}
                      </>
                    ) : (
                      "-"
                    )}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Compatible OS */}
          <Card className="shadow border border-gray-100 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900 text-lg">Compatible Operating Systems</CardTitle>
            </CardHeader>
            <CardContent>
              {configuration.operating_systems.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {configuration.operating_systems.map((os) => (
                    <Badge key={os.id} variant="outline" className="text-xs border-gray-300">
                      <Link href={`/operating-systems/${os.id}`} className="hover:underline text-gray-800">
                        {os.name} {os.version}
                      </Link>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No compatible operating systems defined.</p>
              )}
            </CardContent>
          </Card>

          {/* Associated Templates */}
          <Card className="shadow border border-gray-100 bg-white lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-gray-900 text-lg">Template Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              {templateCount > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border border-gray-100 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Template</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Order</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {configuration.configuration_templates.map((ct, index) => (
                        <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              <LayoutTemplate className="h-4 w-4 text-gray-400" />
                              <span>{ct.template.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2">{ct.order}</td>
                          <td className="px-4 py-2">{ct.comment || <span className="text-gray-400 italic">—</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">No templates associated with this configuration.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Associated Servers Table */}
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Server className="h-5 w-5 text-gray-500" />
            Associated Servers
          </h2>
          {serverConfigsLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : serverConfigurations && serverConfigurations.length > 0 ? (
            <div className="overflow-x-auto">
              <DataTable columns={serverConfigColumns} data={serverConfigurations} />
            </div>
          ) : (
            <p className="text-gray-400">No servers associated with this configuration.</p>
          )}
        </div>

        <EditConfigurationModal onUpdated={fetchConfiguration} />
        <DeleteConfigurationModal onDeleted={() => (window.location.href = "/configurations")} />
      </div>
    </div>
  )
}
