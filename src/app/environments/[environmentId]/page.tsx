"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash, Server } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { DetailSection } from "@/components/ui/detail-section"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { getEnvironment } from "@/lib/api/environment"
import type { Environment, ServerShort } from "@/types/entities"
import { EditEnvironmentModal } from "@/components/environments/edit-environment-modal"
import { DeleteEnvironmentModal } from "@/components/environments/delete-environment-modal"

export default function EnvironmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const environmentId = Number(params.environmentId)
  const store = useStore()

  const [environment, setEnvironment] = useState<Environment | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchEnvironment = async () => {
    setIsLoading(true)
    try {
      const data = await getEnvironment(environmentId)
      setEnvironment(data)
    } catch (error) {
      console.error("Failed to fetch environment", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleted = () => {
    router.push("/environments")
  }

  useEffect(() => {
    fetchEnvironment()
  }, [environmentId])

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
      cell: ({ row }) => row.getValue("ip_address"),
    },
  ]

  if (isLoading) return <p className="text-center">Loading...</p>

  if (!environment) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Environment not found</h1>
          <p className="mt-2 text-muted-foreground">The environment you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/environments">Back to Environments</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/environments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title={environment.name} />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => store.openEditEnvironmentModal(environment)}>
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          className="text-destructive"
          onClick={() => store.openDeleteEnvironmentModal(environment)}
        >
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <DetailSection title="Environment Metadata">
        <dl className="grid gap-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
            <dd className="text-sm">{environment.created_at ? new Date(environment.created_at).toLocaleString() : "—"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Created By</dt>
            <dd className="text-sm">{environment.created_by_user?.username || "—"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Updated At</dt>
            <dd className="text-sm">{environment.updated_at ? new Date(environment.updated_at).toLocaleString() : "—"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Updated By</dt>
            <dd className="text-sm">{environment.updated_by_user?.username || "—"}</dd>
          </div>
        </dl>
      </DetailSection>

      <DetailSection title="Servers in this Environment">
        {environment.servers?.length ? (
          <DataTable
            columns={serverColumns}
            data={environment.servers}
            searchColumn="name"
            searchPlaceholder="Search servers..."
          />
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <Server className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No servers are assigned to this environment.</p>
            </CardContent>
          </Card>
        )}
      </DetailSection>

      <EditEnvironmentModal />
      <DeleteEnvironmentModal />
    </div>
  )
}
