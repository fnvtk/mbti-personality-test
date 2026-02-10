"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building2, Plus, Search, Users, CreditCard, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 模拟企业数据
const defaultEnterprises = [
  { id: "ent-001", name: "科技创新有限公司", contact: "张经理", phone: "13800138001", balance: 19800, usedTests: 42, remainingTests: 354, plan: "成长版", status: "active" },
  { id: "ent-002", name: "未来教育集团", contact: "李总监", phone: "13900139002", balance: 9500, usedTests: 128, remainingTests: 62, plan: "启动版", status: "active" },
  { id: "ent-003", name: "健康医疗科技", contact: "王主管", phone: "13700137003", balance: 25000, usedTests: 76, remainingTests: 424, plan: "蜕变版", status: "active" },
]

export default function AdminEnterprisePage() {
  const [enterprises] = useState(defaultEnterprises)
  const [search, setSearch] = useState("")

  const filtered = enterprises.filter(e => 
    e.name.includes(search) || e.contact.includes(search) || e.phone.includes(search)
  )

  const totalBalance = enterprises.reduce((sum, e) => sum + e.balance, 0)
  const totalTests = enterprises.reduce((sum, e) => sum + e.usedTests, 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">企业管理</h1>
          <p className="text-sm text-gray-500">管理企业客户、充值和测试额度</p>
        </div>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-1" /> 新增企业
        </Button>
      </div>

      {/* 企业统计 */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <Building2 className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <p className="text-xl font-bold">{enterprises.length}</p>
            <p className="text-xs text-gray-500">企业客户</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <CreditCard className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-xl font-bold">¥{(totalBalance/10000).toFixed(1)}万</p>
            <p className="text-xs text-gray-500">总余额</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <BarChart3 className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xl font-bold">{totalTests}</p>
            <p className="text-xs text-gray-500">测试总量</p>
          </CardContent>
        </Card>
      </div>

      {/* 搜索 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          className="pl-9" 
          placeholder="搜索企业名称、联系人、电话..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 企业列表 */}
      <div className="space-y-3">
        {filtered.map((ent) => (
          <Card key={ent.id} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{ent.name}</p>
                    <p className="text-xs text-gray-500">{ent.contact} · {ent.phone}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">{ent.plan}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="bg-gray-50 rounded p-2 text-center">
                  <p className="text-sm font-bold text-green-600">¥{ent.balance.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-500">账户余额</p>
                </div>
                <div className="bg-gray-50 rounded p-2 text-center">
                  <p className="text-sm font-bold">{ent.usedTests}</p>
                  <p className="text-[10px] text-gray-500">已用测试</p>
                </div>
                <div className="bg-gray-50 rounded p-2 text-center">
                  <p className="text-sm font-bold text-blue-600">{ent.remainingTests}</p>
                  <p className="text-[10px] text-gray-500">剩余测试</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
