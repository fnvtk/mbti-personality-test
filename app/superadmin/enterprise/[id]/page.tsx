"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Users, CreditCard, LogOut, Search, FileText, Edit, Save } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

// 模拟企业数据
const mockEnterprises = [
  {
    id: "ent-001",
    name: "科技创新有限公司",
    contact: "张经理",
    phone: "13800138001",
    email: "zhang@example.com",
    licenseNumber: "91110105MA01C2CC33",
    address: "北京市朝阳区科技园区88号",
    balance: 19800,
    usedTests: 42,
    remainingTests: 354,
    createdAt: "2025-01-15",
    status: "active",
    features: {
      faceAnalysis: true,
      mbtiTest: true,
      pdpTest: true,
      discTest: true,
      teamAnalysis: true,
      resumeAnalysis: true,
    },
    users: [
      { id: "u001", name: "李明", department: "技术部", position: "开发工程师", testCount: 3 },
      { id: "u002", name: "王芳", department: "市场部", position: "市场经理", testCount: 2 },
      { id: "u003", name: "张伟", department: "人事部", position: "HR主管", testCount: 5 },
      { id: "u004", name: "刘洋", department: "销售部", position: "销售总监", testCount: 1 },
      { id: "u005", name: "陈晓", department: "财务部", position: "财务经理", testCount: 0 },
    ],
    testRecords: [
      { id: "t001", userId: "u001", userName: "李明", testType: "人脸测试", date: "2025-04-01", cost: 1 },
      { id: "t002", userId: "u001", userName: "李明", testType: "MBTI测试", date: "2025-04-01", cost: 3 },
      { id: "t003", userId: "u001", userName: "李明", testType: "PDP测试", date: "2025-04-01", cost: 3 },
      { id: "t004", userId: "u002", userName: "王芳", testType: "人脸测试", date: "2025-04-02", cost: 1 },
      { id: "t005", userId: "u002", userName: "王芳", testType: "MBTI测试", date: "2025-04-02", cost: 3 },
      { id: "t006", userId: "u003", userName: "张伟", testType: "人脸测试", date: "2025-04-03", cost: 1 },
      { id: "t007", userId: "u003", userName: "张伟", testType: "MBTI测试", date: "2025-04-03", cost: 3 },
      { id: "t008", userId: "u003", userName: "张伟", testType: "PDP测试", date: "2025-04-03", cost: 3 },
      { id: "t009", userId: "u003", userName: "张伟", testType: "DISC测试", date: "2025-04-03", cost: 3 },
      { id: "t010", userId: "u004", userName: "刘洋", testType: "人脸测试", date: "2025-04-04", cost: 1 },
      { id: "t011", userId: "u003", userName: "张伟", testType: "人脸测试", date: "2025-04-05", cost: 1 },
    ],
  },
  {
    id: "ent-002",
    name: "未来教育集团",
    contact: "李总监",
    phone: "13900139002",
    email: "li@example.com",
    licenseNumber: "91110105MA01D3DD44",
    address: "上海市浦东新区教育路66号",
    balance: 9500,
    usedTests: 128,
    remainingTests: 62,
    createdAt: "2025-02-20",
    status: "active",
    features: {
      faceAnalysis: true,
      mbtiTest: true,
      pdpTest: true,
      discTest: true,
      teamAnalysis: false,
      resumeAnalysis: false,
    },
    users: [],
    testRecords: [],
  },
  {
    id: "ent-003",
    name: "健康医疗科技",
    contact: "王主管",
    phone: "13700137003",
    email: "wang@example.com",
    licenseNumber: "91110105MA01E4EE55",
    address: "广州市天河区医疗大道123号",
    balance: 25000,
    usedTests: 76,
    remainingTests: 424,
    createdAt: "2025-03-05",
    status: "active",
    features: {
      faceAnalysis: true,
      mbtiTest: true,
      pdpTest: true,
      discTest: true,
      teamAnalysis: true,
      resumeAnalysis: true,
    },
    users: [],
    testRecords: [],
  },
]

export default function EnterpriseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const enterpriseId = params.id as string

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [enterprise, setEnterprise] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    licenseNumber: "",
    address: "",
  })
  const [features, setFeatures] = useState({
    faceAnalysis: true,
    mbtiTest: true,
    pdpTest: true,
    discTest: true,
    teamAnalysis: true,
    resumeAnalysis: true,
  })

  // 检查登录状态
  useEffect(() => {
    const superAdminLoggedIn = localStorage.getItem("superAdminLoggedIn") === "true"
    if (!superAdminLoggedIn) {
      router.push("/superadmin/login")
    } else {
      setIsLoggedIn(true)
      loadEnterpriseData()
    }
  }, [router, enterpriseId])

  // 加载企业数据
  const loadEnterpriseData = () => {
    setIsLoading(true)

    // 模拟API调用
    setTimeout(() => {
      const foundEnterprise = mockEnterprises.find((e) => e.id === enterpriseId)

      if (foundEnterprise) {
        setEnterprise(foundEnterprise)
        setEditForm({
          name: foundEnterprise.name,
          contact: foundEnterprise.contact,
          phone: foundEnterprise.phone,
          email: foundEnterprise.email,
          licenseNumber: foundEnterprise.licenseNumber || "",
          address: foundEnterprise.address || "",
        })
        setFeatures(foundEnterprise.features)
      } else {
        // 企业不存在，返回列表页
        router.push("/superadmin")
      }

      setIsLoading(false)
    }, 500)
  }

  // 过滤用户列表
  const filteredUsers =
    enterprise?.users.filter(
      (user: any) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.position.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  // 处理保存企业信息
  const handleSaveEnterprise = () => {
    // 模拟API调用
    setEnterprise({
      ...enterprise,
      name: editForm.name,
      contact: editForm.contact,
      phone: editForm.phone,
      email: editForm.email,
      licenseNumber: editForm.licenseNumber,
      address: editForm.address,
      features: features,
    })

    setShowEditDialog(false)
  }

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem("superAdminLoggedIn")
    router.push("/superadmin/login")
  }

  if (!isLoggedIn || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">加载企业数据中...</p>
        </div>
      </div>
    )
  }

  if (!enterprise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-2">企业不存在</h2>
          <p className="text-gray-500 mb-4">未找到ID为 {enterpriseId} 的企业</p>
          <Button onClick={() => router.push("/superadmin")}>返回企业列表</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.push("/superadmin")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold ml-2">企业管理 - {enterprise.name}</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            退出登录
          </Button>
        </div>
      </header>

      {/* 主内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* 企业信息卡片 */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>企业信息</CardTitle>
                <CardDescription>查看和管理企业基本信息</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
                <Edit className="h-4 w-4 mr-2" />
                编辑信息
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">基本信息</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">企业名称</span>
                      <span className="text-sm font-medium">{enterprise.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">企业ID</span>
                      <span className="text-sm font-medium">{enterprise.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">创建时间</span>
                      <span className="text-sm font-medium">{enterprise.createdAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">营业执照号</span>
                      <span className="text-sm font-medium">{enterprise.licenseNumber || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">企业地址</span>
                      <span className="text-sm font-medium">{enterprise.address || "-"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">联系信息</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">联系人</span>
                      <span className="text-sm font-medium">{enterprise.contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">联系电话</span>
                      <span className="text-sm font-medium">{enterprise.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">电子邮箱</span>
                      <span className="text-sm font-medium">{enterprise.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">账户信息</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">账户余额</span>
                      <span className="text-sm font-medium">¥{enterprise.balance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">已用测试</span>
                      <span className="text-sm font-medium">{enterprise.usedTests}次</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">剩余测试</span>
                      <span className="text-sm font-medium">{enterprise.remainingTests}次</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">账户状态</span>
                      <span
                        className={`text-sm font-medium ${enterprise.status === "active" ? "text-green-600" : "text-red-600"}`}
                      >
                        {enterprise.status === "active" ? "正常" : "已禁用"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">功能配置</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">人脸测试</span>
                      <span
                        className={`text-sm font-medium ${enterprise.features.faceAnalysis ? "text-green-600" : "text-gray-400"}`}
                      >
                        {enterprise.features.faceAnalysis ? "已启用" : "已禁用"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">MBTI测试</span>
                      <span
                        className={`text-sm font-medium ${enterprise.features.mbtiTest ? "text-green-600" : "text-gray-400"}`}
                      >
                        {enterprise.features.mbtiTest ? "已启用" : "已禁用"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">PDP测试</span>
                      <span
                        className={`text-sm font-medium ${enterprise.features.pdpTest ? "text-green-600" : "text-gray-400"}`}
                      >
                        {enterprise.features.pdpTest ? "已启用" : "已禁用"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">DISC测试</span>
                      <span
                        className={`text-sm font-medium ${enterprise.features.discTest ? "text-green-600" : "text-gray-400"}`}
                      >
                        {enterprise.features.discTest ? "已启用" : "已禁用"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">团队分析</span>
                      <span
                        className={`text-sm font-medium ${enterprise.features.teamAnalysis ? "text-green-600" : "text-gray-400"}`}
                      >
                        {enterprise.features.teamAnalysis ? "已启用" : "已禁用"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">简历分析</span>
                      <span
                        className={`text-sm font-medium ${enterprise.features.resumeAnalysis ? "text-green-600" : "text-gray-400"}`}
                      >
                        {enterprise.features.resumeAnalysis ? "已启用" : "已禁用"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 标签页内容 */}
        <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              企业成员
            </TabsTrigger>
            <TabsTrigger value="tests">
              <FileText className="h-4 w-4 mr-2" />
              测试记录
            </TabsTrigger>
            <TabsTrigger value="finance">
              <CreditCard className="h-4 w-4 mr-2" />
              财务记录
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>企业成员管理</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="搜索成员"
                        className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <CardDescription>管理企业成员和测试状态</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          成员信息
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          部门
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          职位
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          测试次数
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                            {searchTerm ? "未找到匹配的成员" : "暂无企业成员数据"}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user: any) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  {user.name.charAt(0)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-xs text-gray-500">ID: {user.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.department}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.position}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.testCount}次</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button variant="link" className="text-purple-600 hover:text-purple-900">
                                查看详情
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>测试记录</CardTitle>
                <CardDescription>查看企业所有测试记录和消费情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          测试ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          用户
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          测试类型
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          测试时间
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          消费金额
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enterprise.testRecords.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                            暂无测试记录
                          </td>
                        </tr>
                      ) : (
                        enterprise.testRecords.map((record: any) => (
                          <tr key={record.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{record.id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{record.userName}</div>
                              <div className="text-xs text-gray-500">ID: {record.userId}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{record.testType}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{record.date}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">¥{record.cost}</div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">测试消费统计</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-3 border rounded-lg bg-white">
                      <div className="text-sm font-medium text-gray-500 mb-1">人脸测试</div>
                      <div className="text-xl font-bold">
                        ¥{enterprise.testRecords.filter((r: any) => r.testType === "人脸测试").length}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {enterprise.testRecords.filter((r: any) => r.testType === "人脸测试").length}次 × ¥1/次
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg bg-white">
                      <div className="text-sm font-medium text-gray-500 mb-1">MBTI测试</div>
                      <div className="text-xl font-bold">
                        ¥{enterprise.testRecords.filter((r: any) => r.testType === "MBTI测试").length * 3}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {enterprise.testRecords.filter((r: any) => r.testType === "MBTI测试").length}次 × ¥3/次
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg bg-white">
                      <div className="text-sm font-medium text-gray-500 mb-1">PDP测试</div>
                      <div className="text-xl font-bold">
                        ¥{enterprise.testRecords.filter((r: any) => r.testType === "PDP测试").length * 3}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {enterprise.testRecords.filter((r: any) => r.testType === "PDP测试").length}次 × ¥3/次
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg bg-white">
                      <div className="text-sm font-medium text-gray-500 mb-1">DISC测试</div>
                      <div className="text-xl font-bold">
                        ¥{enterprise.testRecords.filter((r: any) => r.testType === "DISC测试").length * 3}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {enterprise.testRecords.filter((r: any) => r.testType === "DISC测试").length}次 × ¥3/次
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>财务记录</CardTitle>
                <CardDescription>查看企业充值和消费记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm font-medium text-gray-500 mb-1">总充值金额</div>
                    <div className="text-2xl font-bold">
                      ¥{(enterprise.balance + enterprise.usedTests * 50).toLocaleString()}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">包含当前余额和已消费金额</div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm font-medium text-gray-500 mb-1">已消费金额</div>
                    <div className="text-2xl font-bold">¥{(enterprise.usedTests * 50).toLocaleString()}</div>
                    <div className="mt-2 text-xs text-gray-500">共{enterprise.usedTests}次测试</div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm font-medium text-gray-500 mb-1">当前余额</div>
                    <div className="text-2xl font-bold">¥{enterprise.balance.toLocaleString()}</div>
                    <div className="mt-2 text-xs text-gray-500">可用测试次数: {enterprise.remainingTests}次</div>
                  </div>
                </div>

                <div className="border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          交易ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          交易类型
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          金额
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          交易时间
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          备注
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">TRX-001</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-green-600 font-medium">充值</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">+¥19,800</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">2025-01-15</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">首次充值</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">TRX-002</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-red-600 font-medium">消费</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">-¥2,100</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">2025-02-10</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">42次测试</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 编辑企业信息对话框 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>编辑企业信息</DialogTitle>
            <DialogDescription>修改企业基本信息和功能配置</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">企业名称</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="输入企业名称"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-contact">联系人</Label>
              <Input
                id="edit-contact"
                value={editForm.contact}
                onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                placeholder="输入联系人姓名"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">联系电话</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                placeholder="输入联系电话"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">电子邮箱</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="输入电子邮箱"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-license">营业执照号</Label>
              <Input
                id="edit-license"
                value={editForm.licenseNumber}
                onChange={(e) => setEditForm({ ...editForm, licenseNumber: e.target.value })}
                placeholder="输入营业执照号"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">企业地址</Label>
              <Input
                id="edit-address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                placeholder="输入企业地址"
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3">功能配置</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="feature-face" className="cursor-pointer">
                    人脸测试
                  </Label>
                  <Switch
                    id="feature-face"
                    checked={features.faceAnalysis}
                    onCheckedChange={(checked) => setFeatures({ ...features, faceAnalysis: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="feature-mbti" className="cursor-pointer">
                    MBTI测试
                  </Label>
                  <Switch
                    id="feature-mbti"
                    checked={features.mbtiTest}
                    onCheckedChange={(checked) => setFeatures({ ...features, mbtiTest: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="feature-pdp" className="cursor-pointer">
                    PDP测试
                  </Label>
                  <Switch
                    id="feature-pdp"
                    checked={features.pdpTest}
                    onCheckedChange={(checked) => setFeatures({ ...features, pdpTest: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="feature-disc" className="cursor-pointer">
                    DISC测试
                  </Label>
                  <Switch
                    id="feature-disc"
                    checked={features.discTest}
                    onCheckedChange={(checked) => setFeatures({ ...features, discTest: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="feature-team" className="cursor-pointer">
                    团队分析
                  </Label>
                  <Switch
                    id="feature-team"
                    checked={features.teamAnalysis}
                    onCheckedChange={(checked) => setFeatures({ ...features, teamAnalysis: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="feature-resume" className="cursor-pointer">
                    简历分析
                  </Label>
                  <Switch
                    id="feature-resume"
                    checked={features.resumeAnalysis}
                    onCheckedChange={(checked) => setFeatures({ ...features, resumeAnalysis: checked })}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSaveEnterprise}>
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
