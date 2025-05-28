'use client'

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth/useAuth"
import UserMenu from "@/components/layout/user-menu"

export function Navbar() {
  const { user } = useAuth()

  return (
    <div className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <div className="w-full flex-1">
        <form className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
          />
        </form>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        {user && <UserMenu />}
      </div>
    </div>
  )
}
