"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, Users, Settings, LogOut, DollarSign, 
  FileText, Home, ChevronRight, Menu, X, Shield,
  Building2, BarChart3, Wallet, Share2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // 检查登录状态
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    
    if (pathname === "/admin/login") {
      setIsLoading(false)
      return
    }
    
    if (!adminLoggedIn) {
      router.push("/admin/login")
    } else {
      setIsLoggedIn(true)
    }
    setIsLoading(false)
  }, [router, pathname])

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    localStorage.removeItem("adminLoginTime")
    router.push("/admin/login")
  }

  // 统一导航菜单（合并管理+超管+企业）
  const navSections = [
    {
      title: "数据概览",
      items: [
        { href: "/admin/dashboard", icon: LayoutDashboard, label: "首页概览" },
        { href: "/admin/analytics", icon: BarChart3, label: "数据分析" },
      ]
    },
    {
      title: "用户与企业",
      items: [
        { href: "/admin/users", icon: Users, label: "用户管理" },
        { href: "/admin/enterprise", icon: Building2, label: "企业管理" },
      ]
    },
    {
      title: "财务与营销",
      items: [
        { href: "/admin/finance", icon: Wallet, label: "财务管理" },
        { href: "/admin/orders", icon: FileText, label: "订单管理" },
        { href: "/admin/pricing", icon: DollarSign, label: "定价策略" },
        { href: "/admin/distribution", icon: Share2, label: "分销管理" },
      ]
    },
    {
      title: "系统配置",
      items: [
        { href: "/admin", icon: Settings, label: "系统设置" },
      ]
    },
  ]

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto" />
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn && pathname !== "/admin/login") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-sm">神仙团队AI</span>
                <span className="text-xs text-gray-400 ml-1">管理中心</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="text-gray-500 text-xs"
            >
              <Home className="h-4 w-4 mr-1" />
              前台
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs"
            >
              <LogOut className="h-4 w-4 mr-1" />
              退出
            </Button>
          </div>
        </div>
      </header>

      {/* 侧边栏 */}
      <aside className={cn(
        "fixed left-0 top-14 bottom-0 w-56 bg-white border-r border-gray-200 transition-transform duration-300 z-40 overflow-y-auto",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <nav className="p-3 space-y-4">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start gap-2.5 h-9 text-sm font-normal",
                      pathname === item.href 
                        ? "bg-purple-50 text-purple-700 hover:bg-purple-100 font-medium" 
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                    onClick={() => {
                      router.push(item.href)
                      setSidebarOpen(false)
                    }}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {pathname === item.href && (
                      <ChevronRight className="h-3 w-3 ml-auto" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* 遮罩层 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 主内容区域 */}
      <main className="pt-14 lg:pl-56 min-h-screen">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
