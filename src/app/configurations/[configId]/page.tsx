"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash, Play, FileCode, Server, LayoutTemplate, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { getConfiguration } from "@/lib/api/configuration"
import { EditConfigurationModal } from "@/components/configurations/edit-configuration-modal"
import { DeleteConfigurationModal } from "@/components/configurations/delete-configuration-modal"
import type { Configuration } from "@/types/entities"

export default function ConfigurationDetailPage() {
  const { configId } = useParams()
  const store = useStore()
  const [configuration, setConfiguration] = useState<Configuration | null>(null)

  const fetchConfiguration = async () => {
    try {
      const data = await getConfiguration(Number(configId))
      setConfiguration(data)
    } catch (error) {
      console.error("Failed to load configuration", error)
    }
  }

  useEffect(() => {
    fetchConfiguration()
  }, [configId])

  if (!configuration) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Configuration not found</h1>
          <p className="mt-2 text-muted-foreground">The configuration you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/configurations">Back to Configurations</Link>
          </Button>
        </div>
      </div>
    )
  }

  const serverCount = configuration.configuration_servers?.length ?? 0
  const templateCount = configuration.configuration_templates?.length ?? 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/configurations">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title={configuration.name} description={configuration.description} />
      </div>

      <div className="flex gap-4">
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
          className="gap-2 text-destructive"
          onClick={() => store.openDeleteConfigurationModal(configuration)}
        >
          <Trash className="h-4 w-4" />
          Delete
        </Button>
        <Button className="gap-2 ml-auto" onClick={() => store.openRunConfigurationModal(configuration)}>
          <Play className="h-4 w-4" />
          Run Configuration
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuration Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-sm">{configuration.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Command</dt>
                <dd className="text-sm">{configuration.command}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                <dd className="text-sm">{configuration.description}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
                <dd className="text-sm">{new Date(configuration.created_at).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created By</dt>
                <dd className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {configuration.created_by_user.username}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Updated At</dt>
                <dd className="text-sm">
                  {configuration.updated_at ? new Date(configuration.updated_at).toLocaleString() : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Updated By</dt>
                <dd className="text-sm flex items-center gap-2">
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

        <Card>
          <CardHeader>
            <CardTitle>Compatible Operating Systems</CardTitle>
          </CardHeader>
          <CardContent>
            {configuration.operating_systems.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {configuration.operating_systems.map((os) => (
                  <Badge key={os.id} variant="outline" className="text-sm">
                    <Link href={`/operating-systems/${os.id}`} className="hover:underline">
                      {os.name} {os.version}
                    </Link>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No compatible operating systems defined.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Associated Servers</CardTitle>
          </CardHeader>
          <CardContent>
            {serverCount > 0 ? (
              <ul className="text-sm text-muted-foreground space-y-1">
                {configuration.configuration_servers.map((cs, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <span>Server ID: {cs.id}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No servers associated with this configuration.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Associated Templates</CardTitle>
          </CardHeader>
          <CardContent>
            {templateCount > 0 ? (
              <ul className="text-sm text-muted-foreground space-y-1">
                {configuration.configuration_templates.map((ct, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
                    <span>{ct.template.name}</span>
                    <span className="text-xs">(order: {ct.order})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No templates associated with this configuration.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <EditConfigurationModal onUpdated={fetchConfiguration} />
      <DeleteConfigurationModal onDeleted={() => (window.location.href = "/configurations")} />
    </div>
  )
}
