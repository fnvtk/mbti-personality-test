"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft, Copy, Check, Users, TrendingUp, Wallet,
  ArrowDownToLine, Clock, ChevronRight, Share2, DollarSign, UserPlus
} from "lucide-react"
import { useRouter } from "next/navigation"

// 金额格式化（分转元）
const formatMoney = (cents: number) => (cents / 100).toFixed(2)

// 佣金状态映射
const commissionStatusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "待结算", color: "bg-orange-100 text-orange-700" },
  confirmed: { label: "已确认", color: "bg-blue-100 text-blue-700" },
  settled: { label: "已结算", color: "bg-green-100 text-green-700" },
  cancelled: { label: "已取消", color: "bg-gray-100 text-gray-500" },
}

export default function WalletPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState<any>(null)
  const [commissions, setCommissions] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [teamLevel, setTeamLevel] = useState<1 | 2>(1)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  // 模拟用户ID（实际应从登录态获取）
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : ''

  // 加载分销统计
  const loadStats = useCallback(async () => {
    if (!userId) return
    try {
      const res = await fetch(`/api/distribution?userId=${userId}`)
      const data = await res.json()
      if (data.code === 200) setStats(data.data)
    } catch (error) {
      console.error('加载统计失败:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  // 加载佣金记录
  const loadCommissions = useCallback(async () => {
    if (!userId) return
    try {
      const res = await fetch(`/api/distribution/commissions?userId=${userId}&limit=50`)
      const data = await res.json()
      if (data.code === 200) setCommissions(data.data.commissions || [])
    } catch (error) {
      console.error('加载佣金记录失败:', error)
    }
  }, [userId])

  // 加载团队成员
  const loadTeam = useCallback(async () => {
    if (!userId) return
    try {
      const res = await fetch(`/api/distribution/team?userId=${userId}&level=${teamLevel}&limit=50`)
      const data = await res.json()
      if (data.code === 200) setTeamMembers(data.data.members || [])
    } catch (error) {
      console.error('加载团队失败:', error)
    }
  }, [userId, teamLevel])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  useEffect(() => {
    if (activeTab === 'earnings') loadCommissions()
    if (activeTab === 'team') loadTeam()
  }, [activeTab, loadCommissions, loadTeam])

  // 复制邀请码
  const handleCopyCode = () => {
    if (stats?.inviteCode) {
      navigator.clipboard.writeText(stats.inviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 等级标签
  const levelLabels: Record<string, { label: string; color: string }> = {
    normal: { label: "普通分销商", color: "bg-gray-100 text-gray-700" },
    silver: { label: "白银分销商", color: "bg-slate-100 text-slate-700" },
    gold: { label: "黄金分销商", color: "bg-yellow-100 text-yellow-700" },
    diamond: { label: "钻石分销商", color: "bg-blue-100 text-blue-700" },
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      {/* 顶部导航 */}
      <div className="px-5 py-3 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="flex-1 text-center font-bold">分销中心</h1>
        <div className="w-10" />
      </div>

      {/* 余额卡片 */}
      <div className="px-4 pt-2 pb-4">
        <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white border-none overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8" />
          <div className="p-5 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-white/70">可提现余额</p>
                <p className="text-3xl font-bold mt-1">¥{formatMoney(stats?.withdrawableBalance || 0)}</p>
              </div>
              {stats?.distributionLevel && (
                <span className={`text-xs px-2 py-1 rounded-full bg-white/20`}>
                  {levelLabels[stats.distributionLevel]?.label || '普通'}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-white/20">
              <div>
                <p className="text-xs text-white/60">累计收益</p>
                <p className="text-sm font-bold">¥{formatMoney(stats?.totalEarnings || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-white/60">待结算</p>
                <p className="text-sm font-bold">¥{formatMoney(stats?.frozenBalance || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-white/60">已提现</p>
                <p className="text-sm font-bold">¥{formatMoney(stats?.totalWithdrawn || 0)}</p>
              </div>
            </div>

            <Button
              className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white border-white/30"
              variant="outline"
              onClick={() => router.push("/profile/wallet/withdraw")}
            >
              <ArrowDownToLine className="h-4 w-4 mr-2" />立即提现
            </Button>
          </div>
        </Card>
      </div>

      {/* 邀请码卡片 */}
      {stats?.inviteCode && (
        <div className="px-4 pb-4">
          <Card className="border-dashed border-2 border-purple-200 bg-purple-50/50">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Share2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">我的邀请码</p>
                  <p className="text-xl font-bold text-purple-700 tracking-widest">{stats.inviteCode}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-purple-600 border-purple-200"
                onClick={handleCopyCode}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-1 text-xs">{copied ? '已复制' : '复制'}</span>
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* 今日/本月数据 */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-xs text-gray-500">今日收益</span>
          </div>
          <p className="text-lg font-bold">¥{formatMoney(stats?.todayEarnings || 0)}</p>
          <p className="text-xs text-gray-400">{stats?.todayOrders || 0}笔订单</p>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-gray-500">本月收益</span>
          </div>
          <p className="text-lg font-bold">¥{formatMoney(stats?.monthEarnings || 0)}</p>
          <p className="text-xs text-gray-400">{stats?.monthOrders || 0}笔订单</p>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-gray-500">直推团队</span>
          </div>
          <p className="text-lg font-bold">{stats?.directTeam || 0}人</p>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus className="h-4 w-4 text-orange-500" />
            <span className="text-xs text-gray-500">总团队</span>
          </div>
          <p className="text-lg font-bold">{stats?.totalTeam || 0}人</p>
          <p className="text-xs text-gray-400">业绩 ¥{formatMoney(stats?.totalSales || 0)}</p>
        </Card>
      </div>

      {/* 详情 Tabs */}
      <div className="flex-1 px-4 pb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">佣金明细</TabsTrigger>
            <TabsTrigger value="earnings">收益记录</TabsTrigger>
            <TabsTrigger value="team">我的团队</TabsTrigger>
          </TabsList>

          {/* 佣金明细（快速视图） */}
          <TabsContent value="overview" className="mt-3">
            <Card>
              <div className="divide-y">
                {commissions.length === 0 && !loading && (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    暂无佣金记录，分享邀请码给好友开始赚取佣金
                  </div>
                )}
                {commissions.slice(0, 10).map((c: any) => (
                  <div key={c.commissionId} className="p-3 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">
                          {c.buyerName || '用户'} 购买了{c.productType === 'vip' ? 'VIP' : c.productType === 'single_test' ? '单次测试' : c.productType}
                        </p>
                        <Badge variant="outline" className="text-xs h-5">
                          {c.level === 1 ? '直推' : '间推'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(c.createdAt).toLocaleString()} · 比例{c.commissionRate}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">+¥{formatMoney(c.commissionAmount)}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${commissionStatusMap[c.status]?.color || 'bg-gray-100'}`}>
                        {commissionStatusMap[c.status]?.label || c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* 收益记录（完整列表） */}
          <TabsContent value="earnings" className="mt-3">
            <Card>
              <div className="divide-y">
                {commissions.length === 0 && (
                  <div className="p-8 text-center text-gray-400 text-sm">暂无收益记录</div>
                )}
                {commissions.map((c: any) => (
                  <div key={c.commissionId} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${c.level === 1 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {c.level === 1 ? 'L1' : 'L2'}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{c.buyerName || '用户'}</p>
                          <p className="text-xs text-gray-400">订单 ¥{formatMoney(c.orderAmount)} × {c.commissionRate}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+¥{formatMoney(c.commissionAmount)}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${commissionStatusMap[c.status]?.color || 'bg-gray-100'}`}>
                          {commissionStatusMap[c.status]?.label || c.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 pl-10">{new Date(c.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* 我的团队 */}
          <TabsContent value="team" className="mt-3 space-y-3">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={teamLevel === 1 ? "default" : "outline"}
                onClick={() => setTeamLevel(1)}
              >
                直推成员 ({stats?.directTeam || 0})
              </Button>
              <Button
                size="sm"
                variant={teamLevel === 2 ? "default" : "outline"}
                onClick={() => setTeamLevel(2)}
              >
                间推成员 ({stats?.indirectTeam || 0})
              </Button>
            </div>

            <Card>
              <div className="divide-y">
                {teamMembers.length === 0 && (
                  <div className="p-8 text-center text-gray-400 text-sm">暂无团队成员</div>
                )}
                {teamMembers.map((m: any, idx: number) => (
                  <div key={m._id || idx} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-700">
                        {(m.username || '?')[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{m.username || '未知用户'}</p>
                        <p className="text-xs text-gray-400">
                          加入时间: {new Date(m.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">贡献业绩</p>
                      <p className="text-sm font-medium">¥{formatMoney(m.totalSales || 0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
