"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus, Search, Building2, Phone, Mail, CreditCard,
  MoreHorizontal, Eye, Pencil, Trash2, ArrowUpDown, RefreshCw
} from "lucide-react"

// 企业状态枚举
type EnterpriseStatus = "active" | "inactive" | "trial"

// 企业数据类型
interface Enterprise {
  id: string
  name: string
  contact: string
  phone: string
  email: string
  status: EnterpriseStatus
  balance: number
  usedTests: number
  remainingTests: number
  userCount: number
  createdAt: string
}

// 模拟企业数据（后续接 API）
const mockEnterprises: Enterprise[] = [
  {
    id: "ent-001", name: "科技创新有限公司", contact: "张经理", phone: "13800138001",
    email: "zhang@example.com", status: "active", balance: 19800, usedTests: 42,
    remainingTests: 354, userCount: 86, createdAt: "2025-01-15",
  },
  {
    id: "ent-002", name: "未来教育集团", contact: "李总监", phone: "13900139002",
    email: "li@example.com", status: "active", balance: 9500, usedTests: 128,
    remainingTests: 62, userCount: 234, createdAt: "2025-02-20",
  },
  {
    id: "ent-003", name: "健康医疗科技", contact: "王主管", phone: "13700137003",
    email: "wang@example.com", status: "active", balance: 25000, usedTests: 76,
    remainingTests: 424, userCount: 120, createdAt: "2025-03-05",
  },
  {
    id: "ent-004", name: "智能制造集团", contact: "刘工", phone: "13600136004",
    email: "liu@example.com", status: "trial", balance: 0, usedTests: 5,
    remainingTests: 5, userCount: 15, createdAt: "2025-06-01",
  },
  {
    id: "ent-005", name: "数字营销公司", contact: "陈总", phone: "13500135005",
    email: "chen@example.com", status: "inactive", balance: 0, usedTests: 28,
    remainingTests: 0, userCount: 42, createdAt: "2024-12-10",
  },
]

// 状态标签样式
const statusConfig: Record<EnterpriseStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  active: { label: "运营中", variant: "default" },
  trial: { label: "试用中", variant: "secondary" },
  inactive: { label: "已停用", variant: "outline" },
}

export default function EnterprisesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [enterprises, setEnterprises] = useState<Enterprise[]>(mockEnterprises)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // 新建企业 - 简化为3个核心字段
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [createForm, setCreateForm] = useState({ name: "", contact: "", phone: "" })
  const [creating, setCreating] = useState(false)

  // 充值对话框
  const [showRechargeDialog, setShowRechargeDialog] = useState(false)
  const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null)
  const [rechargeAmount, setRechargeAmount] = useState("5000")

  // 操作菜单
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  // URL参数触发新建
  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setShowCreateDialog(true)
    }
  }, [searchParams])

  // 筛选企业
  const filteredEnterprises = enterprises.filter((e) => {
    const matchSearch = e.name.includes(searchTerm) || e.contact.includes(searchTerm) || e.phone.includes(searchTerm)
    const matchStatus = statusFilter === "all" || e.status === statusFilter
    return matchSearch && matchStatus
  })

  // 新建企业 - 极简流程
  const handleCreate = async () => {
    if (!createForm.name.trim() || !createForm.phone.trim()) return
    setCreating(true)

    // 模拟创建（后续接 API）
    const newEnterprise: Enterprise = {
      id: `ent-${Date.now()}`,
      name: createForm.name.trim(),
      contact: createForm.contact.trim() || "待设置",
      phone: createForm.phone.trim(),
      email: "",
      status: "trial",
      balance: 0,
      usedTests: 0,
      remainingTests: 10, // 试用额度
      userCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setEnterprises([newEnterprise, ...enterprises])
    setShowCreateDialog(false)
    setCreateForm({ name: "", contact: "", phone: "" })
    setCreating(false)
  }

  // 充值
  const handleRecharge = () => {
    if (!selectedEnterprise) return
    const amount = parseInt(rechargeAmount)
    if (isNaN(amount) || amount < 500) return

    setEnterprises(enterprises.map((e) => {
      if (e.id === selectedEnterprise.id) {
        return {
          ...e,
          balance: e.balance + amount,
          remainingTests: e.remainingTests + Math.floor(amount / 50),
          status: "active" as EnterpriseStatus,
        }
      }
      return e
    }))
    setShowRechargeDialog(false)
    setRechargeAmount("5000")
  }

  // 统计数据
  const totalBalance = enterprises.reduce((s, e) => s + e.balance, 0)
  const totalTests = enterprises.reduce((s, e) => s + e.usedTests, 0)
  const activeCount = enterprises.filter((e) => e.status === "active").length

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">企业管理</h1>
          <p className="text-sm text-gray-500 mt-1">
            共 {enterprises.length} 家企业 · 活跃 {activeCount} 家
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          新建企业
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">企业总数</p>
            <p className="text-xl font-bold mt-1">{enterprises.length} <span className="text-sm font-normal text-emerald-600">({activeCount}活跃)</span></p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">总账户余额</p>
            <p className="text-xl font-bold mt-1">¥{totalBalance.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">总测试次数</p>
            <p className="text-xl font-bold mt-1">{totalTests.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

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
              {filteredEnterprises.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                    {searchTerm ? "没有匹配的企业" : "暂无企业数据"}
                  </td>
                </tr>
              ) : (
                filteredEnterprises.map((enterprise) => (
                  <tr key={enterprise.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* 企业信息 */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{enterprise.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">ID: {enterprise.id} · {enterprise.createdAt}</p>
                        </div>
                      </div>
                    </td>
                    {/* 联系方式 */}
                    <td className="px-5 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{enterprise.contact}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" />{enterprise.phone}
                        </p>
                      </div>
                    </td>
                    {/* 状态 */}
                    <td className="px-5 py-4">
                      <Badge variant={statusConfig[enterprise.status].variant} className="text-xs">
                        {statusConfig[enterprise.status].label}
                      </Badge>
                    </td>
                    {/* 余额 */}
                    <td className="px-5 py-4 text-right">
                      <p className={`text-sm font-medium ${enterprise.balance > 0 ? "text-gray-900" : "text-red-500"}`}>
                        ¥{enterprise.balance.toLocaleString()}
                      </p>
                    </td>
                    {/* 测试用量 */}
                    <td className="px-5 py-4 text-right">
                      <p className="text-sm text-gray-900">{enterprise.usedTests}次</p>
                      <p className="text-xs text-gray-400">剩余 {enterprise.remainingTests}次</p>
                    </td>
                    {/* 用户数 */}
                    <td className="px-5 py-4 text-right">
                      <p className="text-sm text-gray-900">{enterprise.userCount}人</p>
                    </td>
                    {/* 操作 */}
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
                          <CreditCard className="h-3.5 w-3.5 mr-1" />
                          充值
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 text-xs"
                          onClick={() => router.push(`/superadmin/enterprises/${enterprise.id}`)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          详情
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
              <Label htmlFor="ent-phone" className="text-sm">
                联系电话 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ent-phone"
                value={createForm.phone}
                onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                placeholder="请输入联系电话"
              />
            </div>

            {/* 提示信息 */}
            <div className="bg-indigo-50 rounded-lg p-3 text-xs text-indigo-700">
              创建后自动获得 <strong>10次</strong> 免费试用额度，其他信息可在企业详情页补充完善。
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>取消</Button>
            <Button
              onClick={handleCreate}
              disabled={!createForm.name.trim() || !createForm.phone.trim() || creating}
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
            {/* 当前账户信息 */}
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

            {/* 快捷金额选择 */}
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

            {/* 自定义金额 */}
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

            {/* 充值预览 */}
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
              disabled={parseInt(rechargeAmount) < 500}
            >
              确认充值
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
