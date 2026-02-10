"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Building2, Settings, LogOut, Database, DollarSign,
  Home, Menu, X, Shield, Users, BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem("superAdminLoggedIn") === "true"
    if (pathname === "/superadmin/login") { setIsLoading(false); return }
    if (!loggedIn) { router.push("/superadmin/login") } else { setIsLoggedIn(true) }
    setIsLoading(false)
  }, [router, pathname])

  const handleLogout = () => {
    localStorage.removeItem("superAdminLoggedIn")
    router.push("/superadmin/login")
  }

  // 超管导航：企业管理 + 定价 + 数据库 + 系统设置
  const navItems = [
    { href: "/superadmin", icon: BarChart3, label: "概览" },
    { href: "/superadmin/enterprises", icon: Building2, label: "企业管理" },
    { href: "/superadmin/users", icon: Users, label: "用户总览" },
    { href: "/superadmin/pricing", icon: DollarSign, label: "全局定价" },
    { href: "/superadmin/finance", icon: DollarSign, label: "财务数据" },
    { href: "/superadmin/database", icon: Database, label: "数据库管理" },
    { href: "/superadmin/settings", icon: Settings, label: "系统设置" },
  ]

  if (pathname === "/superadmin/login") return <>{children}</>
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-400" />
    </div>
  )
  if (!isLoggedIn) return null

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 顶部 */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-gray-800 border-b border-gray-700 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden text-gray-300" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm hidden sm:block">超级管理后台</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/dashboard")} className="text-gray-300 text-xs">
              <Home className="h-4 w-4 mr-1" />管理台
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-400 text-xs">
              <LogOut className="h-4 w-4 mr-1" />退出
            </Button>
          </div>
        </div>
      </header>

      {/* 侧边栏 */}
      <aside className={cn(
        "fixed left-0 top-14 bottom-0 w-52 bg-gray-800 border-r border-gray-700 transition-transform z-40 overflow-y-auto",
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
                pathname === item.href
                  ? "bg-purple-600/20 text-purple-300 font-medium"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              )}
              onClick={() => { router.push(item.href); setSidebarOpen(false) }}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="pt-14 lg:pl-52 min-h-screen">
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  )
}
