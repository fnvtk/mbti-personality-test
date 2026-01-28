"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Bell, Shield, HelpCircle, ChevronRight, LogOut, Moon, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)

  const settingItems = [
    {
      icon: User,
      label: "账号与安全",
      desc: "修改密码、绑定手机",
      color: "from-blue-500 to-cyan-500",
      path: "/profile/account",
    },
    {
      icon: Shield,
      label: "隐私设置",
      desc: "管理你的数据",
      color: "from-green-500 to-emerald-500",
      path: "/profile/privacy",
    },
    {
      icon: HelpCircle,
      label: "帮助与反馈",
      desc: "常见问题、联系客服",
      color: "from-orange-500 to-amber-500",
      path: "/profile/help",
    },
  ]

  return (
    <div className="min-h-screen w-full max-w-md mx-auto flex flex-col gradient-bg">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-[60px]" />
        <div className="absolute bottom-40 left-0 w-60 h-60 bg-red-500/10 rounded-full blur-[80px]" />
      </div>

      {/* 头部 */}
      <header className="relative z-10 glass-nav sticky top-0">
        <div className="flex items-center px-4 py-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-white">设置</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* 主内容 */}
      <main className="flex-1 relative z-10 px-5 py-6 pb-24 space-y-4">
        {/* 开关设置 */}
        <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-medium text-white">消息通知</span>
                <p className="text-xs text-white/50">接收新功能和优惠通知</p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Moon className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-medium text-white">深色模式</span>
                <p className="text-xs text-white/50">保护眼睛，夜间使用更舒适</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </div>

        {/* 菜单项 */}
        <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
          {settingItems.map((item, index) => (
            <div
              key={index}
              onClick={() => router.push(item.path)}
              className={`flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors ${
                index !== settingItems.length - 1 ? "border-b border-white/10" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}
                >
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-medium text-white">{item.label}</span>
                  <p className="text-xs text-white/50">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </div>
          ))}
        </div>

        {/* 语言设置 */}
        <div className="glass-card rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-medium text-white">语言</span>
                <p className="text-xs text-white/50">当前：简体中文</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/30" />
          </div>
        </div>

        {/* 退出登录 */}
        <Button
          variant="outline"
          onClick={() => {
            localStorage.clear()
            router.push("/login")
          }}
          className="w-full glass-card rounded-2xl py-4 h-auto border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="w-5 h-5 mr-2" />
          退出登录
        </Button>

        {/* 版本信息 */}
        <p className="text-center text-xs text-white/30 pt-4">发型魔镜 v1.0.0</p>
      </main>
    </div>
  )
}
