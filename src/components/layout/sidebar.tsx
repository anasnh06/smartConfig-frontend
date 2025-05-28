"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Server,
  Settings,
  FileCode,
  Layers,
  Play,
  Tag,
  Briefcase,
  Globe,
  Monitor,
  ChevronDown,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  href: string
  isActive?: boolean
}

const SidebarItem = ({ icon: Icon, label, href, isActive }: SidebarItemProps) => {
  return (
    <Link href={href} className="w-full">
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn("w-full justify-start gap-2", isActive ? "bg-muted hover:bg-muted" : "")}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Button>
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Server className="h-5 w-5" />
          <span>Infrastructure Manager</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/" isActive={pathname === "/"} />
          <SidebarItem
            icon={Users}
            label="Users"
            href="/users"
            isActive={pathname === "/users" || pathname.startsWith("/users/")}
          />
          <SidebarItem
            icon={Server}
            label="Servers"
            href="/servers"
            isActive={pathname === "/servers" || pathname.startsWith("/servers/")}
          />
          <SidebarItem
            icon={FileCode}
            label="Configurations"
            href="/configurations"
            isActive={pathname === "/configurations" || pathname.startsWith("/configurations/")}
          />
          <SidebarItem
            icon={Layers}
            label="Templates"
            href="/templates"
            isActive={pathname === "/templates" || pathname.startsWith("/templates/")}
          />
          <SidebarItem
            icon={Play}
            label="Executions"
            href="/executions"
            isActive={pathname === "/executions" || pathname.startsWith("/executions/")}
          />

          <Collapsible className="mt-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6">
              <nav className="grid gap-1 pt-1">
                <SidebarItem
                  icon={Tag}
                  label="Roles"
                  href="/roles"
                  isActive={pathname === "/roles" || pathname.startsWith("/roles/")}
                />
                <SidebarItem
                  icon={Briefcase}
                  label="Projects"
                  href="/projects"
                  isActive={pathname === "/projects" || pathname.startsWith("/projects/")}
                />
                <SidebarItem
                  icon={Globe}
                  label="Environments"
                  href="/environments"
                  isActive={pathname === "/environments" || pathname.startsWith("/environments/")}
                />
                <SidebarItem
                  icon={Monitor}
                  label="Operating Systems"
                  href="/operating-systems"
                  isActive={pathname === "/operating-systems" || pathname.startsWith("/operating-systems/")}
                />
              </nav>
            </CollapsibleContent>
          </Collapsible>
        </nav>
      </div>
    </div>
  )
}
