"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash, Server, FileCode, Layers } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { DetailSection } from "@/components/ui/detail-section"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { useStore } from "@/lib/store"
import { getOperatingSystem } from "@/lib/api/operating-system"
import type {
  OperatingSystem,
  ServerShort,
  ConfigurationShort,
  TemplateShort,
} from "@/types/entities"

import { EditOsModal } from "@/components/operating-systems/edit-os-modal"
import { DeleteOsModal } from "@/components/operating-systems/delete-os-modal"

export default function OperatingSystemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const osId = Number(params.osId)
  const store = useStore()

  const [os, setOs] = useState<OperatingSystem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchOperatingSystem = async () => {
    setIsLoading(true)
    try {
      const data = await getOperatingSystem(osId)
      setOs(data)
    } catch (error) {
      console.error("Failed to fetch operating system", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleted = () => {
    router.push("/operating-systems")
  }

  useEffect(() => {
    fetchOperatingSystem()
  }, [osId])

  const serverColumns: ColumnDef<ServerShort>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Link href={`/servers/${row.original.id}`} className="font-medium hover:underline">
          {row.getValue("name")}
        </Link>
      ),
    },
    {
      accessorKey: "ip_address",
      header: "IP Address",
    },
  ]

  const configColumns: ColumnDef<ConfigurationShort>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Link href={`/configurations/${row.original.id}`} className="font-medium hover:underline">
          {row.getValue("name")}
        </Link>
      ),
    },
  ]

  const templateColumns: ColumnDef<TemplateShort>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Link href={`/templates/${row.original.id}`} className="font-medium hover:underline">
          {row.getValue("name")}
        </Link>
      ),
    },
  ]

  if (isLoading) return <p className="text-center">Loading...</p>

  if (!os) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Operating System not found</h1>
          <p className="mt-2 text-muted-foreground">The operating system you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/operating-systems">Back to Operating Systems</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/operating-systems">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title={`${os.name} ${os.version || ""}`} />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => store.openEditOsModal(os)}>
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button variant="outline" className="text-destructive" onClick={() => store.openDeleteOsModal(os)}>
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <DetailSection title="Operating System Metadata">
        <dl className="grid gap-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
            <dd className="text-sm">
              {os.created_at ? new Date(os.created_at).toLocaleString() : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Created By</dt>
            <dd className="text-sm">{os.created_by_user?.username || "—"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Updated At</dt>
            <dd className="text-sm">
              {os.updated_at ? new Date(os.updated_at).toLocaleString() : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Updated By</dt>
            <dd className="text-sm">{os.updated_by_user?.username || "—"}</dd>
          </div>
        </dl>
      </DetailSection>

      <DetailSection title="Servers using this OS">
        {os.servers?.length ? (
          <DataTable
            columns={serverColumns}
            data={os.servers}
            searchColumn="name"
            searchPlaceholder="Search servers..."
          />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <Server className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No servers are using this operating system.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      <DetailSection title="Compatible Configurations">
        {os.configurations?.length ? (
          <DataTable
            columns={configColumns}
            data={os.configurations}
            searchColumn="name"
            searchPlaceholder="Search configurations..."
          />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <FileCode className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No configurations are compatible with this OS.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      <DetailSection title="Compatible Templates">
        {os.templates?.length ? (
          <DataTable
            columns={templateColumns}
            data={os.templates}
            searchColumn="name"
            searchPlaceholder="Search templates..."
          />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <Layers className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No templates are compatible with this OS.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      <EditOsModal onUpdated={fetchOperatingSystem} />
      <DeleteOsModal onDeleted={handleDeleted} />
    </div>
  )
}
