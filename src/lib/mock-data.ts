import type {
  User,
  Server,
  Configuration,
  Template,
  Role,
  Environment,
  OperatingSystem,
  Project,
  Execution,
  ServerConfiguration,
  ServerTemplate,
} from "@/types/entities"

// Users
export const users: User[] = [
  {
    id: "user-1",
    username: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    createdAt: "2023-01-15T08:30:00Z",
    updatedAt: "2023-01-15T08:30:00Z",
  },
  {
    id: "user-2",
    username: "Jane Smith",
    email: "jane.smith@example.com",
    role: "DevOps",
    createdAt: "2023-02-20T10:15:00Z",
    updatedAt: "2023-02-20T10:15:00Z",
  },
  {
    id: "user-3",
    username: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "Developer",
    createdAt: "2023-03-10T14:45:00Z",
    updatedAt: "2023-03-10T14:45:00Z",
  },
  {
    id: "user-4",
    username: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "DevOps",
    createdAt: "2023-04-05T09:20:00Z",
    updatedAt: "2023-04-05T09:20:00Z",
  },
  {
    id: "user-5",
    username: "David Brown",
    email: "david.brown@example.com",
    role: "Admin",
    createdAt: "2023-05-12T11:30:00Z",
    updatedAt: "2023-05-12T11:30:00Z",
  },
]

// Operating Systems
export const operatingSystems: OperatingSystem[] = [
  {
    id: "os-1",
    name: "Ubuntu",
    version: "22.04 LTS",
    architecture: "x86_64",
    createdAt: "2023-01-10T08:00:00Z",
    updatedAt: "2023-01-10T08:00:00Z",
  },
  {
    id: "os-2",
    name: "CentOS",
    version: "8",
    architecture: "x86_64",
    createdAt: "2023-01-12T09:30:00Z",
    updatedAt: "2023-01-12T09:30:00Z",
  },
  {
    id: "os-3",
    name: "Debian",
    version: "11",
    architecture: "x86_64",
    createdAt: "2023-01-15T10:45:00Z",
    updatedAt: "2023-01-15T10:45:00Z",
  },
  {
    id: "os-4",
    name: "Red Hat Enterprise Linux",
    version: "9",
    architecture: "x86_64",
    createdAt: "2023-02-05T14:20:00Z",
    updatedAt: "2023-02-05T14:20:00Z",
  },
  {
    id: "os-5",
    name: "Alpine Linux",
    version: "3.17",
    architecture: "x86_64",
    createdAt: "2023-03-01T11:10:00Z",
    updatedAt: "2023-03-01T11:10:00Z",
  },
]

// Roles
export const roles: Role[] = [
  {
    id: "role-1",
    name: "Web Server",
    description: "Servers that host web applications",
    createdAt: "2023-01-20T08:15:00Z",
    updatedAt: "2023-01-20T08:15:00Z",
  },
  {
    id: "role-2",
    name: "Database Server",
    description: "Servers that host database instances",
    createdAt: "2023-01-22T09:45:00Z",
    updatedAt: "2023-01-22T09:45:00Z",
  },
  {
    id: "role-3",
    name: "Load Balancer",
    description: "Servers that distribute network traffic",
    createdAt: "2023-01-25T11:30:00Z",
    updatedAt: "2023-01-25T11:30:00Z",
  },
  {
    id: "role-4",
    name: "Cache Server",
    description: "Servers that provide caching services",
    createdAt: "2023-02-10T13:20:00Z",
    updatedAt: "2023-02-10T13:20:00Z",
  },
  {
    id: "role-5",
    name: "Application Server",
    description: "Servers that run application logic",
    createdAt: "2023-03-05T10:10:00Z",
    updatedAt: "2023-03-05T10:10:00Z",
  },
]

// Environments
export const environments: Environment[] = [
  {
    id: "env-1",
    name: "Development",
    description: "Environment for development and testing",
    createdAt: "2023-01-18T08:30:00Z",
    updatedAt: "2023-01-18T08:30:00Z",
  },
  {
    id: "env-2",
    name: "Staging",
    description: "Pre-production environment for final testing",
    createdAt: "2023-01-18T08:35:00Z",
    updatedAt: "2023-01-18T08:35:00Z",
  },
  {
    id: "env-3",
    name: "Production",
    description: "Live environment for end users",
    createdAt: "2023-01-18T08:40:00Z",
    updatedAt: "2023-01-18T08:40:00Z",
  },
  {
    id: "env-4",
    name: "QA",
    description: "Environment for quality assurance testing",
    createdAt: "2023-02-15T10:20:00Z",
    updatedAt: "2023-02-15T10:20:00Z",
  },
  {
    id: "env-5",
    name: "Demo",
    description: "Environment for demonstrations",
    createdAt: "2023-03-10T09:15:00Z",
    updatedAt: "2023-03-10T09:15:00Z",
  },
]

// Projects
export const projects: Project[] = [
  {
    id: "project-1",
    name: "E-commerce Platform",
    description: "Online shopping platform",
    environmentIds: ["env-1", "env-2", "env-3"],
    createdAt: "2023-01-25T09:00:00Z",
    updatedAt: "2023-01-25T09:00:00Z",
  },
  {
    id: "project-2",
    name: "CRM System",
    description: "Customer relationship management system",
    environmentIds: ["env-1", "env-3"],
    createdAt: "2023-02-01T10:30:00Z",
    updatedAt: "2023-02-01T10:30:00Z",
  },
  {
    id: "project-3",
    name: "Analytics Dashboard",
    description: "Data visualization and analytics platform",
    environmentIds: ["env-1", "env-2", "env-3"],
    createdAt: "2023-02-15T11:45:00Z",
    updatedAt: "2023-02-15T11:45:00Z",
  },
  {
    id: "project-4",
    name: "Content Management System",
    description: "Platform for managing digital content",
    environmentIds: ["env-1", "env-4", "env-3"],
    createdAt: "2023-03-05T13:15:00Z",
    updatedAt: "2023-03-05T13:15:00Z",
  },
  {
    id: "project-5",
    name: "Payment Gateway",
    description: "Secure payment processing system",
    environmentIds: ["env-1", "env-2", "env-3"],
    createdAt: "2023-04-10T09:30:00Z",
    updatedAt: "2023-04-10T09:30:00Z",
  },
]

// Servers
export const servers: Server[] = [
  {
    id: "server-1",
    name: "web-prod-01",
    hostname: "web-prod-01.example.com",
    ipAddress: "192.168.1.101",
    operatingSystemId: "os-1",
    roleIds: ["role-1"],
    environmentId: "env-3",
    projectId: "project-1",
    status: "online",
    createdAt: "2023-01-30T08:45:00Z",
    updatedAt: "2023-01-30T08:45:00Z",
  },
  {
    id: "server-2",
    name: "db-prod-01",
    hostname: "db-prod-01.example.com",
    ipAddress: "192.168.1.102",
    operatingSystemId: "os-2",
    roleIds: ["role-2"],
    environmentId: "env-3",
    projectId: "project-1",
    status: "online",
    createdAt: "2023-01-30T09:00:00Z",
    updatedAt: "2023-01-30T09:00:00Z",
  },
  {
    id: "server-3",
    name: "lb-prod-01",
    hostname: "lb-prod-01.example.com",
    ipAddress: "192.168.1.103",
    operatingSystemId: "os-1",
    roleIds: ["role-3"],
    environmentId: "env-3",
    projectId: "project-1",
    status: "online",
    createdAt: "2023-01-30T09:15:00Z",
    updatedAt: "2023-01-30T09:15:00Z",
  },
  {
    id: "server-4",
    name: "web-stage-01",
    hostname: "web-stage-01.example.com",
    ipAddress: "192.168.2.101",
    operatingSystemId: "os-1",
    roleIds: ["role-1"],
    environmentId: "env-2",
    projectId: "project-1",
    status: "online",
    createdAt: "2023-02-05T10:30:00Z",
    updatedAt: "2023-02-05T10:30:00Z",
  },
  {
    id: "server-5",
    name: "db-stage-01",
    hostname: "db-stage-01.example.com",
    ipAddress: "192.168.2.102",
    operatingSystemId: "os-2",
    roleIds: ["role-2"],
    environmentId: "env-2",
    projectId: "project-1",
    status: "maintenance",
    createdAt: "2023-02-05T10:45:00Z",
    updatedAt: "2023-02-05T10:45:00Z",
  },
  {
    id: "server-6",
    name: "app-prod-01",
    hostname: "app-prod-01.example.com",
    ipAddress: "192.168.1.104",
    operatingSystemId: "os-3",
    roleIds: ["role-5"],
    environmentId: "env-3",
    projectId: "project-2",
    status: "online",
    createdAt: "2023-02-10T11:15:00Z",
    updatedAt: "2023-02-10T11:15:00Z",
  },
  {
    id: "server-7",
    name: "db-prod-02",
    hostname: "db-prod-02.example.com",
    ipAddress: "192.168.1.105",
    operatingSystemId: "os-4",
    roleIds: ["role-2"],
    environmentId: "env-3",
    projectId: "project-2",
    status: "offline",
    createdAt: "2023-02-10T11:30:00Z",
    updatedAt: "2023-02-10T11:30:00Z",
  },
  {
    id: "server-8",
    name: "cache-prod-01",
    hostname: "cache-prod-01.example.com",
    ipAddress: "192.168.1.106",
    operatingSystemId: "os-5",
    roleIds: ["role-4"],
    environmentId: "env-3",
    projectId: "project-3",
    status: "online",
    createdAt: "2023-03-01T09:45:00Z",
    updatedAt: "2023-03-01T09:45:00Z",
  },
  {
    id: "server-9",
    name: "web-dev-01",
    hostname: "web-dev-01.example.com",
    ipAddress: "192.168.3.101",
    operatingSystemId: "os-1",
    roleIds: ["role-1"],
    environmentId: "env-1",
    projectId: "project-4",
    status: "online",
    createdAt: "2023-03-15T13:30:00Z",
    updatedAt: "2023-03-15T13:30:00Z",
  },
  {
    id: "server-10",
    name: "app-dev-01",
    hostname: "app-dev-01.example.com",
    ipAddress: "192.168.3.102",
    operatingSystemId: "os-3",
    roleIds: ["role-5"],
    environmentId: "env-1",
    projectId: "project-5",
    status: "online",
    createdAt: "2023-04-20T10:15:00Z",
    updatedAt: "2023-04-20T10:15:00Z",
  },
]

// Configurations
export const configurations: Configuration[] = [
  {
    id: "config-1",
    name: "NGINX Setup",
    description: "Basic NGINX web server configuration",
    compatibleOsIds: ["os-1", "os-3", "os-5"],
    createdAt: "2023-02-01T08:30:00Z",
    updatedAt: "2023-02-01T08:30:00Z",
  },
  {
    id: "config-2",
    name: "MySQL Installation",
    description: "MySQL database server installation and configuration",
    compatibleOsIds: ["os-1", "os-2", "os-3", "os-4"],
    createdAt: "2023-02-01T09:15:00Z",
    updatedAt: "2023-02-01T09:15:00Z",
  },
  {
    id: "config-3",
    name: "HAProxy Setup",
    description: "HAProxy load balancer configuration",
    compatibleOsIds: ["os-1", "os-2", "os-3"],
    createdAt: "2023-02-01T10:00:00Z",
    updatedAt: "2023-02-01T10:00:00Z",
  },
  {
    id: "config-4",
    name: "Redis Installation",
    description: "Redis cache server installation and configuration",
    compatibleOsIds: ["os-1", "os-3", "os-5"],
    createdAt: "2023-02-15T11:30:00Z",
    updatedAt: "2023-02-15T11:30:00Z",
  },
  {
    id: "config-5",
    name: "Node.js Environment",
    description: "Node.js runtime environment setup",
    compatibleOsIds: ["os-1", "os-2", "os-3", "os-4", "os-5"],
    createdAt: "2023-03-01T09:45:00Z",
    updatedAt: "2023-03-01T09:45:00Z",
  },
  {
    id: "config-6",
    name: "PHP-FPM Setup",
    description: "PHP-FPM installation and configuration",
    compatibleOsIds: ["os-1", "os-2", "os-3"],
    createdAt: "2023-03-10T13:20:00Z",
    updatedAt: "2023-03-10T13:20:00Z",
  },
  {
    id: "config-7",
    name: "PostgreSQL Installation",
    description: "PostgreSQL database server installation and configuration",
    compatibleOsIds: ["os-1", "os-2", "os-3", "os-4"],
    createdAt: "2023-03-20T10:15:00Z",
    updatedAt: "2023-03-20T10:15:00Z",
  },
  {
    id: "config-8",
    name: "MongoDB Setup",
    description: "MongoDB NoSQL database installation and configuration",
    compatibleOsIds: ["os-1", "os-2", "os-3", "os-4"],
    createdAt: "2023-04-05T09:30:00Z",
    updatedAt: "2023-04-05T09:30:00Z",
  },
]

// Templates
export const templates: Template[] = [
  {
    id: "template-1",
    name: "Web Server Stack",
    description: "Complete web server stack with NGINX and PHP",
    compatibleOsIds: ["os-1", "os-3"],
    compatibleRoleIds: ["role-1"],
    configurationIds: ["config-1", "config-6"],
    createdAt: "2023-02-10T08:45:00Z",
    updatedAt: "2023-02-10T08:45:00Z",
  },
  {
    id: "template-2",
    name: "Database Server Stack",
    description: "Complete database server setup with MySQL",
    compatibleOsIds: ["os-1", "os-2", "os-3", "os-4"],
    compatibleRoleIds: ["role-2"],
    configurationIds: ["config-2"],
    createdAt: "2023-02-10T09:30:00Z",
    updatedAt: "2023-02-10T09:30:00Z",
  },
  {
    id: "template-3",
    name: "Load Balancer Stack",
    description: "Complete load balancer setup with HAProxy",
    compatibleOsIds: ["os-1", "os-2", "os-3"],
    compatibleRoleIds: ["role-3"],
    configurationIds: ["config-3"],
    createdAt: "2023-02-10T10:15:00Z",
    updatedAt: "2023-02-10T10:15:00Z",
  },
  {
    id: "template-4",
    name: "Cache Server Stack",
    description: "Complete cache server setup with Redis",
    compatibleOsIds: ["os-1", "os-3", "os-5"],
    compatibleRoleIds: ["role-4"],
    configurationIds: ["config-4"],
    createdAt: "2023-02-20T11:45:00Z",
    updatedAt: "2023-02-20T11:45:00Z",
  },
  {
    id: "template-5",
    name: "Node.js Application Server",
    description: "Complete Node.js application server setup",
    compatibleOsIds: ["os-1", "os-2", "os-3", "os-4", "os-5"],
    compatibleRoleIds: ["role-5"],
    configurationIds: ["config-5"],
    createdAt: "2023-03-05T10:30:00Z",
    updatedAt: "2023-03-05T10:30:00Z",
  },
  {
    id: "template-6",
    name: "LAMP Stack",
    description: "Linux, Apache, MySQL, PHP stack",
    compatibleOsIds: ["os-1", "os-2", "os-3"],
    compatibleRoleIds: ["role-1", "role-2"],
    configurationIds: ["config-2", "config-6"],
    createdAt: "2023-03-15T13:45:00Z",
    updatedAt: "2023-03-15T13:45:00Z",
  },
  {
    id: "template-7",
    name: "MEAN Stack",
    description: "MongoDB, Express, Angular, Node.js stack",
    compatibleOsIds: ["os-1", "os-3"],
    compatibleRoleIds: ["role-1", "role-5"],
    configurationIds: ["config-5", "config-8"],
    createdAt: "2023-04-10T09:15:00Z",
    updatedAt: "2023-04-10T09:15:00Z",
  },
]

// Executions
export const executions: Execution[] = [
  {
    id: "exec-1",
    name: "Deploy Web Server Stack to Production",
    status: "completed",
    templateId: "template-1",
    serverIds: ["server-1"],
    startedAt: "2023-02-15T09:00:00Z",
    completedAt: "2023-02-15T09:15:00Z",
    createdAt: "2023-02-15T09:00:00Z",
    updatedAt: "2023-02-15T09:15:00Z",
  },
  {
    id: "exec-2",
    name: "Deploy Database Server Stack to Production",
    status: "completed",
    templateId: "template-2",
    serverIds: ["server-2"],
    startedAt: "2023-02-15T09:30:00Z",
    completedAt: "2023-02-15T09:45:00Z",
    createdAt: "2023-02-15T09:30:00Z",
    updatedAt: "2023-02-15T09:45:00Z",
  },
  {
    id: "exec-3",
    name: "Deploy Load Balancer Stack to Production",
    status: "completed",
    templateId: "template-3",
    serverIds: ["server-3"],
    startedAt: "2023-02-15T10:00:00Z",
    completedAt: "2023-02-15T10:15:00Z",
    createdAt: "2023-02-15T10:00:00Z",
    updatedAt: "2023-02-15T10:15:00Z",
  },
  {
    id: "exec-4",
    name: "Deploy Web Server Stack to Staging",
    status: "completed",
    templateId: "template-1",
    serverIds: ["server-4"],
    startedAt: "2023-02-20T11:00:00Z",
    completedAt: "2023-02-20T11:15:00Z",
    createdAt: "2023-02-20T11:00:00Z",
    updatedAt: "2023-02-20T11:15:00Z",
  },
  {
    id: "exec-5",
    name: "Deploy Database Server Stack to Staging",
    status: "failed",
    templateId: "template-2",
    serverIds: ["server-5"],
    startedAt: "2023-02-20T11:30:00Z",
    completedAt: "2023-02-20T11:45:00Z",
    createdAt: "2023-02-20T11:30:00Z",
    updatedAt: "2023-02-20T11:45:00Z",
  },
  {
    id: "exec-6",
    name: "Deploy Node.js Application Server to Production",
    status: "completed",
    templateId: "template-5",
    serverIds: ["server-6"],
    startedAt: "2023-03-10T09:00:00Z",
    completedAt: "2023-03-10T09:15:00Z",
    createdAt: "2023-03-10T09:00:00Z",
    updatedAt: "2023-03-10T09:15:00Z",
  },
  {
    id: "exec-7",
    name: "Deploy Cache Server Stack to Production",
    status: "completed",
    templateId: "template-4",
    serverIds: ["server-8"],
    startedAt: "2023-03-15T10:30:00Z",
    completedAt: "2023-03-15T10:45:00Z",
    createdAt: "2023-03-15T10:30:00Z",
    updatedAt: "2023-03-15T10:45:00Z",
  },
  {
    id: "exec-8",
    name: "Deploy LAMP Stack to Development",
    status: "running",
    templateId: "template-6",
    serverIds: ["server-9"],
    startedAt: "2023-04-25T13:00:00Z",
    createdAt: "2023-04-25T13:00:00Z",
    updatedAt: "2023-04-25T13:00:00Z",
  },
  {
    id: "exec-9",
    name: "Deploy MEAN Stack to Development",
    status: "pending",
    templateId: "template-7",
    serverIds: ["server-10"],
    startedAt: "2023-04-25T13:30:00Z",
    createdAt: "2023-04-25T13:30:00Z",
    updatedAt: "2023-04-25T13:30:00Z",
  },
  {
    id: "exec-10",
    name: "Run NGINX Setup on Production Web Server",
    status: "completed",
    configurationId: "config-1",
    serverIds: ["server-1"],
    startedAt: "2023-02-12T08:30:00Z",
    completedAt: "2023-02-12T08:40:00Z",
    createdAt: "2023-02-12T08:30:00Z",
    updatedAt: "2023-02-12T08:40:00Z",
  },
]

// ServerConfigurations
export const serverConfigurations: ServerConfiguration[] = [
  {
    id: "server-config-1",
    serverId: "server-1",
    configurationId: "config-1",
    status: "completed",
    executedAt: "2023-02-12T08:40:00Z",
    createdAt: "2023-02-12T08:30:00Z",
    updatedAt: "2023-02-12T08:40:00Z",
  },
  {
    id: "server-config-2",
    serverId: "server-1",
    configurationId: "config-6",
    status: "completed",
    executedAt: "2023-02-15T09:15:00Z",
    createdAt: "2023-02-15T09:00:00Z",
    updatedAt: "2023-02-15T09:15:00Z",
  },
  {
    id: "server-config-3",
    serverId: "server-2",
    configurationId: "config-2",
    status: "completed",
    executedAt: "2023-02-15T09:45:00Z",
    createdAt: "2023-02-15T09:30:00Z",
    updatedAt: "2023-02-15T09:45:00Z",
  },
  {
    id: "server-config-4",
    serverId: "server-3",
    configurationId: "config-3",
    status: "completed",
    executedAt: "2023-02-15T10:15:00Z",
    createdAt: "2023-02-15T10:00:00Z",
    updatedAt: "2023-02-15T10:15:00Z",
  },
  {
    id: "server-config-5",
    serverId: "server-4",
    configurationId: "config-1",
    status: "completed",
    executedAt: "2023-02-20T11:15:00Z",
    createdAt: "2023-02-20T11:00:00Z",
    updatedAt: "2023-02-20T11:15:00Z",
  },
  {
    id: "server-config-6",
    serverId: "server-5",
    configurationId: "config-2",
    status: "failed",
    executedAt: "2023-02-20T11:45:00Z",
    createdAt: "2023-02-20T11:30:00Z",
    updatedAt: "2023-02-20T11:45:00Z",
  },
  {
    id: "server-config-7",
    serverId: "server-6",
    configurationId: "config-5",
    status: "completed",
    executedAt: "2023-03-10T09:15:00Z",
    createdAt: "2023-03-10T09:00:00Z",
    updatedAt: "2023-03-10T09:15:00Z",
  },
  {
    id: "server-config-8",
    serverId: "server-8",
    configurationId: "config-4",
    status: "completed",
    executedAt: "2023-03-15T10:45:00Z",
    createdAt: "2023-03-15T10:30:00Z",
    updatedAt: "2023-03-15T10:45:00Z",
  },
]

// ServerTemplates
export const serverTemplates: ServerTemplate[] = [
  {
    id: "server-template-1",
    serverId: "server-1",
    templateId: "template-1",
    status: "completed",
    executedAt: "2023-02-15T09:15:00Z",
    createdAt: "2023-02-15T09:00:00Z",
    updatedAt: "2023-02-15T09:15:00Z",
  },
  {
    id: "server-template-2",
    serverId: "server-2",
    templateId: "template-2",
    status: "completed",
    executedAt: "2023-02-15T09:45:00Z",
    createdAt: "2023-02-15T09:30:00Z",
    updatedAt: "2023-02-15T09:45:00Z",
  },
  {
    id: "server-template-3",
    serverId: "server-3",
    templateId: "template-3",
    status: "completed",
    executedAt: "2023-02-15T10:15:00Z",
    createdAt: "2023-02-15T10:00:00Z",
    updatedAt: "2023-02-15T10:15:00Z",
  },
  {
    id: "server-template-4",
    serverId: "server-4",
    templateId: "template-1",
    status: "completed",
    executedAt: "2023-02-20T11:15:00Z",
    createdAt: "2023-02-20T11:00:00Z",
    updatedAt: "2023-02-20T11:15:00Z",
  },
  {
    id: "server-template-5",
    serverId: "server-5",
    templateId: "template-2",
    status: "failed",
    executedAt: "2023-02-20T11:45:00Z",
    createdAt: "2023-02-20T11:30:00Z",
    updatedAt: "2023-02-20T11:45:00Z",
  },
  {
    id: "server-template-6",
    serverId: "server-6",
    templateId: "template-5",
    status: "completed",
    executedAt: "2023-03-10T09:15:00Z",
    createdAt: "2023-03-10T09:00:00Z",
    updatedAt: "2023-03-10T09:15:00Z",
  },
  {
    id: "server-template-7",
    serverId: "server-8",
    templateId: "template-4",
    status: "completed",
    executedAt: "2023-03-15T10:45:00Z",
    createdAt: "2023-03-15T10:30:00Z",
    updatedAt: "2023-03-15T10:45:00Z",
  },
]

// Helper functions to get related data
export const getServersByUserId = (userId: string): Server[] => {
  // In a real app, this would query the database
  // For now, just return some mock servers
  return servers.slice(0, 3)
}

export const getServersByRoleId = (roleId: string): Server[] => {
  return servers.filter((server) => server.roleIds.includes(roleId))
}

export const getServersByEnvironmentId = (environmentId: string): Server[] => {
  return servers.filter((server) => server.environmentId === environmentId)
}

export const getServersByOperatingSystemId = (osId: string): Server[] => {
  return servers.filter((server) => server.operatingSystemId === osId)
}

export const getServersByProjectId = (projectId: string): Server[] => {
  return servers.filter((server) => server.projectId === projectId)
}

export const getTemplatesByRoleId = (roleId: string): Template[] => {
  return templates.filter((template) => template.compatibleRoleIds.includes(roleId))
}

export const getTemplatesByOperatingSystemId = (osId: string): Template[] => {
  return templates.filter((template) => template.compatibleOsIds.includes(osId))
}

export const getConfigurationsByOperatingSystemId = (osId: string): Configuration[] => {
  return configurations.filter((config) => config.compatibleOsIds.includes(osId))
}

export const getServerConfigurationsByServerId = (serverId: string): ServerConfiguration[] => {
  return serverConfigurations.filter((sc) => sc.serverId === serverId)
}

export const getServerTemplatesByServerId = (serverId: string): ServerTemplate[] => {
  return serverTemplates.filter((st) => st.serverId === serverId)
}

export const getExecutionsByServerId = (serverId: string): Execution[] => {
  return executions.filter((exec) => exec.serverIds.includes(serverId))
}

export const getExecutionsByTemplateId = (templateId: string): Execution[] => {
  return executions.filter((exec) => exec.templateId === templateId)
}

export const getExecutionsByConfigurationId = (configId: string): Execution[] => {
  return executions.filter((exec) => exec.configurationId === configId)
}

export const getEnvironmentsByProjectId = (projectId: string): Environment[] => {
  const project = projects.find((p) => p.id === projectId)
  if (!project) return []
  return environments.filter((env) => project.environmentIds.includes(env.id))
}

// Lookup functions
export const getOperatingSystemById = (id: string): OperatingSystem | undefined => {
  return operatingSystems.find((os) => os.id === id)
}

export const getRoleById = (id: string): Role | undefined => {
  return roles.find((role) => role.id === id)
}

export const getEnvironmentById = (id: string): Environment | undefined => {
  return environments.find((env) => env.id === id)
}

export const getProjectById = (id: string): Project | undefined => {
  return projects.find((project) => project.id === id)
}

export const getConfigurationById = (id: string): Configuration | undefined => {
  return configurations.find((config) => config.id === id)
}

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find((template) => template.id === id)
}

export const getServerById = (id: string): Server | undefined => {
  return servers.find((server) => server.id === id)
}

export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id)
}
