"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus, Search, Building2, Phone, CreditCard, Eye, RefreshCw
} from "lucide-react"

// 企业状态枚举
type EnterpriseStatus = "active" | "inactive" | "trial"

// 企业数据类型（对应 MongoDB Enterprise 模型）
interface Enterprise {
  _id: string
  name: string
  contact: string
  phone: string
  email: string
  status: EnterpriseStatus
  balance: number
  usedTests: number
  remainingTests: number
  userCount: number
  sourceId?: number
  sourcePlatform?: string
  industry?: string
  memo?: string
  createdAt: string
}

// 统计数据
interface Stats {
  total: number
  active: number
  trial: number
  inactive: number
  totalBalance: number
  totalTests: number
}

// 状态标签样式
const statusConfig: Record<EnterpriseStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  active: { label: "运营中", variant: "default" },
  trial: { label: "试用中", variant: "secondary" },
  inactive: { label: "已停用", variant: "outline" },
}

export default function EnterprisesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 数据状态
  const [enterprises, setEnterprises] = useState<Enterprise[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // 新建企业
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [createForm, setCreateForm] = useState({ name: "", contact: "", phone: "" })
  const [creating, setCreating] = useState(false)

  // 充值对话框
  const [showRechargeDialog, setShowRechargeDialog] = useState(false)
  const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null)
  const [rechargeAmount, setRechargeAmount] = useState("5000")
  const [recharging, setRecharging] = useState(false)

  // URL参数触发新建
  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setShowCreateDialog(true)
    }
  }, [searchParams])

  // 加载企业列表（从 API）
  const loadEnterprises = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.set("search", searchTerm)
      if (statusFilter !== "all") params.set("status", statusFilter)

      const res = await fetch(`/api/superadmin/enterprises?${params.toString()}`)
      const json = await res.json()

      if (json.code === 200 && json.data) {
        setEnterprises(json.data.enterprises)
        setStats(json.data.stats)
      } else {
        console.error("加载企业列表失败:", json.message)
      }
    } catch (error) {
      console.error("加载企业列表失败:", error)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, statusFilter])

  // 初次加载和筛选变化时重新加载
  useEffect(() => {
    loadEnterprises()
  }, [statusFilter])

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      loadEnterprises()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // 新建企业（调用 API）
  const handleCreate = async () => {
    if (!createForm.name.trim()) return
    setCreating(true)

    try {
      const res = await fetch("/api/superadmin/enterprises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createForm.name.trim(),
          contact: createForm.contact.trim(),
          phone: createForm.phone.trim(),
          remainingTests: 10,
        }),
      })

      const json = await res.json()
      if (json.code === 200) {
        setShowCreateDialog(false)
        setCreateForm({ name: "", contact: "", phone: "" })
        await loadEnterprises()
      } else {
        alert("创建失败: " + json.message)
      }
    } catch (error) {
      console.error("创建企业失败:", error)
      alert("创建企业失败")
    } finally {
      setCreating(false)
    }
  }

  // 充值（调用 API）
  const handleRecharge = async () => {
    if (!selectedEnterprise) return
    const amount = parseInt(rechargeAmount)
    if (isNaN(amount) || amount < 500) {
      alert("充值金额不能少于500元")
      return
    }

    setRecharging(true)
    try {
      const res = await fetch("/api/superadmin/enterprises", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedEnterprise._id,
          action: "recharge",
          amount,
        }),
      })

      const json = await res.json()
      if (json.code === 200) {
        setShowRechargeDialog(false)
        setRechargeAmount("5000")
        await loadEnterprises()
      } else {
        alert("充值失败: " + json.message)
      }
    } catch (error) {
      console.error("充值失败:", error)
      alert("充值失败")
    } finally {
      setRecharging(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">企业管理</h1>
          <p className="text-sm text-gray-500 mt-1">
            共 {stats?.total || 0} 家企业 · 活跃 {stats?.active || 0} 家
            {stats?.totalBalance ? ` · 总余额 ¥${stats.totalBalance.toLocaleString()}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadEnterprises} disabled={loading}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            刷新
          </Button>
          <Button onClick={() => setShowCreateDialog(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            新建企业
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500">企业总数</p>
              <p className="text-xl font-bold mt-1">
                {stats.total} <span className="text-sm font-normal text-emerald-600">({stats.active}活跃)</span>
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500">总账户余额</p>
              <p className="text-xl font-bold mt-1">¥{stats.totalBalance.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500">总测试次数</p>
              <p className="text-xl font-bold mt-1">{stats.totalTests.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 搜索和筛选栏 */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索企业名称、联系人、电话..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: "all", label: "全部" },
            { key: "active", label: "运营中" },
            { key: "trial", label: "试用" },
            { key: "inactive", label: "已停用" },
          ].map((item) => (
            <Button
              key={item.key}
              variant="ghost"
              size="sm"
              className={`text-xs h-7 px-3 rounded-md ${statusFilter === item.key ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}
              onClick={() => setStatusFilter(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 企业列表 */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">企业信息</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">联系方式</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">状态</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500">账户余额</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500">测试用量</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500">用户数</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && enterprises.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
                    <p className="text-sm text-gray-400 mt-2">加载中...</p>
                  </td>
                </tr>
              ) : enterprises.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                    {searchTerm ? "没有匹配的企业" : "暂无企业数据"}
                  </td>
                </tr>
              ) : (
                enterprises.map((enterprise) => (
                  <tr key={enterprise._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{enterprise.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {enterprise.industry ? `${enterprise.industry} · ` : ""}
                            {new Date(enterprise.createdAt).toLocaleDateString("zh-CN")}
                            {enterprise.sourceId ? ` · CKB#${enterprise.sourceId}` : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{enterprise.contact || "-"}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" />{enterprise.phone || "未设置"}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={statusConfig[enterprise.status]?.variant || "outline"} className="text-xs">
                        {statusConfig[enterprise.status]?.label || enterprise.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <p className={`text-sm font-medium ${enterprise.balance > 0 ? "text-gray-900" : "text-red-500"}`}>
                        ¥{enterprise.balance.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <p className="text-sm text-gray-900">{enterprise.usedTests}次</p>
                      <p className="text-xs text-gray-400">剩余 {enterprise.remainingTests}次</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <p className="text-sm text-gray-900">{enterprise.userCount}人</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                          onClick={() => {
                            setSelectedEnterprise(enterprise)
                            setShowRechargeDialog(true)
                          }}
                        >
                          <CreditCard className="h-3.5 w-3.5 mr-1" />充值
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 text-xs"
                          onClick={() => router.push(`/superadmin/enterprises/${enterprise._id}`)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />详情
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ===== 新建企业对话框（极简版） ===== */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-indigo-600" />
              </div>
              新建企业
            </DialogTitle>
            <DialogDescription>填写企业基本信息，其他信息可在详情页补充</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="ent-name" className="text-sm">
                企业名称 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ent-name"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="请输入企业名称"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ent-contact" className="text-sm">联系人</Label>
              <Input
                id="ent-contact"
                value={createForm.contact}
                onChange={(e) => setCreateForm({ ...createForm, contact: e.target.value })}
                placeholder="联系人姓名（可选）"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ent-phone" className="text-sm">联系电话</Label>
              <Input
                id="ent-phone"
                value={createForm.phone}
                onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                placeholder="联系电话（可选）"
              />
            </div>
            <div className="bg-indigo-50 rounded-lg p-3 text-xs text-indigo-700">
              创建后自动获得 <strong>10次</strong> 免费试用额度，其他信息可在企业详情页补充完善。
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>取消</Button>
            <Button
              onClick={handleCreate}
              disabled={!createForm.name.trim() || creating}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {creating ? "创建中..." : "立即创建"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== 企业充值对话框 ===== */}
      <Dialog open={showRechargeDialog} onOpenChange={setShowRechargeDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>企业充值</DialogTitle>
            <DialogDescription>为 {selectedEnterprise?.name} 充值测试费用</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">当前余额</span>
                <span className="font-medium">¥{selectedEnterprise?.balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">剩余测试</span>
                <span className="font-medium">{selectedEnterprise?.remainingTests}次</span>
              </div>
            </div>

            <div>
              <Label className="text-sm mb-2 block">选择充值金额</Label>
              <div className="grid grid-cols-3 gap-2">
                {["1000", "3000", "5000", "10000", "20000", "50000"].map((amount) => (
                  <Button
                    key={amount}
                    variant={rechargeAmount === amount ? "default" : "outline"}
                    size="sm"
                    className={`text-xs ${rechargeAmount === amount ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
                    onClick={() => setRechargeAmount(amount)}
                  >
                    ¥{parseInt(amount).toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">自定义金额</Label>
              <Input
                type="number"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                min="500"
                step="500"
              />
            </div>

            <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700">
              充值 <strong>¥{parseInt(rechargeAmount || "0").toLocaleString()}</strong> 将获得{" "}
              <strong>{Math.floor(parseInt(rechargeAmount || "0") / 50)}</strong> 次测试额度
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowRechargeDialog(false)}>取消</Button>
            <Button
              onClick={handleRecharge}
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={parseInt(rechargeAmount) < 500 || recharging}
            >
              {recharging ? "充值中..." : "确认充值"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
