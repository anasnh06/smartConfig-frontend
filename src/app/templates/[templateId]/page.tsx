"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash, Plus, Pencil, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { DetailSection } from "@/components/ui/detail-section";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";

import { EditTemplateModal } from "@/components/templates/edit-template-modal";
import { DeleteTemplateModal } from "@/components/templates/delete-template-modal";
import { RunTemplateModal } from "@/components/templates/run-template-modal";
import { AttachTemplateConfigurationModal } from "@/components/templates/attach-template-configuration-modal";
import { EditTemplateConfigurationModal } from "@/components/templates/edit-template-configuration-modal";
import { DeleteTemplateConfigurationModal } from "@/components/templates/delete-template-configuration-modal";

import { useStore } from "@/lib/store";
import { getTemplate } from "@/lib/api/template";
import type { ColumnDef } from "@tanstack/react-table";
import type { TemplateConfiguration } from "@/types/entities";
import { useToast } from "@/components/ui/use-toast";

export default function TemplateDetailPage() {
  const { templateId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const store = useStore();

  const [template, setTemplate] = useState<any | null>(null);

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
  }, [templateId]);

  const columns: ColumnDef<TemplateConfiguration>[] = [
    {
      accessorKey: "configuration.name",
      header: "Configuration",
    },
    {
      accessorKey: "order",
      header: "Order",
    },
    {
      accessorKey: "comment",
      header: "Comment",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const tc = row.original;
        return (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => store.openEditTemplateConfigurationModal(tc)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-destructive"
              onClick={() => store.openDeleteTemplateConfigurationModal(tc)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (!template) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/templates">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title={template.name}
          description={template.description ?? undefined}
        />
      </div>

      <div className="flex gap-4">
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
          className="gap-2 text-destructive"
          onClick={() => store.openDeleteTemplateModal(template)}
        >
          <Trash className="h-4 w-4" />
          Delete
        </Button>
        <Button
          className="gap-2 ml-auto"
          onClick={() => store.openRunTemplateModal(template)}
        >
          <Plus className="h-4 w-4" />
          Run Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Role</div>
              <div className="text-sm">{template.role?.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Operating Systems</div>
              <div className="flex flex-wrap gap-2">
                {template.operating_systems.map((os: any) => (
                  <Badge key={os.id} variant="outline">
                    <Link href={`/operating-systems/${os.id}`} className="hover:underline">
                      {os.name} {os.version}
                    </Link>
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Created At</div>
              <div className="text-sm">
                {template.created_at ? new Date(template.created_at).toLocaleString() : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Updated At</div>
              <div className="text-sm">
                {template.updated_at ? new Date(template.updated_at).toLocaleString() : "N/A"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <DetailSection
        title="Included Configurations"
        action={{
          label: "Attach",
          onClick: () => store.openAttachConfigToTemplateModal?.(template),
        }}
      >
        <DataTable
          columns={columns}
          data={[...template.template_configurations].sort((a, b) => {
            const aOrder = a.order ?? Infinity;
            const bOrder = b.order ?? Infinity;
            return aOrder - bOrder;
          })}
        />
      </DetailSection>

      <EditTemplateModal onUpdated={fetchTemplate} />
      <DeleteTemplateModal onDeleted={() => router.push("/templates")} />
      <RunTemplateModal />
      <AttachTemplateConfigurationModal onAttached={fetchTemplate} />
      <EditTemplateConfigurationModal onUpdated={fetchTemplate} />
      <DeleteTemplateConfigurationModal onDeleted={fetchTemplate} />
    </div>
  );
}
