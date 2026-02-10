"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User, History, LogOut, ChevronRight, Building, CreditCard } from "lucide-react"
import BottomNav from "@/components/bottom-nav"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState({
    name: "用户7825",
    avatar: "/placeholder.svg?height=80&width=80",
    isLoggedIn: true,
    balance: 150.0,
  })

  // 处理登录
  useEffect(() => {
    const userId = sessionStorage.getItem("currentUserId")
    if (!userId) {
      setUser((prev) => ({ ...prev, isLoggedIn: false }))
    }
  }, [])

  const handleLogin = () => {
    router.push("/login")
  }

  const handleLogout = () => {
    if (confirm("确定要退出登录吗？")) {
      sessionStorage.removeItem("currentUserId")
      setUser({ ...user, isLoggedIn: false })
      router.push("/login")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-gray-50">
      <div className="p-4 bg-white">
        <h1 className="text-lg font-medium text-center">我的</h1>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-4">
          {/* 用户信息卡片 */}
          <Card className="p-4 bg-white">
            {user.isLoggedIn ? (
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  <img src={user.avatar || "/placeholder.svg"} alt="用户头像" className="w-full h-full object-cover" />
                </div>
                <div className="ml-4 flex-1">
                  <h2 className="text-lg font-medium">{user.name}</h2>
                  <div className="flex items-center mt-1">
                    <div className="bg-purple-50 rounded-full px-2 py-0.5 flex items-center">
                      <span className="text-purple-600 text-sm font-medium">¥ {user.balance.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => router.push("/profile/wallet/withdraw")}
                  >
                    <CreditCard className="h-4 w-4 mr-1 text-purple-500" />
                    <span>充值</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push("/profile/settings")}>
                    编辑
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium">未登录</h2>
                    <p className="text-sm text-gray-500">请登录以使用更多功能</p>
                  </div>
                </div>
                <Button onClick={handleLogin}>登录</Button>
              </div>
            )}
          </Card>

          {/* 测试历史卡片 - 合并了订单记录 */}
          <Card className="bg-white">
            <Link href="/profile/history" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <History className="w-5 h-5 text-purple-500 mr-3" />
                <span>测试历史</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">3条记录</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          </Card>

          {/* 深度服务 */}
          <Card className="bg-white">
            <Link href="/pricing?tab=enterprise" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Building className="w-5 h-5 text-blue-500 mr-3" />
                <span>深度服务</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </Card>

          {/* 退出登录 */}
          {user.isLoggedIn && (
            <Button variant="outline" className="w-full mt-4 text-red-500 border-red-200" onClick={handleLogout}>
              <LogOut className="w-5 h-5 mr-2" />
              退出登录
            </Button>
          )}
        </div>
      </div>

      <BottomNav currentPath="/profile" />
    </div>
  )
}
