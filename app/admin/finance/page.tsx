"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight, Wallet } from "lucide-react"

export default function AdminFinancePage() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(d => {
      if (d.code === 200) setStats(d.data)
    })
  }, [])

  const orderStats = stats?.orders || { total: 0, completed: 0, totalRevenue: 0, todayRevenue: 0 }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">财务管理</h1>
        <p className="text-sm text-gray-500">收入概览与财务数据</p>
      </div>

      {/* 收入概览 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-xs text-green-600">总收入</span>
            </div>
            <p className="text-2xl font-bold text-green-700">¥{orderStats.totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-xs text-blue-600">今日收入</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">¥{orderStats.todayRevenue}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              <span className="text-xs text-gray-500">总订单</span>
            </div>
            <p className="text-2xl font-bold">{orderStats.total}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-5 w-5 text-amber-600" />
              <span className="text-xs text-gray-500">完成订单</span>
            </div>
            <p className="text-2xl font-bold">{orderStats.completed}</p>
          </CardContent>
        </Card>
      </div>

      {/* 定价策略概览 */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">定价策略概览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-rose-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">个人版</p>
              <p className="text-lg font-bold text-rose-600">¥198<span className="text-xs font-normal">/次</span></p>
              <p className="text-[10px] text-gray-500">AI面相+MBTI+PDP+DISC+盖洛普</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">企业启动版</p>
              <p className="text-lg font-bold text-purple-600">¥19,800</p>
              <p className="text-[10px] text-gray-500">最多10人团队</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">企业成长版</p>
              <p className="text-lg font-bold text-blue-600">¥39,800</p>
              <p className="text-[10px] text-gray-500">10-30人团队</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">企业蜕变版</p>
              <p className="text-lg font-bold text-amber-600">¥98,000</p>
              <p className="text-[10px] text-gray-500">最多100人团队</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 分润机制说明 */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">分润机制</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs flex-shrink-0">1</span>
            <p><strong>一级分销</strong>：直推用户付费的 <span className="text-green-600 font-bold">30%</span> 佣金</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs flex-shrink-0">2</span>
            <p><strong>二级分销</strong>：间推用户付费的 <span className="text-blue-600 font-bold">10%</span> 佣金</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs flex-shrink-0">3</span>
            <p><strong>企业合作</strong>：企业订单的 <span className="text-purple-600 font-bold">15%</span> 渠道佣金</p>
          </div>
          <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
            <p>分润原则：分不属于对方的钱，按创造价值分钱，用稳定流量+便捷私域体系绑定合作方</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
