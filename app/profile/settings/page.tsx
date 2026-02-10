"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, User, Bell, Shield, HelpCircle, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // 检查是否有当前用户ID
    const userId = sessionStorage.getItem("currentUserId")
    if (userId) {
      setIsLoggedIn(true)
    }
  }, [])

  // 处理登出
  const handleLogout = () => {
    sessionStorage.removeItem("currentUserId")
    router.push("/profile")
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-5 py-3 flex items-center bg-white">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="flex-1 text-center text-[17px] mr-10">个人设置</h1>
      </div>

      <div className="p-4 flex-1 overflow-auto space-y-4">
        {/* 账号设置 */}
        <Card className="p-4">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 mr-2 text-purple-500" />
            <h2 className="font-medium">账号设置</h2>
          </div>

          <div className="space-y-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => router.push("/profile/edit")}
            >
              <span>编辑个人资料</span>
              <ArrowLeft className="h-4 w-4 text-gray-400 transform rotate-180" />
            </div>

            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => router.push("/profile/password")}
            >
              <span>修改密码</span>
              <ArrowLeft className="h-4 w-4 text-gray-400 transform rotate-180" />
            </div>

            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => router.push("/profile/bind")}
            >
              <span>绑定手机/邮箱</span>
              <ArrowLeft className="h-4 w-4 text-gray-400 transform rotate-180" />
            </div>
          </div>
        </Card>

        {/* 通知设置 */}
        <Card className="p-4">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 mr-2 text-blue-500" />
            <h2 className="font-medium">通知设置</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">接收消息通知</Label>
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">深色模式</Label>
              <Switch id="darkMode" checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </div>
        </Card>

        {/* 隐私与安全 */}
        <Card className="p-4">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 mr-2 text-green-500" />
            <h2 className="font-medium">隐私与安全</h2>
          </div>

          <div className="space-y-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => router.push("/profile/privacy")}
            >
              <span>隐私设置</span>
              <ArrowLeft className="h-4 w-4 text-gray-400 transform rotate-180" />
            </div>

            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => router.push("/profile/data")}
            >
              <span>数据管理</span>
              <ArrowLeft className="h-4 w-4 text-gray-400 transform rotate-180" />
            </div>
          </div>
        </Card>

        {/* 帮助与支持 */}
        <Card className="p-4">
          <div className="flex items-center mb-4">
            <HelpCircle className="h-5 w-5 mr-2 text-yellow-500" />
            <h2 className="font-medium">帮助与支持</h2>
          </div>

          <div className="space-y-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => router.push("/profile/help")}
            >
              <span>帮助中心</span>
              <ArrowLeft className="h-4 w-4 text-gray-400 transform rotate-180" />
            </div>

            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => router.push("/profile/feedback")}
            >
              <span>意见反馈</span>
              <ArrowLeft className="h-4 w-4 text-gray-400 transform rotate-180" />
            </div>

            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => router.push("/profile/about")}
            >
              <span>关于我们</span>
              <ArrowLeft className="h-4 w-4 text-gray-400 transform rotate-180" />
            </div>
          </div>
        </Card>

        {/* 退出登录 */}
        {isLoggedIn && (
          <Button variant="destructive" className="w-full mt-4" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            退出登录
          </Button>
        )}
      </div>
    </div>
  )
}
