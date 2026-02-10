"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Building2, Users, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight,
  Plus, Tag, Settings, BarChart3, Activity, Zap
} from "lucide-react"

// 模拟统计数据（后续接 API）
const mockStats = {
  totalEnterprises: 12,
  activeEnterprises: 9,
  totalUsers: 1586,
  totalRevenue: 198000,
  monthRevenue: 32500,
  totalTests: 4230,
  monthTests: 680,
  avgTestsPerEnterprise: 352,
}

// 快捷入口配置
const quickActions = [
  { label: "新建企业", icon: Plus, href: "/superadmin/enterprises?action=create", color: "bg-indigo-500" },
  { label: "企业管理", icon: Building2, href: "/superadmin/enterprises", color: "bg-blue-500" },
  { label: "财务管理", icon: CreditCard, href: "/superadmin/finance", color: "bg-emerald-500" },
  { label: "价格管理", icon: Tag, href: "/superadmin/pricing", color: "bg-amber-500" },
  { label: "用户数据", icon: Users, href: "/superadmin/users", color: "bg-purple-500" },
  { label: "系统设置", icon: Settings, href: "/superadmin/settings", color: "bg-gray-500" },
]

// 最近动态
const recentActivities = [
  { type: "enterprise", text: "科技创新有限公司 充值了 ¥5,000", time: "10分钟前", icon: CreditCard },
  { type: "user", text: "新增 23 名测试用户（来自未来教育集团）", time: "1小时前", icon: Users },
  { type: "test", text: "本日已完成 86 次性格测试", time: "2小时前", icon: Activity },
  { type: "enterprise", text: "健康医疗科技 完成企业入驻", time: "3小时前", icon: Building2 },
  { type: "finance", text: "月度收入已达 ¥32,500，环比增长 18%", time: "今日", icon: TrendingUp },
]

export default function SuperAdminDashboard() {
  const router = useRouter()
  const [stats] = useState(mockStats)

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">数据概览</h1>
        <p className="text-sm text-gray-500 mt-1">超管端全局数据一览</p>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">企业总数</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalEnterprises}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-emerald-600 font-medium flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />+2
                  </span>
                  <span className="text-xs text-gray-400 ml-1">本月新增</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">总用户数</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-emerald-600 font-medium flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />+156
                  </span>
                  <span className="text-xs text-gray-400 ml-1">本月新增</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">总收入</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">¥{(stats.totalRevenue / 10000).toFixed(1)}万</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-emerald-600 font-medium flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />18%
                  </span>
                  <span className="text-xs text-gray-400 ml-1">环比增长</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">测试总量</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalTests.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-emerald-600 font-medium flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />+{stats.monthTests}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">本月</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 快捷入口 */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            快捷操作
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="ghost"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-gray-50 rounded-xl"
                onClick={() => router.push(action.href)}
              >
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 下方两栏布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 最近动态 */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              最近动态
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 last:pb-0 border-b last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <activity.icon className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 企业排行 */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                企业活跃排行
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-indigo-600" onClick={() => router.push("/superadmin/enterprises")}>
                查看全部
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "未来教育集团", tests: 128, revenue: 9500 },
                { name: "健康医疗科技", tests: 76, revenue: 25000 },
                { name: "科技创新有限公司", tests: 42, revenue: 19800 },
                { name: "智能制造集团", tests: 35, revenue: 15000 },
                { name: "数字营销公司", tests: 28, revenue: 8800 },
              ].map((enterprise, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? "bg-amber-100 text-amber-700" :
                    index === 1 ? "bg-gray-200 text-gray-600" :
                    index === 2 ? "bg-orange-100 text-orange-600" :
                    "bg-gray-100 text-gray-500"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{enterprise.name}</p>
                    <p className="text-xs text-gray-400">{enterprise.tests}次测试</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">¥{enterprise.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
