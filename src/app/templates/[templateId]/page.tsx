"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash, Plus, Pencil, X, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { DetailSection } from "@/components/ui/detail-section";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";

import { EditTemplateModal } from "@/components/templates/edit-template-modal";
import { DeleteTemplateModal } from "@/components/templates/delete-template-modal";
import { AttachTemplateConfigurationModal } from "@/components/templates/attach-template-configuration-modal";
import { EditTemplateConfigurationModal } from "@/components/templates/edit-template-configuration-modal";
import { DeleteTemplateConfigurationModal } from "@/components/templates/delete-template-configuration-modal";

import { useStore } from "@/lib/store";
import { getTemplate } from "@/lib/api/template";
import { useServerTemplatesStore } from "@/lib/store/server_templates";
import type { ColumnDef } from "@tanstack/react-table";
import type { TemplateConfiguration } from "@/types/entities";
import { useToast } from "@/components/ui/use-toast";

export default function TemplateDetailPage() {
  const { templateId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const store = useStore();
  const { fetchServerTemplatesByTemplateId, serverTemplates } = useServerTemplatesStore();

  const [template, setTemplate] = useState<any | null>(null);
  const [serverTemplatesLoading, setServerTemplatesLoading] = useState(true);

  const fetchTemplate = async () => {
    try {
      const data = await getTemplate(Number(templateId));
      setTemplate(data);
    } catch (error) {
      toast({ title: "❌ Error", description: "Failed to fetch template." });
    }
  };

  useEffect(() => {
    fetchTemplate();
    // Charger les server_templates liés à ce template
    setServerTemplatesLoading(true);
    fetchServerTemplatesByTemplateId(Number(templateId)).finally(() => setServerTemplatesLoading(false));
  }, [templateId]);

  const columns: ColumnDef<TemplateConfiguration>[] = [
    {
      accessorKey: "configuration.name",
      header: () => <span className="text-gray-900 font-medium">Configuration</span>,
      cell: ({ row }) => (
        <Link
          href={`/configurations/${row.original.configuration.id}`}
          className="text-blue-700 font-medium hover:underline"
        >
          {row.original.configuration.name}
        </Link>
      ),
    },
    {
      accessorKey: "order",
      header: () => <span className="text-gray-900 font-medium">Order</span>,
      cell: ({ row }) => (
        <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs">
          {row.original.order}
        </span>
      ),
    },
    {
      accessorKey: "comment",
      header: () => <span className="text-gray-900 font-medium">Comment</span>,
      cell: ({ row }) => (
        <span className="text-gray-700">{row.original.comment || <span className="text-gray-400 italic">—</span>}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const tc = row.original;
        return (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => store.openEditTemplateConfigurationModal(tc)}
              className="hover:bg-gray-100"
              aria-label="Edit"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-red-600 hover:bg-red-50"
              onClick={() => store.openDeleteTemplateConfigurationModal(tc)}
              aria-label="Delete"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  // Colonnes pour le tableau des serveurs associés au template
  const serverTemplateColumns: ColumnDef<any>[] = [
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

  if (!template) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10 px-2 sm:px-8">
      <div className="w-full space-y-8">
        {/* Header + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="border border-gray-200 bg-white hover:bg-gray-100">
              <Link href="/templates">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <PageHeader
              title={template.name}
              description={template.description ?? undefined}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => store.openEditTemplateModal(template)}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => store.openDeleteTemplateModal(template)}
            >
              <Trash className="h-4 w-4" />
              Delete
            </Button>
            <Button
              className="gap-2 ml-auto bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => store.openRunTemplateModal(template)}
            >
              <Plus className="h-4 w-4" />
              Run Template
            </Button>
          </div>
        </div>

        {/* Template Info */}
        <Card className="shadow border border-gray-100 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900 text-lg">Template Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Role</div>
                <div className="text-sm text-gray-900">{template.role?.name || <span className="text-gray-400 italic">—</span>}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Operating Systems</div>
                <div className="flex flex-wrap gap-2">
                  {template.operating_systems.length > 0 ? (
                    template.operating_systems.map((os: any) => (
                      <Badge key={os.id} variant="outline" className="text-xs border-gray-300">
                        <Link href={`/operating-systems/${os.id}`} className="hover:underline text-gray-800">
                          {os.name} {os.version}
                        </Link>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Created At</div>
                <div className="text-sm text-gray-900">
                  {template.created_at ? new Date(template.created_at).toLocaleString() : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Updated At</div>
                <div className="text-sm text-gray-900">
                  {template.updated_at ? new Date(template.updated_at).toLocaleString() : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Created By</div>
                <div className="text-sm flex items-center gap-2 text-gray-900">
                  {template.created_by_user ? (
                    <>
                      <User className="h-4 w-4" />
                      {template.created_by_user.username}
                    </>
                  ) : (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Updated By</div>
                <div className="text-sm flex items-center gap-2 text-gray-900">
                  {template.updated_by_user ? (
                    <>
                      <User className="h-4 w-4" />
                      {template.updated_by_user.username}
                    </>
                  ) : (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Included Configurations */}
        <DetailSection
          title="Included Configurations"
          action={{
            label: "Attach",
            onClick: () => store.openAttachConfigToTemplateModal?.(template),
          }}
        >
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-2">
            {template.template_configurations && template.template_configurations.length > 0 ? (
              <DataTable
                columns={columns}
                data={[...template.template_configurations].sort((a, b) => {
                  const aOrder = a.order ?? Infinity;
                  const bOrder = b.order ?? Infinity;
                  return aOrder - bOrder;
                })}
              />
            ) : (
              <div className="flex justify-center items-center py-6">
                <p className="text-gray-400 text-center">
                  No configurations attached to this template.
                </p>
              </div>
            )}
          </div>
        </DetailSection>

        {/* Associated Servers */}
        <Card className="shadow border border-gray-100 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900 text-lg">Associated Servers</CardTitle>
          </CardHeader>
          <CardContent>
            {serverTemplatesLoading ? (
              <div className="flex justify-center items-center py-6">
                <p className="text-gray-400 text-center">Loading...</p>
              </div>
            ) : serverTemplates && serverTemplates.length > 0 ? (
              <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-2">
                <DataTable columns={serverTemplateColumns} data={serverTemplates} />
              </div>
            ) : (
              <div className="flex justify-center items-center py-6">
                <p className="text-gray-400 text-center">
                  No servers attached to this template.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <EditTemplateModal onUpdated={fetchTemplate} />
        <DeleteTemplateModal onDeleted={() => router.push("/templates")} />
        <AttachTemplateConfigurationModal onAttached={fetchTemplate} />
        <EditTemplateConfigurationModal onUpdated={fetchTemplate} />
        <DeleteTemplateConfigurationModal onDeleted={fetchTemplate} />
      </div>
    </div>
  );
}
