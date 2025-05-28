import Link from "next/link"
import { ArrowRight, Server, FileCode, Layers, Play, AlertTriangle } from "lucide-react"

import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { servers, executions } from "@/lib/mock-data"

export default function Dashboard() {
  // Get counts for dashboard stats
  const totalServers = servers.length
  const onlineServers = servers.filter((server) => server.status === "online").length
  const offlineServers = servers.filter((server) => server.status === "offline").length
  const maintenanceServers = servers.filter((server) => server.status === "maintenance").length

  // Get recent executions
  const recentExecutions = executions.slice(0, 5)

  // Get servers with issues
  const serversWithIssues = servers.filter((server) => server.status !== "online").slice(0, 3)

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of your infrastructure automation platform" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Servers</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServers}</div>
            <p className="text-xs text-muted-foreground">
              {onlineServers} online, {offlineServers} offline, {maintenanceServers} maintenance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configurations</CardTitle>
            <FileCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Ready to deploy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Available for deployment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Executions</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">In the last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Executions</CardTitle>
            <CardDescription>Latest deployment activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExecutions.map((execution) => (
                <div key={execution.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{execution.name}</p>
                    <p className="text-sm text-muted-foreground">{new Date(execution.startedAt).toLocaleString()}</p>
                  </div>
                  <StatusBadge status={execution.status} />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/executions" className="w-full">
              <Button variant="outline" className="w-full">
                View All Executions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Servers Requiring Attention</CardTitle>
            <CardDescription>Servers that are offline or in maintenance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serversWithIssues.length > 0 ? (
                serversWithIssues.map((server) => (
                  <div key={server.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{server.name}</p>
                      <p className="text-sm text-muted-foreground">{server.hostname}</p>
                    </div>
                    <StatusBadge status={server.status} />
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-4">
                  <div className="text-center">
                    <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">No servers requiring attention</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/servers" className="w-full">
              <Button variant="outline" className="w-full">
                View All Servers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
