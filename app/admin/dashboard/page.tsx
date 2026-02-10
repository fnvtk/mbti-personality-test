"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, FileText, DollarSign, TrendingUp, Activity,
  Brain, BarChart3, ArrowUpRight, ArrowDownRight
} from "lucide-react"

interface StatsData {
  users: { total: number; active: number; newToday: number; admins: number }
  tests: { total: number; todayCount: number; typeDistribution: any[]; avgConfidence: number }
  orders: { total: number; completed: number; totalRevenue: number; todayRevenue: number }
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      if (data.code === 200) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">首页概览</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => (
            <Card key={i}><CardContent className="p-4"><div className="h-16 bg-gray-100 animate-pulse rounded" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  const s = stats!

  // MBTI类型分布前8
  const topTypes = (s.tests.typeDistribution || []).slice(0, 8)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">首页概览</h1>
        <p className="text-sm text-gray-500">实时数据统计</p>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-xs text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3" />+{s.users.newToday}
              </span>
            </div>
            <p className="text-2xl font-bold">{s.users.total}</p>
            <p className="text-xs text-gray-500">总用户数</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-xs text-gray-500">{s.tests.todayCount}今日</span>
            </div>
            <p className="text-2xl font-bold">{s.tests.total}</p>
            <p className="text-xs text-gray-500">测试完成数</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-xs text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3" />+¥{s.orders.todayRevenue}
              </span>
            </div>
            <p className="text-2xl font-bold">¥{s.orders.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500">总收入</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <Activity className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">{Math.round(s.tests.avgConfidence)}%</p>
            <p className="text-xs text-gray-500">平均置信度</p>
          </CardContent>
        </Card>
      </div>

      {/* MBTI类型分布 */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-purple-600" />
            MBTI类型分布
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topTypes.length > 0 ? (
            <div className="space-y-2">
              {topTypes.map((item: any) => {
                const maxCount = topTypes[0]?.count || 1
                const percentage = Math.round((item.count / s.tests.total) * 100)
                return (
                  <div key={item._id} className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold w-10 text-gray-700">{item._id}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-rose-500 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                        style={{ width: `${Math.max(15, (item.count / maxCount) * 100)}%` }}
                      >
                        <span className="text-[10px] text-white font-medium">{item.count}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 w-10 text-right">{percentage}%</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">暂无测试数据</p>
          )}
        </CardContent>
      </Card>

      {/* 快捷操作 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "活跃用户", value: s.users.active, color: "blue" },
          { label: "已完成订单", value: s.orders.completed, color: "green" },
          { label: "管理员数", value: s.users.admins, color: "purple" },
          { label: "今日收入", value: `¥${s.orders.todayRevenue}`, color: "amber" },
        ].map((item, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold">{item.value}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
