'use client'

import { Inter } from "next/font/google"
import "./globals.css"
import { usePathname } from "next/navigation"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import AuthContextProvider from "@/components/layout/auth-provider"
import AuthGuard from "@/lib/auth/AuthGuard"
import { Toaster } from "@/components/ui/toaster"
import { ToastProvider } from "@/components/ui/use-toast"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const publicRoutes = ["/login"]
  const isPublic = publicRoutes.includes(pathname)

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ToastProvider> {/* ✅ Wrapping everything */}
            <AuthContextProvider>
              {isPublic ? (
                children
              ) : (
                <AuthGuard>
                  <div className="flex h-screen">
                    <Sidebar />
                    <div className="flex flex-1 flex-col">
                      <Navbar />
                      <main className="flex-1 overflow-auto p-6">{children}</main>
                    </div>
                  </div>
                </AuthGuard>
              )}
              <Toaster /> {/* ✅ Renderer */}
            </AuthContextProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
