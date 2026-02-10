"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, Users, Settings, LogOut, DollarSign, 
  Home, ChevronRight, Menu, X, Shield, Database
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    if (pathname === "/admin/login") { setIsLoading(false); return }
    if (!adminLoggedIn) { router.push("/admin/login") } else { setIsLoggedIn(true) }
    setIsLoading(false)
  }, [router, pathname])

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    router.push("/admin/login")
  }

  // 普通管理后台导航（用户+内容管理）
  const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "数据概览" },
    { href: "/admin/users", icon: Users, label: "用户管理" },
    { href: "/admin/pricing", icon: DollarSign, label: "定价管理" },
    { href: "/admin/database", icon: Database, label: "数据库" },
    { href: "/admin", icon: Settings, label: "系统设置" },
  ]

  if (pathname === "/admin/login") return <>{children}</>
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600" />
    </div>
  )
  if (!isLoggedIn) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm hidden sm:block">管理后台</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.push("/superadmin")} className="text-purple-600 text-xs">
              超管端
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="text-gray-500 text-xs">
              <Home className="h-4 w-4 mr-1" />前台
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 text-xs">
              <LogOut className="h-4 w-4 mr-1" />退出
            </Button>
          </div>
        </div>
      </header>

      <aside className={cn(
        "fixed left-0 top-14 bottom-0 w-52 bg-white border-r transition-transform z-40 overflow-y-auto",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-2 h-9 text-sm",
                pathname === item.href ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-600"
              )}
              onClick={() => { router.push(item.href); setSidebarOpen(false) }}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="pt-14 lg:pl-52 min-h-screen">
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  )
}
