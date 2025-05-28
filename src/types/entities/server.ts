export type Server = {
  id: string
  name: string
  hostname: string
  ipAddress: string
  operatingSystemId: string
  roleIds: string[]
  environmentId: string
  projectId: string
  status: "online" | "offline" | "maintenance"
  createdAt: string
  updatedAt: string
}
