"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  TrendingUp, Users, DollarSign, ArrowDownToLine, Clock,
  CheckCircle, XCircle, Settings, RefreshCw, Search,
  ChevronLeft, ChevronRight, Eye, BarChart3, PieChart,
  Wallet, UserPlus, ArrowUpRight, AlertCircle
} from "lucide-react"

// 金额格式化（分转元）
const formatMoney = (cents: number) => (cents / 100).toFixed(2)

// 状态标签映射
const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "待结算", variant: "secondary" },
  confirmed: { label: "已确认", variant: "default" },
  settled: { label: "已结算", variant: "default" },
  cancelled: { label: "已取消", variant: "destructive" },
  approved: { label: "已通过", variant: "default" },
  rejected: { label: "已拒绝", variant: "destructive" },
  completed: { label: "已完成", variant: "default" },
}

// 等级映射
const levelMap: Record<string, { label: string; color: string }> = {
  normal: { label: "普通", color: "bg-gray-100 text-gray-700" },
  silver: { label: "白银", color: "bg-slate-100 text-slate-700" },
  gold: { label: "黄金", color: "bg-yellow-100 text-yellow-700" },
  diamond: { label: "钻石", color: "bg-blue-100 text-blue-700" },
}

export default function DistributionPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  
  // 概览数据
  const [overview, setOverview] = useState<any>(null)
  
  // 分销商列表
  const [distributors, setDistributors] = useState<any[]>([])
  const [distributorTotal, setDistributorTotal] = useState(0)
  const [distributorPage, setDistributorPage] = useState(1)
  const [distributorSearch, setDistributorSearch] = useState("")
  
  // 佣金记录
  const [commissions, setCommissions] = useState<any[]>([])
  const [commissionTotal, setCommissionTotal] = useState(0)
  const [commissionPage, setCommissionPage] = useState(1)
  const [commissionFilter, setCommissionFilter] = useState("")
  
  // 提现记录
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [withdrawalTotal, setWithdrawalTotal] = useState(0)
  const [withdrawalPage, setWithdrawalPage] = useState(1)
  const [withdrawalFilter, setWithdrawalFilter] = useState("")
  
  // 配置
  const [config, setConfig] = useState<any>(null)
  const [configSaved, setConfigSaved] = useState(false)
  
  // 对话框
  const [reviewDialog, setReviewDialog] = useState<any>(null)
  const [reviewRemark, setReviewRemark] = useState("")

  // 加载概览数据
  const loadOverview = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/distribution?type=overview')
      const data = await res.json()
      if (data.code === 200) setOverview(data.data)
    } catch (error) {
      console.error('加载概览失败:', error)
    }
  }, [])

  // 加载分销商列表
  const loadDistributors = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        type: 'distributors',
        page: distributorPage.toString(),
        limit: '15',
        search: distributorSearch
      })
      const res = await fetch(`/api/admin/distribution?${params}`)
      const data = await res.json()
      if (data.code === 200) {
        setDistributors(data.data.distributors)
        setDistributorTotal(data.data.total)
      }
    } catch (error) {
      console.error('加载分销商失败:', error)
    }
  }, [distributorPage, distributorSearch])

  // 加载佣金记录
  const loadCommissions = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        type: 'commissions',
        page: commissionPage.toString(),
        limit: '15',
        status: commissionFilter
      })
      const res = await fetch(`/api/admin/distribution?${params}`)
      const data = await res.json()
      if (data.code === 200) {
        setCommissions(data.data.commissions)
        setCommissionTotal(data.data.total)
      }
    } catch (error) {
      console.error('加载佣金记录失败:', error)
    }
  }, [commissionPage, commissionFilter])

  // 加载提现记录
  const loadWithdrawals = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        type: 'withdrawals',
        page: withdrawalPage.toString(),
        limit: '15',
        status: withdrawalFilter
      })
      const res = await fetch(`/api/admin/distribution?${params}`)
      const data = await res.json()
      if (data.code === 200) {
        setWithdrawals(data.data.withdrawals)
        setWithdrawalTotal(data.data.total)
      }
    } catch (error) {
      console.error('加载提现记录失败:', error)
    }
  }, [withdrawalPage, withdrawalFilter])

  // 加载配置
  const loadConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/distribution?type=config')
      const data = await res.json()
      if (data.code === 200) setConfig(data.data)
    } catch (error) {
      console.error('加载配置失败:', error)
    }
  }, [])

  // 初始加载
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true)
      await Promise.all([loadOverview(), loadConfig()])
      setLoading(false)
    }
    loadAll()
  }, [loadOverview, loadConfig])

  // Tab切换时加载数据
  useEffect(() => {
    if (activeTab === 'distributors') loadDistributors()
    if (activeTab === 'commissions') loadCommissions()
    if (activeTab === 'withdrawals') loadWithdrawals()
  }, [activeTab, loadDistributors, loadCommissions, loadWithdrawals])

  // 保存配置
  const handleSaveConfig = async () => {
    try {
      const res = await fetch('/api/admin/distribution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateConfig', config })
      })
      const data = await res.json()
      if (data.code === 200) {
        setConfigSaved(true)
        setTimeout(() => setConfigSaved(false), 3000)
      }
    } catch (error) {
      console.error('保存配置失败:', error)
    }
  }

  // 审核提现
  const handleReviewWithdrawal = async (approved: boolean) => {
    if (!reviewDialog) return
    try {
      await fetch('/api/admin/distribution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reviewWithdrawal',
          withdrawalId: reviewDialog.withdrawalId,
          approved,
          remark: reviewRemark
        })
      })
      setReviewDialog(null)
      setReviewRemark("")
      loadWithdrawals()
    } catch (error) {
      console.error('审核失败:', error)
    }
  }

  // 手动结算佣金
  const handleSettleCommission = async (commissionId: string) => {
    try {
      await fetch('/api/admin/distribution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'settleCommission', commissionId })
      })
      loadCommissions()
      loadOverview()
    } catch (error) {
      console.error('结算失败:', error)
    }
  }

  // 批量结算
  const handleBatchSettle = async () => {
    try {
      const res = await fetch('/api/admin/distribution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'batchSettle' })
      })
      const data = await res.json()
      alert(data.message)
      loadCommissions()
      loadOverview()
    } catch (error) {
      console.error('批量结算失败:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-500">加载中...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">分销管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理分销商、佣金、提现和分销设置</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { loadOverview(); loadConfig() }}>
          <RefreshCw className="h-4 w-4 mr-1" />刷新
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">数据概览</TabsTrigger>
          <TabsTrigger value="distributors">分销商</TabsTrigger>
          <TabsTrigger value="commissions">佣金记录</TabsTrigger>
          <TabsTrigger value="withdrawals">提现管理</TabsTrigger>
          <TabsTrigger value="settings">分销设置</TabsTrigger>
        </TabsList>

        {/* ==================== 数据概览 ==================== */}
        <TabsContent value="overview" className="space-y-6">
          {/* 核心指标卡片 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">分销商总数</p>
                    <p className="text-2xl font-bold">{overview?.totalDistributors || 0}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <UserPlus className="h-3 w-3 mr-1" />
                      今日+{overview?.newDistributorsToday || 0}
                    </p>
                  </div>
                  <div className="p-2.5 bg-purple-100 rounded-full">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">累计佣金</p>
                    <p className="text-2xl font-bold">¥{formatMoney(overview?.totalCommissionAmount || 0)}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      今日+¥{formatMoney(overview?.todayCommissionAmount || 0)}
                    </p>
                  </div>
                  <div className="p-2.5 bg-green-100 rounded-full">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">待结算佣金</p>
                    <p className="text-2xl font-bold">¥{formatMoney(overview?.pendingCommissionAmount || 0)}</p>
                    <p className="text-xs text-orange-600 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {overview?.pendingCommissionCount || 0}笔
                    </p>
                  </div>
                  <div className="p-2.5 bg-orange-100 rounded-full">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">待审核提现</p>
                    <p className="text-2xl font-bold">¥{formatMoney(overview?.pendingWithdrawAmount || 0)}</p>
                    <p className="text-xs text-red-600 flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {overview?.pendingWithdrawCount || 0}笔待审
                    </p>
                  </div>
                  <div className="p-2.5 bg-red-100 rounded-full">
                    <ArrowDownToLine className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 近7天佣金趋势 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />近7天佣金趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(overview?.dailyCommissions || []).map((day: any, i: number) => {
                    const maxAmount = Math.max(...(overview?.dailyCommissions || [{ total: 1 }]).map((d: any) => d.total || 1))
                    const percentage = maxAmount > 0 ? (day.total / maxAmount) * 100 : 0
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-20 shrink-0">{day._id?.slice(5)}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(percentage, 2)}%` }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                            ¥{formatMoney(day.total)} ({day.count}笔)
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  {(!overview?.dailyCommissions || overview.dailyCommissions.length === 0) && (
                    <p className="text-sm text-gray-400 text-center py-8">暂无数据</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 产品佣金分布 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <PieChart className="h-4 w-4" />产品佣金分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(overview?.productCommissions || []).map((item: any, i: number) => {
                    const colors = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500']
                    const typeLabels: Record<string, string> = {
                      vip: 'VIP会员', test_count: '测试次数', single_test: '单次测试', enterprise: '企业版'
                    }
                    const totalAmount = (overview?.productCommissions || []).reduce((s: number, p: any) => s + p.total, 0) || 1
                    const percentage = ((item.total / totalAmount) * 100).toFixed(1)
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${colors[i % colors.length]}`} />
                        <span className="text-sm flex-1">{typeLabels[item._id] || item._id}</span>
                        <span className="text-sm font-medium">¥{formatMoney(item.total)}</span>
                        <span className="text-xs text-gray-500 w-12 text-right">{percentage}%</span>
                      </div>
                    )
                  })}
                  {(!overview?.productCommissions || overview.productCommissions.length === 0) && (
                    <p className="text-sm text-gray-400 text-center py-8">暂无数据</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 分销商等级分布 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />分销商等级分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {(overview?.levelDistribution || []).map((item: any) => {
                    const info = levelMap[item._id] || { label: item._id, color: 'bg-gray-100 text-gray-700' }
                    return (
                      <div key={item._id} className={`p-3 rounded-lg ${info.color}`}>
                        <p className="text-xs opacity-70">{info.label}</p>
                        <p className="text-xl font-bold">{item.count}</p>
                      </div>
                    )
                  })}
                  {(!overview?.levelDistribution || overview.levelDistribution.length === 0) && (
                    <p className="text-sm text-gray-400 text-center py-4 col-span-2">暂无数据</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 提现统计 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Wallet className="h-4 w-4" />提现统计
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm">已完成提现</span>
                    <span className="text-lg font-bold text-green-700">¥{formatMoney(overview?.completedWithdrawAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm">待审核提现</span>
                    <span className="text-lg font-bold text-orange-700">¥{formatMoney(overview?.pendingWithdrawAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm">待结算佣金</span>
                    <span className="text-lg font-bold text-blue-700">¥{formatMoney(overview?.pendingCommissionAmount || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ==================== 分销商列表 ==================== */}
        <TabsContent value="distributors" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索用户名/手机/邀请码..."
                className="pl-9"
                value={distributorSearch}
                onChange={(e) => setDistributorSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadDistributors()}
              />
            </div>
            <Button size="sm" onClick={loadDistributors}>搜索</Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 font-medium">分销商</th>
                      <th className="text-left p-3 font-medium">邀请码</th>
                      <th className="text-left p-3 font-medium">等级</th>
                      <th className="text-right p-3 font-medium">累计收益</th>
                      <th className="text-right p-3 font-medium">可提现</th>
                      <th className="text-right p-3 font-medium">团队人数</th>
                      <th className="text-right p-3 font-medium">团队业绩</th>
                      <th className="text-left p-3 font-medium">加入时间</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {distributors.map((d: any) => (
                      <tr key={d._id} className="hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700">
                              {(d.username || '?')[0]}
                            </div>
                            <div>
                              <p className="font-medium">{d.username}</p>
                              <p className="text-xs text-gray-400">{d.phone || '-'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{d.inviteCode}</code>
                        </td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-0.5 rounded ${levelMap[d.distributionLevel]?.color || 'bg-gray-100'}`}>
                            {levelMap[d.distributionLevel]?.label || d.distributionLevel}
                          </span>
                        </td>
                        <td className="p-3 text-right font-medium">¥{formatMoney(d.totalEarnings || 0)}</td>
                        <td className="p-3 text-right text-green-600">¥{formatMoney(d.withdrawableBalance || 0)}</td>
                        <td className="p-3 text-right">{d.teamSize || 0} / {d.totalTeamSize || 0}</td>
                        <td className="p-3 text-right">¥{formatMoney(d.totalSales || 0)}</td>
                        <td className="p-3 text-xs text-gray-500">
                          {d.distributorSince ? new Date(d.distributorSince).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))}
                    {distributors.length === 0 && (
                      <tr><td colSpan={8} className="text-center p-8 text-gray-400">暂无分销商数据</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 分页 */}
          {distributorTotal > 15 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">共 {distributorTotal} 条</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={distributorPage <= 1} onClick={() => setDistributorPage(p => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="flex items-center text-sm px-2">{distributorPage}</span>
                <Button size="sm" variant="outline" disabled={distributorPage * 15 >= distributorTotal} onClick={() => setDistributorPage(p => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ==================== 佣金记录 ==================== */}
        <TabsContent value="commissions" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {['', 'pending', 'settled', 'cancelled'].map(s => (
                <Button
                  key={s}
                  size="sm"
                  variant={commissionFilter === s ? "default" : "outline"}
                  onClick={() => { setCommissionFilter(s); setCommissionPage(1) }}
                >
                  {s === '' ? '全部' : statusMap[s]?.label || s}
                </Button>
              ))}
            </div>
            <Button size="sm" variant="outline" onClick={handleBatchSettle}>
              <CheckCircle className="h-4 w-4 mr-1" />批量结算
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 font-medium">佣金ID</th>
                      <th className="text-left p-3 font-medium">分销商</th>
                      <th className="text-left p-3 font-medium">购买者</th>
                      <th className="text-center p-3 font-medium">层级</th>
                      <th className="text-right p-3 font-medium">订单金额</th>
                      <th className="text-center p-3 font-medium">比例</th>
                      <th className="text-right p-3 font-medium">佣金</th>
                      <th className="text-center p-3 font-medium">状态</th>
                      <th className="text-left p-3 font-medium">时间</th>
                      <th className="text-center p-3 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {commissions.map((c: any) => (
                      <tr key={c.commissionId} className="hover:bg-gray-50">
                        <td className="p-3 text-xs text-gray-500 font-mono">{c.commissionId?.slice(0, 16)}...</td>
                        <td className="p-3 text-xs">{c.distributorId?.slice(0, 8)}...</td>
                        <td className="p-3">{c.buyerName || c.buyerId?.slice(0, 8)}</td>
                        <td className="p-3 text-center">
                          <Badge variant={c.level === 1 ? "default" : "secondary"}>
                            {c.level === 1 ? '直推' : '间推'}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">¥{formatMoney(c.orderAmount)}</td>
                        <td className="p-3 text-center">{c.commissionRate}%</td>
                        <td className="p-3 text-right font-bold text-green-600">¥{formatMoney(c.commissionAmount)}</td>
                        <td className="p-3 text-center">
                          <Badge variant={statusMap[c.status]?.variant || "outline"}>
                            {statusMap[c.status]?.label || c.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</td>
                        <td className="p-3 text-center">
                          {c.status === 'pending' && (
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleSettleCommission(c.commissionId)}>
                              结算
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {commissions.length === 0 && (
                      <tr><td colSpan={10} className="text-center p-8 text-gray-400">暂无佣金记录</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {commissionTotal > 15 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">共 {commissionTotal} 条</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={commissionPage <= 1} onClick={() => setCommissionPage(p => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="flex items-center text-sm px-2">{commissionPage}</span>
                <Button size="sm" variant="outline" disabled={commissionPage * 15 >= commissionTotal} onClick={() => setCommissionPage(p => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ==================== 提现管理 ==================== */}
        <TabsContent value="withdrawals" className="space-y-4">
          <div className="flex gap-2">
            {['', 'pending', 'approved', 'rejected', 'completed'].map(s => (
              <Button
                key={s}
                size="sm"
                variant={withdrawalFilter === s ? "default" : "outline"}
                onClick={() => { setWithdrawalFilter(s); setWithdrawalPage(1) }}
              >
                {s === '' ? '全部' : statusMap[s]?.label || s}
              </Button>
            ))}
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 font-medium">提现ID</th>
                      <th className="text-left p-3 font-medium">用户</th>
                      <th className="text-right p-3 font-medium">金额</th>
                      <th className="text-center p-3 font-medium">方式</th>
                      <th className="text-center p-3 font-medium">状态</th>
                      <th className="text-left p-3 font-medium">备注</th>
                      <th className="text-left p-3 font-medium">申请时间</th>
                      <th className="text-center p-3 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {withdrawals.map((w: any) => (
                      <tr key={w.withdrawalId} className="hover:bg-gray-50">
                        <td className="p-3 text-xs text-gray-500 font-mono">{w.withdrawalId?.slice(0, 16)}...</td>
                        <td className="p-3 text-xs">{w.userId?.slice(0, 10)}...</td>
                        <td className="p-3 text-right font-bold">¥{formatMoney(w.amount)}</td>
                        <td className="p-3 text-center">
                          <Badge variant="outline">
                            {w.method === 'wechat' ? '微信' : w.method === 'alipay' ? '支付宝' : '银行卡'}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant={statusMap[w.status]?.variant || "outline"}>
                            {statusMap[w.status]?.label || w.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-xs text-gray-500">{w.remark || '-'}</td>
                        <td className="p-3 text-xs text-gray-500">{new Date(w.createdAt).toLocaleString()}</td>
                        <td className="p-3 text-center">
                          {w.status === 'pending' && (
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setReviewDialog(w)}>
                              审核
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {withdrawals.length === 0 && (
                      <tr><td colSpan={8} className="text-center p-8 text-gray-400">暂无提现记录</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {withdrawalTotal > 15 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">共 {withdrawalTotal} 条</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={withdrawalPage <= 1} onClick={() => setWithdrawalPage(p => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="flex items-center text-sm px-2">{withdrawalPage}</span>
                <Button size="sm" variant="outline" disabled={withdrawalPage * 15 >= withdrawalTotal} onClick={() => setWithdrawalPage(p => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ==================== 分销设置 ==================== */}
        <TabsContent value="settings" className="space-y-6">
          {configSaved && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">分销配置已保存</AlertDescription>
            </Alert>
          )}

          {config && (
            <>
              {/* 基本开关 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">基本设置</CardTitle>
                  <CardDescription>控制分销功能的开关和基本参数</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">启用分销功能</p>
                      <p className="text-xs text-gray-500">关闭后新订单不再产生佣金</p>
                    </div>
                    <Switch
                      checked={config.enabled}
                      onCheckedChange={(v) => setConfig({ ...config, enabled: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">启用二级分销</p>
                      <p className="text-xs text-gray-500">开启后支持间接推荐分佣</p>
                    </div>
                    <Switch
                      checked={config.level2Enabled}
                      onCheckedChange={(v) => setConfig({ ...config, level2Enabled: v })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 默认佣金比例 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">默认佣金比例</CardTitle>
                  <CardDescription>全局默认佣金比例，可被产品专属比例覆盖</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>一级分销佣金比例 (%)</Label>
                      <Input
                        type="number"
                        value={config.level1Rate}
                        onChange={(e) => setConfig({ ...config, level1Rate: Number(e.target.value) })}
                        min="0" max="50"
                      />
                      <p className="text-xs text-gray-500">直接推荐人获得的佣金比例</p>
                    </div>
                    <div className="space-y-2">
                      <Label>二级分销佣金比例 (%)</Label>
                      <Input
                        type="number"
                        value={config.level2Rate}
                        onChange={(e) => setConfig({ ...config, level2Rate: Number(e.target.value) })}
                        min="0" max="30"
                        disabled={!config.level2Enabled}
                      />
                      <p className="text-xs text-gray-500">间接推荐人获得的佣金比例</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 产品专属佣金 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">产品专属佣金比例</CardTitle>
                  <CardDescription>针对不同产品设置独立佣金比例，覆盖默认值</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(config.productRates || []).map((pr: any, idx: number) => {
                      const typeLabels: Record<string, string> = {
                        vip: 'VIP会员', test_count: '测试次数', single_test: '单次测试', enterprise: '企业版'
                      }
                      return (
                        <div key={idx} className="grid grid-cols-3 gap-4 items-end p-3 bg-gray-50 rounded-lg">
                          <div className="space-y-1">
                            <Label className="text-xs">{typeLabels[pr.productType] || pr.productType}</Label>
                            <Input value={pr.productType} disabled className="text-xs h-8" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">一级比例 (%)</Label>
                            <Input
                              type="number"
                              value={pr.level1Rate}
                              className="h-8"
                              onChange={(e) => {
                                const newRates = [...config.productRates]
                                newRates[idx] = { ...newRates[idx], level1Rate: Number(e.target.value) }
                                setConfig({ ...config, productRates: newRates })
                              }}
                              min="0" max="50"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">二级比例 (%)</Label>
                            <Input
                              type="number"
                              value={pr.level2Rate}
                              className="h-8"
                              onChange={(e) => {
                                const newRates = [...config.productRates]
                                newRates[idx] = { ...newRates[idx], level2Rate: Number(e.target.value) }
                                setConfig({ ...config, productRates: newRates })
                              }}
                              min="0" max="30"
                              disabled={!config.level2Enabled}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* 提现配置 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">提现设置</CardTitle>
                  <CardDescription>设置提现门槛和手续费</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>最低提现金额 (元)</Label>
                      <Input
                        type="number"
                        value={(config.minWithdrawAmount || 0) / 100}
                        onChange={(e) => setConfig({ ...config, minWithdrawAmount: Number(e.target.value) * 100 })}
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>提现手续费 (%)</Label>
                      <Input
                        type="number"
                        value={config.withdrawFeeRate}
                        onChange={(e) => setConfig({ ...config, withdrawFeeRate: Number(e.target.value) })}
                        min="0" max="10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>自动结算天数</Label>
                      <Input
                        type="number"
                        value={config.autoSettleDays}
                        onChange={(e) => setConfig({ ...config, autoSettleDays: Number(e.target.value) })}
                        min="0" max="30"
                      />
                      <p className="text-xs text-gray-500">订单完成后N天自动结算佣金</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleSaveConfig} className="w-full">
                <Settings className="h-4 w-4 mr-2" />保存分销配置
              </Button>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* 提现审核对话框 */}
      <Dialog open={!!reviewDialog} onOpenChange={() => { setReviewDialog(null); setReviewRemark("") }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>审核提现申请</DialogTitle>
            <DialogDescription>
              提现金额：¥{formatMoney(reviewDialog?.amount || 0)} | 方式：{reviewDialog?.method === 'wechat' ? '微信' : reviewDialog?.method === 'alipay' ? '支付宝' : '银行卡'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>审核备注</Label>
              <Input
                placeholder="输入审核备注（可选）"
                value={reviewRemark}
                onChange={(e) => setReviewRemark(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="destructive" onClick={() => handleReviewWithdrawal(false)}>
              <XCircle className="h-4 w-4 mr-1" />拒绝
            </Button>
            <Button onClick={() => handleReviewWithdrawal(true)}>
              <CheckCircle className="h-4 w-4 mr-1" />通过
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
