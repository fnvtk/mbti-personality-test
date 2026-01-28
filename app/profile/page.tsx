"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  User, ChevronRight, History, Wallet, Settings, HelpCircle, 
  MessageSquare, Info, LogOut, Bell, Shield, FileText
} from "lucide-react"
import BottomNav from "@/components/bottom-nav"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mbtiResult, setMbtiResult] = useState<any>(null)

  useEffect(() => {
    // 获取用户信息和测试结果
    const storedResult = localStorage.getItem("mbtiResult")
    if (storedResult) {
      try {
        setMbtiResult(JSON.parse(storedResult))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const menuItems = [
    { icon: History, label: "测试历史", href: "/profile/history", desc: "查看历史测试记录" },
    { icon: FileText, label: "我的报告", href: "/profile/reports", desc: "下载完整分析报告" },
    { icon: Wallet, label: "我的钱包", href: "/profile/wallet", desc: "余额与充值" },
    { icon: Bell, label: "消息通知", href: "/profile/notifications", desc: "查看系统消息" },
  ]

  const settingItems = [
    { icon: Settings, label: "账号设置", href: "/profile/settings" },
    { icon: Shield, label: "隐私设置", href: "/profile/privacy" },
    { icon: HelpCircle, label: "帮助中心", href: "/profile/help" },
    { icon: MessageSquare, label: "意见反馈", href: "/profile/feedback" },
    { icon: Info, label: "关于我们", href: "/profile/about" },
  ]

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-gradient-to-b from-rose-50 to-white">
      {/* 顶部用户信息 */}
      <div className="px-4 pt-12 pb-6 safe-area-top">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg">
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">
              {user?.name || "点击登录"}
            </h2>
            <p className="text-sm text-gray-500">
              {user?.phone || "登录后享受更多功能"}
            </p>
            {mbtiResult && (
              <div className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
                  {mbtiResult.type}
                </span>
              </div>
            )}
          </div>
          {!user && (
            <Button
              variant="outline"
              size="sm"
              className="border-rose-200 text-rose-600"
              onClick={() => router.push("/profile/login")}
            >
              登录
            </Button>
          )}
        </div>
      </div>

      {/* MBTI类型卡片 */}
      {mbtiResult && (
        <div className="px-4 pb-4">
          <Card 
            className="glass-card overflow-hidden cursor-pointer card-hover"
            onClick={() => router.push("/mbti-result")}
          >
            <div className="gradient-personal p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">我的MBTI类型</p>
                  <h3 className="text-3xl font-bold mt-1">{mbtiResult.type}</h3>
                  <p className="text-sm mt-1">{mbtiResult.description?.name || "性格类型"}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-80">置信度</p>
                  <p className="text-2xl font-bold">{mbtiResult.confidence}%</p>
                </div>
              </div>
            </div>
            <CardContent className="p-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">查看完整分析报告</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* 功能菜单 */}
      <div className="px-4 pb-4">
        <Card className="glass-card">
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                  index !== menuItems.length - 1 && "border-b border-gray-100"
                )}
                onClick={() => router.push(item.href)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 设置菜单 */}
      <div className="px-4 pb-24">
        <Card className="glass-card">
          <CardContent className="p-0">
            {settingItems.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                  index !== settingItems.length - 1 && "border-b border-gray-100"
                )}
                onClick={() => router.push(item.href)}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </div>
            ))}
            
            {/* 退出登录 */}
            {user && (
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-red-50 transition-colors"
                onClick={() => {
                  // 清除用户数据
                  setUser(null)
                  localStorage.removeItem("user")
                }}
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5 text-red-400" />
                  <span className="text-sm text-red-500">退出登录</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 底部导航 */}
      <BottomNav currentPath="/profile" />
    </div>
  )
}
