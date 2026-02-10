"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, Users, Settings, LogOut, DollarSign, 
  FileText, Home, ChevronRight, Menu, X, Shield
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
    
    // 如果是登录页面，不需要验证
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

  // 导航菜单
  const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "仪表板" },
    { href: "/admin/users", icon: Users, label: "用户管理" },
    { href: "/admin/orders", icon: FileText, label: "订单管理" },
    { href: "/admin/pricing", icon: DollarSign, label: "价格设置" },
    { href: "/admin", icon: Settings, label: "系统设置" },
  ]

  // 登录页面不显示布局
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
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg hidden sm:block">MBTI管理后台</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="text-gray-600"
            >
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">返回前台</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">退出</span>
            </Button>
          </div>
        </div>
      </header>

      {/* 侧边栏 */}
      <aside className={cn(
        "fixed left-0 top-16 bottom-0 w-64 bg-white shadow-sm transition-transform duration-300 z-40",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3",
                pathname === item.href && "bg-purple-50 text-purple-700 hover:bg-purple-100"
              )}
              onClick={() => {
                router.push(item.href)
                setSidebarOpen(false)
              }}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {pathname === item.href && (
                <ChevronRight className="h-4 w-4 ml-auto" />
              )}
            </Button>
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
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
