"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard, Building2, CreditCard, Tag, Users, Settings,
  LogOut, Home, Menu, X, Shield, ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

// 超管端侧边栏导航配置
const navItems = [
  { href: "/superadmin", icon: LayoutDashboard, label: "数据概览", exact: true },
  { href: "/superadmin/enterprises", icon: Building2, label: "企业管理" },
  { href: "/superadmin/finance", icon: CreditCard, label: "财务管理" },
  { href: "/superadmin/pricing", icon: Tag, label: "价格管理" },
  { href: "/superadmin/users", icon: Users, label: "用户数据" },
  { href: "/superadmin/settings", icon: Settings, label: "系统设置" },
]

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // 鉴权检查
  useEffect(() => {
    if (pathname === "/superadmin/login") {
      setIsLoading(false)
      return
    }
    const loggedIn = localStorage.getItem("superAdminLoggedIn") === "true"
    if (!loggedIn) {
      router.push("/superadmin/login")
    } else {
      setIsLoggedIn(true)
    }
    setIsLoading(false)
  }, [router, pathname])

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem("superAdminLoggedIn")
    router.push("/superadmin/login")
  }

  // 判断当前导航项是否激活
  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  // 登录页不套 Layout
  if (pathname === "/superadmin/login") return <>{children}</>

  // 加载中
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (!isLoggedIn) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b z-50 shadow-sm">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-3">
            {/* 移动端菜单按钮 */}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            {/* Logo + 标题 */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-sm text-gray-900">超级管理后台</span>
                <span className="text-xs text-gray-400 ml-2">神仙团队AI性格测试</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin")} className="text-gray-500 text-xs">
              管理后台
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

      {/* 侧边栏 */}
      <aside className={cn(
        "fixed left-0 top-14 bottom-0 w-56 bg-white border-r transition-transform z-40 overflow-y-auto",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item)
            return (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-2.5 h-10 text-sm font-medium transition-colors",
                  active
                    ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                onClick={() => { router.push(item.href); setSidebarOpen(false) }}
              >
                <item.icon className={cn("h-4 w-4", active ? "text-indigo-600" : "text-gray-400")} />
                {item.label}
                {active && <ChevronRight className="h-3 w-3 ml-auto text-indigo-400" />}
              </Button>
            )
          })}
        </nav>

        {/* 侧边栏底部信息 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50/50">
          <div className="text-xs text-gray-400 text-center">
            超管端 v2.0
          </div>
        </div>
      </aside>

      {/* 移动端遮罩层 */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* 主内容区 */}
      <main className="pt-14 lg:pl-56 min-h-screen">
        <div className="p-4 md:p-6 max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
