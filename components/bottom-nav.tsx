"use client"

import { Home, FileText, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  currentPath?: string
  isEnterprise?: boolean
}

export default function BottomNav({ currentPath, isEnterprise = false }: BottomNavProps) {
  const pathname = usePathname()
  const activePath = currentPath || pathname

  // 导航项配置
  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "首页",
      isActive: activePath === "/"
    },
    {
      href: "/test/mbti",
      icon: FileText,
      label: "测试",
      isActive: activePath.includes("/test") || 
                activePath.includes("/camera") || 
                activePath.includes("/analysis") ||
                activePath.includes("result"),
      isMain: true
    },
    {
      href: "/profile",
      icon: User,
      label: "我的",
      isActive: activePath === "/profile" || activePath.startsWith("/profile/")
    }
  ]

  // 主题颜色
  const themeColor = isEnterprise ? "purple" : "rose"
  const activeColorClass = isEnterprise ? "text-purple-600" : "text-rose-500"
  const activeBgClass = isEnterprise 
    ? "bg-gradient-to-r from-purple-600 to-blue-600" 
    : "bg-gradient-to-r from-rose-500 to-pink-500"

  return (
    <nav className="glass-nav fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <div className="max-w-md mx-auto flex justify-around items-center py-2 px-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center py-2 px-4 transition-all duration-200",
              item.isActive ? activeColorClass : "text-gray-400 hover:text-gray-600"
            )}
          >
            {item.isMain ? (
              // 中间的主按钮 - 突出显示
              <div className="relative -mt-6">
                <div
                  className={cn(
                    "rounded-full p-4 shadow-lg transform transition-transform duration-200 hover:scale-105",
                    item.isActive ? activeBgClass : "bg-gray-400"
                  )}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                {item.isActive && (
                  <div className={cn(
                    "absolute -inset-1 rounded-full opacity-30 animate-pulse",
                    activeBgClass
                  )} />
                )}
              </div>
            ) : (
              <item.icon className="w-6 h-6" />
            )}
            <span className={cn(
              "text-xs mt-1 font-medium",
              item.isMain && "mt-2"
            )}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
