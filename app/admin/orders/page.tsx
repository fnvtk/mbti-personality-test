"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign, ShoppingCart, TrendingUp, Clock,
  Search, RefreshCw, ChevronLeft, ChevronRight,
  ArrowUpRight, Package, CreditCard
} from "lucide-react"

// 金额格式化（分转元）
const formatMoney = (cents: number) => (cents / 100).toFixed(2)

// 订单状态映射
const orderStatusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "待支付", variant: "secondary" },
  paid: { label: "已支付", variant: "default" },
  completed: { label: "已完成", variant: "default" },
  refunded: { label: "已退款", variant: "destructive" },
  failed: { label: "失败", variant: "destructive" },
}

// 产品类型映射
const productTypeMap: Record<string, string> = {
  vip: "VIP会员",
  test_count: "测试次数",
  single_test: "单次测试",
  enterprise: "企业版",
}

// 支付方式映射
const payMethodMap: Record<string, string> = {
  wechat: "微信支付",
  alipay: "支付宝",
}

// 来源映射
const sourceMap: Record<string, { label: string; color: string }> = {
  direct: { label: "直接访问", color: "bg-gray-100 text-gray-700" },
  invite: { label: "邀请推荐", color: "bg-green-100 text-green-700" },
  scan: { label: "扫码", color: "bg-blue-100 text-blue-700" },
  share: { label: "分享", color: "bg-purple-100 text-purple-700" },
}

export default function OrdersPage() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("")
  const [productFilter, setProductFilter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState<any>(null)

  // 加载订单统计
  const loadStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      if (data.code === 200) setStats(data.data)
    } catch (error) {
      console.error('加载订单统计失败:', error)
    }
  }, [])

  // 加载订单列表
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        type: 'list',
        page: page.toString(),
        limit: '15',
        status: statusFilter,
        productType: productFilter,
        search: searchQuery
      })
      const res = await fetch(`/api/admin/orders?${params}`)
      const data = await res.json()
      if (data.code === 200 && data.data) {
        setOrders(data.data.orders || [])
        setTotal(data.data.total || 0)
      }
    } catch (error) {
      console.error('加载订单列表失败:', error)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, productFilter, searchQuery])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">订单管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理所有支付订单和充值记录</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { loadStats(); loadOrders() }}>
          <RefreshCw className="h-4 w-4 mr-1" />刷新
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">总订单数</p>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              </div>
              <div className="p-2.5 bg-blue-100 rounded-full">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">已完成订单</p>
                <p className="text-2xl font-bold">{stats?.completed || 0}</p>
              </div>
              <div className="p-2.5 bg-green-100 rounded-full">
                <Package className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">总收入</p>
                <p className="text-2xl font-bold">¥{stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="p-2.5 bg-purple-100 rounded-full">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">今日收入</p>
                <p className="text-2xl font-bold">¥{stats?.todayRevenue?.toFixed(2) || '0.00'}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />实时
                </p>
              </div>
              <div className="p-2.5 bg-orange-100 rounded-full">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选区域 */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索订单号/用户ID..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadOrders()}
          />
        </div>
        
        <div className="flex gap-1">
          {['', 'pending', 'paid', 'completed', 'refunded', 'failed'].map(s => (
            <Button
              key={s}
              size="sm"
              variant={statusFilter === s ? "default" : "outline"}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className="text-xs"
            >
              {s === '' ? '全部' : orderStatusMap[s]?.label || s}
            </Button>
          ))}
        </div>

        <div className="flex gap-1">
          {['', 'vip', 'test_count', 'single_test', 'enterprise'].map(s => (
            <Button
              key={s}
              size="sm"
              variant={productFilter === s ? "default" : "outline"}
              onClick={() => { setProductFilter(s); setPage(1) }}
              className="text-xs"
            >
              {s === '' ? '全部产品' : productTypeMap[s] || s}
            </Button>
          ))}
        </div>
      </div>

      {/* 订单列表 */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-3 font-medium">订单号</th>
                  <th className="text-left p-3 font-medium">用户</th>
                  <th className="text-left p-3 font-medium">产品</th>
                  <th className="text-right p-3 font-medium">金额</th>
                  <th className="text-center p-3 font-medium">支付方式</th>
                  <th className="text-center p-3 font-medium">状态</th>
                  <th className="text-center p-3 font-medium">来源</th>
                  <th className="text-right p-3 font-medium">佣金</th>
                  <th className="text-left p-3 font-medium">创建时间</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order: any) => (
                  <tr key={order.orderId || order._id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {(order.orderId || '').slice(0, 18)}...
                      </code>
                    </td>
                    <td className="p-3 text-xs">{order.userId?.slice(0, 10) || order.openId?.slice(0, 10) || '-'}...</td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-xs">{productTypeMap[order.productType] || order.productType}</p>
                        {order.productDetail && <p className="text-xs text-gray-400">{order.productDetail}</p>}
                      </div>
                    </td>
                    <td className="p-3 text-right font-bold">¥{formatMoney(order.amount || 0)}</td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className="text-xs">
                        <CreditCard className="h-3 w-3 mr-1" />
                        {payMethodMap[order.paymentMethod] || order.paymentMethod}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant={orderStatusMap[order.status]?.variant || "outline"}>
                        {orderStatusMap[order.status]?.label || order.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      {order.source && (
                        <span className={`text-xs px-2 py-0.5 rounded ${sourceMap[order.source]?.color || 'bg-gray-100'}`}>
                          {sourceMap[order.source]?.label || order.source}
                        </span>
                      )}
                      {order.referrerCode && (
                        <p className="text-xs text-gray-400 mt-1">推荐码: {order.referrerCode}</p>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {(order.commissionAmount || 0) > 0 ? (
                        <div>
                          <span className="text-green-600 font-medium">¥{formatMoney(order.commissionAmount)}</span>
                          {(order.level2CommissionAmount || 0) > 0 && (
                            <p className="text-xs text-gray-400">+¥{formatMoney(order.level2CommissionAmount)}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="p-3 text-xs text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center p-8 text-gray-400">
                      {loading ? '加载中...' : '暂无订单数据'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 分页 */}
      {total > 15 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">共 {total} 条</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center text-sm px-2">第 {page} 页</span>
            <Button size="sm" variant="outline" disabled={page * 15 >= total} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
