"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, ShoppingCart, RefreshCw } from "lucide-react"

export default function AdminOrdersPage() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    totalRevenue: 0,
    todayRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      if (data.code === 200) {
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error('获取订单数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
          <p className="text-gray-500 mt-1">查看和管理所有订单记录</p>
        </div>
        <Button onClick={fetchOrders} variant="outline" className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      {/* 订单统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">总订单数</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">已完成</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">总收入</p>
                <p className="text-2xl font-bold">¥{stats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">今日收入</p>
                <p className="text-2xl font-bold">¥{stats.todayRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 订单列表占位 */}
      <Card>
        <CardHeader>
          <CardTitle>最近订单</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.total === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无订单记录</p>
              <p className="text-sm mt-1">用户通过小程序购买后，订单将显示在这里</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>共 {stats.total} 条订单记录</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
