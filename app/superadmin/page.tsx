"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building, Users, CreditCard, Settings, LogOut, Plus, Search, BarChart, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// 模拟企业数据
const mockEnterprises = [
  {
    id: "ent-001",
    name: "科技创新有限公司",
    contact: "张经理",
    phone: "13800138001",
    email: "zhang@example.com",
    balance: 19800,
    usedTests: 42,
    remainingTests: 354,
    createdAt: "2025-01-15",
  },
  {
    id: "ent-002",
    name: "未来教育集团",
    contact: "李总监",
    phone: "13900139002",
    email: "li@example.com",
    balance: 9500,
    usedTests: 128,
    remainingTests: 62,
    createdAt: "2025-02-20",
  },
  {
    id: "ent-003",
    name: "健康医疗科技",
    contact: "王主管",
    phone: "13700137003",
    email: "wang@example.com",
    balance: 25000,
    usedTests: 76,
    remainingTests: 424,
    createdAt: "2025-03-05",
  },
]

export default function SuperAdminPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [enterprises, setEnterprises] = useState(mockEnterprises)
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewEnterpriseDialog, setShowNewEnterpriseDialog] = useState(false)
  const [showRechargeDialog, setShowRechargeDialog] = useState(false)
  const [selectedEnterprise, setSelectedEnterprise] = useState<any>(null)
  const [newEnterpriseForm, setNewEnterpriseForm] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    licenseNumber: "",
    address: "",
    initialBalance: "19800",
  })
  const [rechargeAmount, setRechargeAmount] = useState("500")
  const [showPricingDialog, setShowPricingDialog] = useState(false)
  const [pricingConfig, setPricingConfig] = useState({
    faceTest: 1,
    mbtiTest: 3,
    pdpTest: 3,
    discTest: 3,
    fullReport: 10,
    teamAnalysis: 50,
    minRecharge: 500,
    testsPerRecharge: 10,
    personalDeepService: 198,
    teamDeepService: 1980,
  })

  // 检查登录状态
  useEffect(() => {
    const superAdminLoggedIn = localStorage.getItem("superAdminLoggedIn") === "true"
    if (!superAdminLoggedIn) {
      router.push("/superadmin/login")
    } else {
      setIsLoggedIn(true)
    }

    // 加载默认价格配置
    const savedPricingConfig = localStorage.getItem("defaultPricingConfig")
    if (savedPricingConfig) {
      setPricingConfig(JSON.parse(savedPricingConfig))
    }
  }, [router])

  // 过滤企业列表
  const filteredEnterprises = enterprises.filter(
    (enterprise) =>
      enterprise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enterprise.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enterprise.phone.includes(searchTerm) ||
      enterprise.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 处理新建企业
  const handleCreateEnterprise = () => {
    const newEnterprise = {
      id: `ent-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newEnterpriseForm.name,
      contact: newEnterpriseForm.contact,
      phone: newEnterpriseForm.phone,
      email: newEnterpriseForm.email,
      balance: Number.parseInt(newEnterpriseForm.initialBalance),
      usedTests: 0,
      remainingTests: Math.floor(Number.parseInt(newEnterpriseForm.initialBalance) / 50), // 按照500元10次计算
      createdAt: new Date().toISOString().split("T")[0],
    }

    setEnterprises([...enterprises, newEnterprise])
    setShowNewEnterpriseDialog(false)

    // 重置表单
    setNewEnterpriseForm({
      name: "",
      contact: "",
      phone: "",
      email: "",
      licenseNumber: "",
      address: "",
      initialBalance: "19800",
    })
  }

  // 处理企业充值
  const handleRecharge = () => {
    if (!selectedEnterprise) return

    const updatedEnterprises = enterprises.map((enterprise) => {
      if (enterprise.id === selectedEnterprise.id) {
        const rechargeValue = Number.parseInt(rechargeAmount)
        const newBalance = enterprise.balance + rechargeValue
        const newRemainingTests = enterprise.remainingTests + Math.floor(rechargeValue / 50) // 按照500元10次计算

        return {
          ...enterprise,
          balance: newBalance,
          remainingTests: newRemainingTests,
        }
      }
      return enterprise
    })

    setEnterprises(updatedEnterprises)
    setShowRechargeDialog(false)
    setRechargeAmount("500")
  }

  const handleSavePricing = () => {
    localStorage.setItem("defaultPricingConfig", JSON.stringify(pricingConfig))
    setShowPricingDialog(false)
  }

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem("superAdminLoggedIn")
    router.push("/superadmin/login")
  }

  if (!isLoggedIn) {
    return null // 等待重定向
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">神仙团队AI性格测试 - 超级管理员</h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            退出登录
          </Button>
        </div>
      </header>

      {/* 侧边栏和主内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
        {/* 侧边导航 */}
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start bg-gray-100">
                  <Building className="h-4 w-4 mr-2" />
                  企业管理
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push("/superadmin/finance")}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  财务管理
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setShowPricingDialog(true)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  价格设置
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push("/superadmin/users")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  用户数据
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push("/superadmin/settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  系统设置
                </Button>
              </nav>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">系统概览</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>企业总数:</span>
                  <span className="font-medium">{enterprises.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>总余额:</span>
                  <span className="font-medium">
                    ¥{enterprises.reduce((sum, enterprise) => sum + enterprise.balance, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>已用测试:</span>
                  <span className="font-medium">
                    {enterprises.reduce((sum, enterprise) => sum + enterprise.usedTests, 0)}次
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>剩余测试:</span>
                  <span className="font-medium">
                    {enterprises.reduce((sum, enterprise) => sum + enterprise.remainingTests, 0)}次
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主内容 */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>企业管理</CardTitle>
                  <CardDescription>管理所有企业账户和充值情况</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowNewEnterpriseDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    新建企业
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* 搜索和筛选 */}
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="搜索企业名称、联系人或电话..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* 企业数据表格 */}
              <div className="rounded-md border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        企业信息
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        联系方式
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        账户余额
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        测试次数
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        创建时间
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEnterprises.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          暂无企业数据
                        </td>
                      </tr>
                    ) : (
                      filteredEnterprises.map((enterprise) => (
                        <tr key={enterprise.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="font-medium">{enterprise.name}</div>
                              <div className="text-xs text-gray-500">ID: {enterprise.id}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div>{enterprise.contact}</div>
                              <div className="text-xs text-gray-500">{enterprise.phone}</div>
                              <div className="text-xs text-gray-500">{enterprise.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">¥{enterprise.balance.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div>已用: {enterprise.usedTests}次</div>
                              <div className="text-xs text-gray-500">剩余: {enterprise.remainingTests}次</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{enterprise.createdAt}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedEnterprise(enterprise)
                                  setShowRechargeDialog(true)
                                }}
                              >
                                充值
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/superadmin/enterprise/${enterprise.id}`)}
                              >
                                管理
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">
                <BarChart className="h-4 w-4 mr-2" />
                数据概览
              </TabsTrigger>
              <TabsTrigger value="finance">
                <CreditCard className="h-4 w-4 mr-2" />
                财务统计
              </TabsTrigger>
              <TabsTrigger value="reports">
                <FileText className="h-4 w-4 mr-2" />
                测试报告
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>系统数据概览</CardTitle>
                  <CardDescription>查看系统整体运营数据</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="text-sm font-medium text-gray-500 mb-1">总测试次数</div>
                      <div className="text-2xl font-bold">
                        {enterprises.reduce((sum, e) => sum + e.usedTests, 0).toLocaleString()}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        平均每企业:{" "}
                        {Math.round(enterprises.reduce((sum, e) => sum + e.usedTests, 0) / enterprises.length)}次
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <div className="text-sm font-medium text-gray-500 mb-1">总收入</div>
                      <div className="text-2xl font-bold">
                        ¥
                        {(
                          enterprises.reduce((sum, e) => sum + e.balance, 0) +
                          enterprises.reduce((sum, e) => sum + e.usedTests * 50, 0)
                        ).toLocaleString()}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">包含账户余额和已消费金额</div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <div className="text-sm font-medium text-gray-500 mb-1">企业数量</div>
                      <div className="text-2xl font-bold">{enterprises.length}</div>
                      <div className="mt-2 text-xs text-gray-500">
                        活跃企业: {enterprises.filter((e) => e.usedTests > 0).length}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-800 mb-3">测试类型分布</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">人脸测试 (¥1/次)</span>
                          <span className="text-sm text-gray-500">40%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">MBTI测试 (¥3/次)</span>
                          <span className="text-sm text-gray-500">35%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">PDP/DISC测试 (¥3/次)</span>
                          <span className="text-sm text-gray-500">25%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="finance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>财务统计</CardTitle>
                  <CardDescription>查看系统财务数据和收入明细</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium text-gray-800 mb-3">收入明细</h3>
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left pb-2 text-sm font-medium text-gray-500">收入类型</th>
                            <th className="text-right pb-2 text-sm font-medium text-gray-500">金额</th>
                            <th className="text-right pb-2 text-sm font-medium text-gray-500">占比</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2">企业首充</td>
                            <td className="py-2 text-right">¥59,400</td>
                            <td className="py-2 text-right">60%</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">企业续费</td>
                            <td className="py-2 text-right">¥24,750</td>
                            <td className="py-2 text-right">25%</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">个人付费</td>
                            <td className="py-2 text-right">¥9,900</td>
                            <td className="py-2 text-right">10%</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">报告查看</td>
                            <td className="py-2 text-right">¥4,950</td>
                            <td className="py-2 text-right">5%</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">总计</td>
                            <td className="py-2 text-right font-medium">¥99,000</td>
                            <td className="py-2 text-right font-medium">100%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium text-gray-800 mb-3">成本明细</h3>
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left pb-2 text-sm font-medium text-gray-500">成本类型</th>
                            <th className="text-right pb-2 text-sm font-medium text-gray-500">金额</th>
                            <th className="text-right pb-2 text-sm font-medium text-gray-500">占比</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2">人脸测试API</td>
                            <td className="py-2 text-right">¥4,950</td>
                            <td className="py-2 text-right">16.5%</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">MBTI测试</td>
                            <td className="py-2 text-right">¥12,870</td>
                            <td className="py-2 text-right">42.9%</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">PDP/DISC测试</td>
                            <td className="py-2 text-right">¥12,180</td>
                            <td className="py-2 text-right">40.6%</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">总计</td>
                            <td className="py-2 text-right font-medium">¥30,000</td>
                            <td className="py-2 text-right font-medium">100%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium text-gray-800 mb-3">利润分析</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm font-medium text-gray-500 mb-1">总收入</div>
                          <div className="text-xl font-bold">¥99,000</div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm font-medium text-gray-500 mb-1">总成本</div>
                          <div className="text-xl font-bold">¥30,000</div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm font-medium text-gray-500 mb-1">净利润</div>
                          <div className="text-xl font-bold text-green-600">¥69,000</div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">利润率</span>
                          <span className="text-sm text-gray-500">69.7%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "69.7%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>测试报告数据</CardTitle>
                  <CardDescription>查看所有企业的MBTI测试数据库</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium text-gray-800 mb-3">MBTI类型分布</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { type: "INTJ", count: 42, percent: "8.4%" },
                          { type: "INTP", count: 38, percent: "7.6%" },
                          { type: "ENTJ", count: 35, percent: "7.0%" },
                          { type: "ENTP", count: 33, percent: "6.6%" },
                          { type: "INFJ", count: 31, percent: "6.2%" },
                          { type: "INFP", count: 29, percent: "5.8%" },
                          { type: "ENFJ", count: 27, percent: "5.4%" },
                          { type: "ENFP", count: 45, percent: "9.0%" },
                          { type: "ISTJ", count: 48, percent: "9.6%" },
                          { type: "ISFJ", count: 26, percent: "5.2%" },
                          { type: "ESTJ", count: 44, percent: "8.8%" },
                          { type: "ESFJ", count: 28, percent: "5.6%" },
                          { type: "ISTP", count: 24, percent: "4.8%" },
                          { type: "ISFP", count: 22, percent: "4.4%" },
                          { type: "ESTP", count: 18, percent: "3.6%" },
                          { type: "ESFP", count: 10, percent: "2.0%" },
                        ].map((item) => (
                          <div key={item.type} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{item.type}</span>
                              <span className="text-sm text-gray-500">{item.percent}</span>
                            </div>
                            <div className="mt-2 text-sm">{item.count}人</div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                              <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: item.percent }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium text-gray-800 mb-3">MBTI维度分布</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">内向 (I)</span>
                            <span className="text-sm text-gray-500">52%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "52%" }}></div>
                          </div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">外向 (E)</span>
                            <span className="text-sm text-gray-500">48%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "48%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">感觉 (S)</span>
                            <span className="text-sm text-gray-500">44%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: "44%" }}></div>
                          </div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">直觉 (N)</span>
                            <span className="text-sm text-gray-500">56%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: "56%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">思考 (T)</span>
                            <span className="text-sm text-gray-500">58%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "58%" }}></div>
                          </div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">情感 (F)</span>
                            <span className="text-sm text-gray-500">42%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "42%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">判断 (J)</span>
                            <span className="text-sm text-gray-500">61%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div className="bg-red-600 h-2 rounded-full" style={{ width: "61%" }}></div>
                          </div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">感知 (P)</span>
                            <span className="text-sm text-gray-500">39%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-red-600 h-2 rounded-full" style={{ width: "39%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 新建企业对话框 */}
      <Dialog open={showNewEnterpriseDialog} onOpenChange={setShowNewEnterpriseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>新建企业</DialogTitle>
            <DialogDescription>创建新的企业账户并设置初始充值金额</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="enterprise-name">企业名称</Label>
              <Input
                id="enterprise-name"
                value={newEnterpriseForm.name}
                onChange={(e) => setNewEnterpriseForm({ ...newEnterpriseForm, name: e.target.value })}
                placeholder="输入企业名称"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-name">联系人</Label>
              <Input
                id="contact-name"
                value={newEnterpriseForm.contact}
                onChange={(e) => setNewEnterpriseForm({ ...newEnterpriseForm, contact: e.target.value })}
                placeholder="输入联系人姓名"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone">联系电话</Label>
              <Input
                id="contact-phone"
                value={newEnterpriseForm.phone}
                onChange={(e) => setNewEnterpriseForm({ ...newEnterpriseForm, phone: e.target.value })}
                placeholder="输入联系电话"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">电子邮箱</Label>
              <Input
                id="contact-email"
                type="email"
                value={newEnterpriseForm.email}
                onChange={(e) => setNewEnterpriseForm({ ...newEnterpriseForm, email: e.target.value })}
                placeholder="输入电子邮箱"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="license-number">营业执照号</Label>
              <Input
                id="license-number"
                value={newEnterpriseForm.licenseNumber}
                onChange={(e) => setNewEnterpriseForm({ ...newEnterpriseForm, licenseNumber: e.target.value })}
                placeholder="输入营业执照号"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">企业地址</Label>
              <Textarea
                id="address"
                value={newEnterpriseForm.address}
                onChange={(e) => setNewEnterpriseForm({ ...newEnterpriseForm, address: e.target.value })}
                placeholder="输入企业地址"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initial-balance">初始充值金额</Label>
              <Input
                id="initial-balance"
                type="number"
                value={newEnterpriseForm.initialBalance}
                onChange={(e) => setNewEnterpriseForm({ ...newEnterpriseForm, initialBalance: e.target.value })}
                min="0"
                step="100"
              />
              <p className="text-xs text-gray-500">默认首充金额为19800元</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewEnterpriseDialog(false)}>
              取消
            </Button>
            <Button onClick={handleCreateEnterprise}>创建企业</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 企业充值对话框 */}
      <Dialog open={showRechargeDialog} onOpenChange={setShowRechargeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>企业充值</DialogTitle>
            <DialogDescription>为 {selectedEnterprise?.name} 充值测试费用</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">当前余额</span>
                <span className="font-medium">¥{selectedEnterprise?.balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">剩余测试次数</span>
                <span className="font-medium">{selectedEnterprise?.remainingTests}次</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recharge-amount">充值金额</Label>
              <Input
                id="recharge-amount"
                type="number"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                min="500"
                step="500"
              />
              <p className="text-xs text-gray-500">最低充值金额为500元，每500元可进行10次测试</p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-blue-600 text-xs">i</span>
                </div>
                <div className="text-sm text-blue-700">
                  充值 {rechargeAmount} 元将增加 {Math.floor(Number.parseInt(rechargeAmount) / 50)} 次测试额度
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRechargeDialog(false)}>
              取消
            </Button>
            <Button onClick={handleRecharge}>确认充值</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 价格设置对话框 */}
      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>默认价格设置</DialogTitle>
            <DialogDescription>设置系统默认价格配置（管理员不能低于此价格）</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="default-face-test">人脸测试默认价格 (元/次)</Label>
              <Input
                id="default-face-test"
                type="number"
                value={pricingConfig.faceTest}
                onChange={(e) => setPricingConfig({ ...pricingConfig, faceTest: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-mbti-test">MBTI测试默认价格 (元/次)</Label>
              <Input
                id="default-mbti-test"
                type="number"
                value={pricingConfig.mbtiTest}
                onChange={(e) => setPricingConfig({ ...pricingConfig, mbtiTest: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-pdp-test">PDP测试默认价格 (元/次)</Label>
              <Input
                id="default-pdp-test"
                type="number"
                value={pricingConfig.pdpTest}
                onChange={(e) => setPricingConfig({ ...pricingConfig, pdpTest: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-disc-test">DISC测试默认价格 (元/次)</Label>
              <Input
                id="default-disc-test"
                type="number"
                value={pricingConfig.discTest}
                onChange={(e) => setPricingConfig({ ...pricingConfig, discTest: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-full-report">完整报告默认价格 (元/份)</Label>
              <Input
                id="default-full-report"
                type="number"
                value={pricingConfig.fullReport}
                onChange={(e) => setPricingConfig({ ...pricingConfig, fullReport: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-team-analysis">团队分析默认价格 (元/次)</Label>
              <Input
                id="default-team-analysis"
                type="number"
                value={pricingConfig.teamAnalysis}
                onChange={(e) => setPricingConfig({ ...pricingConfig, teamAnalysis: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-min-recharge">企业最低充值金额 (元)</Label>
              <Input
                id="default-min-recharge"
                type="number"
                value={pricingConfig.minRecharge || 500}
                onChange={(e) => setPricingConfig({ ...pricingConfig, minRecharge: Number(e.target.value) })}
                min="100"
                step="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-tests-per-recharge">每次充值默认测试次数</Label>
              <Input
                id="default-tests-per-recharge"
                type="number"
                value={pricingConfig.testsPerRecharge || 10}
                onChange={(e) => setPricingConfig({ ...pricingConfig, testsPerRecharge: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-personal-deep-service">个人深度服务价格 (元/次)</Label>
              <Input
                id="default-personal-deep-service"
                type="number"
                value={pricingConfig.personalDeepService}
                onChange={(e) => setPricingConfig({ ...pricingConfig, personalDeepService: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-team-deep-service">团队深度服务价格 (元/人次)</Label>
              <Input
                id="default-team-deep-service"
                type="number"
                value={pricingConfig.teamDeepService}
                onChange={(e) => setPricingConfig({ ...pricingConfig, teamDeepService: Number(e.target.value) })}
                min="1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPricingDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSavePricing}>保存默认价格</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
