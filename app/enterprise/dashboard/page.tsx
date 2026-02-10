"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Building,
  Users,
  Settings,
  LogOut,
  Search,
  BarChart,
  FileText,
  Plus,
  Download,
  Upload,
  CreditCard,
  Briefcase,
  ChevronRight,
  Calendar,
  Clock,
  DollarSign,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 模拟企业数据
const mockEnterpriseData = {
  id: "ent-001",
  name: "科技创新有限公司",
  contact: "张经理",
  phone: "13800138001",
  email: "zhang@example.com",
  balance: 19800,
  usedTests: 42,
  remainingTests: 354,
  createdAt: "2025-01-15",
  users: [
    {
      id: "u001",
      name: "李明",
      department: "技术部",
      position: "开发工程师",
      testCount: 3,
      hasResume: true,
      resumeUpdated: "2025-03-15",
    },
    {
      id: "u002",
      name: "王芳",
      department: "市场部",
      position: "市场经理",
      testCount: 2,
      hasResume: true,
      resumeUpdated: "2025-03-20",
    },
    {
      id: "u003",
      name: "张伟",
      department: "人事部",
      position: "HR主管",
      testCount: 5,
      hasResume: true,
      resumeUpdated: "2025-04-01",
    },
    {
      id: "u004",
      name: "刘洋",
      department: "销售部",
      position: "销售总监",
      testCount: 1,
      hasResume: false,
      resumeUpdated: "",
    },
    {
      id: "u005",
      name: "陈晓",
      department: "财务部",
      position: "财务经理",
      testCount: 0,
      hasResume: false,
      resumeUpdated: "",
    },
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
  pricingConfig: {
    faceTest: 1,
    mbtiTest: 3,
    pdpTest: 3,
    discTest: 3,
    fullReport: 10,
    teamAnalysis: 50,
  },
}

export default function EnterpriseDashboardPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [enterprise, setEnterprise] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showRechargeDialog, setShowRechargeDialog] = useState(false)
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [showPricingDialog, setShowPricingDialog] = useState(false)
  const [rechargeAmount, setRechargeAmount] = useState("500")
  const [rechargeLoading, setRechargeLoading] = useState(false)
  const [rechargeError, setRechargeError] = useState("")
  const [rechargeSuccess, setRechargeSuccess] = useState("")
  const [pricingConfig, setPricingConfig] = useState({
    faceTest: 1,
    mbtiTest: 3,
    pdpTest: 3,
    discTest: 3,
    fullReport: 10,
    teamAnalysis: 50,
  })
  const [newUser, setNewUser] = useState({
    name: "",
    department: "",
    position: "",
    email: "",
  })
  const [activeTab, setActiveTab] = useState("users")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem("enterpriseToken")
    const enterpriseId = localStorage.getItem("enterpriseId")

    if (!token || !enterpriseId) {
      router.push("/enterprise/login")
    } else {
      setIsLoggedIn(true)
      loadEnterpriseData(enterpriseId)
    }
  }, [router])

  // 加载企业数据
  const loadEnterpriseData = async (enterpriseId: string) => {
    setLoading(true)

    try {
      // 在实际应用中，这里应该调用API获取企业数据
      // const response = await getEnterpriseAccount(enterpriseId);
      // if (response.success) {
      //   setEnterprise(response.data);
      // }

      // 使用模拟数据
      setEnterprise(mockEnterpriseData)
      setPricingConfig(mockEnterpriseData.pricingConfig)
    } catch (error) {
      console.error("加载企业数据失败:", error)
    } finally {
      setLoading(false)
    }
  }

  // 过滤用户列表
  const filteredUsers =
    enterprise?.users.filter((user: any) => {
      // 搜索过滤
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.position.toLowerCase().includes(searchTerm.toLowerCase())

      // 部门过滤
      const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter

      return matchesSearch && matchesDepartment
    }) || []

  // 获取所有部门列表
  const departments = enterprise?.users ? [...new Set(enterprise.users.map((user: any) => user.department))] : []

  // 处理充值
  const handleRecharge = async () => {
    setRechargeLoading(true)
    setRechargeError("")
    setRechargeSuccess("")

    try {
      // 模拟充值成功
      const amount = Number(rechargeAmount)
      const testCount = Math.floor(amount / 50) // 每500元10次，即每次50元

      setEnterprise({
        ...enterprise,
        balance: enterprise.balance + amount,
        remainingTests: enterprise.remainingTests + testCount,
      })

      setRechargeSuccess(`充值成功，增加${testCount}次测试额度`)
      setTimeout(() => {
        setShowRechargeDialog(false)
        setRechargeSuccess("")
        setRechargeAmount("500")
      }, 1500)
    } catch (error) {
      setRechargeError("充值失败，请稍后重试")
      console.error("充值错误:", error)
    } finally {
      setRechargeLoading(false)
    }
  }

  // 处理添加用户
  const handleAddUser = () => {
    const newUserId = `u${enterprise.users.length + 1}`.padStart(4, "0")
    const userToAdd = {
      id: newUserId,
      name: newUser.name,
      department: newUser.department,
      position: newUser.position,
      email: newUser.email,
      testCount: 0,
      hasResume: false,
      resumeUpdated: "",
    }

    setEnterprise({
      ...enterprise,
      users: [...enterprise.users, userToAdd],
    })

    setNewUser({
      name: "",
      department: "",
      position: "",
      email: "",
    })

    setShowAddUserDialog(false)
  }

  // 保存价格配置
  const handleSavePricing = () => {
    setEnterprise({
      ...enterprise,
      pricingConfig: pricingConfig,
    })
    setShowPricingDialog(false)
  }

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem("enterpriseToken")
    localStorage.removeItem("enterpriseId")
    localStorage.removeItem("enterpriseName")
    router.push("/enterprise/login")
  }

  if (!isLoggedIn || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">加载企业数据中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Building className="h-6 w-6 text-purple-600 mr-2" />
            <h1 className="text-xl font-bold">企业管理平台 - {enterprise.name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/")}>
              返回主页
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              退出登录
            </Button>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 账户概览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">账户余额</p>
                  <p className="text-3xl font-bold">¥{enterprise.balance.toLocaleString()}</p>
                  <div className="mt-2 flex items-center">
                    <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-gray-600">充足</span>
                  </div>
                </div>
                <Button size="sm" onClick={() => setShowRechargeDialog(true)}>
                  充值
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">测试额度</p>
                  <p className="text-3xl font-bold">{enterprise.remainingTests}次</p>
                  <div className="mt-2 flex items-center">
                    <Clock className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-gray-600">剩余额度</span>
                  </div>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">企业成员</p>
                  <p className="text-3xl font-bold">{enterprise.users.length}人</p>
                  <div className="mt-2 flex items-center">
                    <Users className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-gray-600">
                      已测试: {enterprise.users.filter((u: any) => u.testCount > 0).length}人
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setShowAddUserDialog(true)}>
                  添加
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-amber-600 mb-1">简历分析</p>
                  <p className="text-3xl font-bold">{enterprise.users.filter((u: any) => u.hasResume).length}份</p>
                  <div className="mt-2 flex items-center">
                    <Calendar className="h-4 w-4 text-amber-500 mr-1" />
                    <span className="text-sm text-gray-600">最近更新: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="p-2 bg-amber-100 rounded-full">
                  <Briefcase className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 标签页内容 */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              成员管理
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              测试记录
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart className="h-4 w-4 mr-2" />
              数据分析
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              账户设置
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader className="pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>企业成员管理</CardTitle>
                    <CardDescription>管理企业成员和测试状态</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <input
                          type="text"
                          placeholder="搜索成员"
                          className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md w-full"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="选择部门" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">所有部门</SelectItem>
                          {departments.map((dept: string) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={() => setShowAddUserDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      添加成员
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          成员信息
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          部门/职位
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          测试状态
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          简历状态
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
                            {searchTerm || departmentFilter !== "all" ? "未找到匹配的成员" : "暂无企业成员数据"}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user: any) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                                  <span className="text-purple-600 font-medium">{user.name.charAt(0)}</span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-xs text-gray-500">ID: {user.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.department}</div>
                              <div className="text-xs text-gray-500">{user.position}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {user.testCount > 0 ? (
                                <div>
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    已完成 {user.testCount} 次测试
                                  </Badge>
                                </div>
                              ) : (
                                <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                                  未测试
                                </Badge>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {user.hasResume ? (
                                <div className="flex flex-col">
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mb-1">
                                    已上传
                                  </Badge>
                                  <span className="text-xs text-gray-500">更新: {user.resumeUpdated}</span>
                                </div>
                              ) : (
                                <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                                  未上传
                                </Badge>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-purple-600 hover:text-purple-900"
                                onClick={() => router.push(`/enterprise/user/${user.id}`)}
                              >
                                查看详情
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      批量导入
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      导出成员
                    </Button>
                  </div>
                  <div className="text-sm text-gray-500">
                    共 {filteredUsers.length} 名成员
                    {departmentFilter !== "all" && ` (${departmentFilter}部门)`}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>测试记录</CardTitle>
                    <CardDescription>查看企业所有测试记录和消费情况</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowPricingDialog(true)}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    测试收费配置
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
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
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enterprise.testRecords.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                            暂无测试记录
                          </td>
                        </tr>
                      ) : (
                        enterprise.testRecords.map((record: any) => (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{record.id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{record.userName}</div>
                              <div className="text-xs text-gray-500">ID: {record.userId}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                variant="outline"
                                className={
                                  record.testType === "人脸测试"
                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                    : record.testType === "MBTI测试"
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : record.testType === "PDP测试"
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                }
                              >
                                {record.testType}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{record.date}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">¥{record.cost}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-purple-600 hover:text-purple-900"
                                onClick={() => router.push(`/enterprise/test/${record.id}`)}
                              >
                                查看报告
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-800 mb-3">测试消费统计</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                          <span>人脸测试</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">
                            {enterprise.testRecords.filter((r: any) => r.testType === "人脸测试").length}次
                          </span>
                          <span className="font-medium">
                            ¥
                            {enterprise.testRecords.filter((r: any) => r.testType === "人脸测试").length *
                              pricingConfig.faceTest}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          <span>MBTI测试</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">
                            {enterprise.testRecords.filter((r: any) => r.testType === "MBTI测试").length}次
                          </span>
                          <span className="font-medium">
                            ¥
                            {enterprise.testRecords.filter((r: any) => r.testType === "MBTI测试").length *
                              pricingConfig.mbtiTest}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span>PDP测试</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">
                            {enterprise.testRecords.filter((r: any) => r.testType === "PDP测试").length}次
                          </span>
                          <span className="font-medium">
                            ¥
                            {enterprise.testRecords.filter((r: any) => r.testType === "PDP测试").length *
                              pricingConfig.pdpTest}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                          <span>DISC测试</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">
                            {enterprise.testRecords.filter((r: any) => r.testType === "DISC测试").length}次
                          </span>
                          <span className="font-medium">
                            ¥
                            {enterprise.testRecords.filter((r: any) => r.testType === "DISC测试").length *
                              pricingConfig.discTest}
                          </span>
                        </div>
                      </div>
                      <div className="pt-2 border-t mt-2">
                        <div className="flex justify-between items-center font-medium">
                          <span>总计</span>
                          <span>¥{enterprise.testRecords.reduce((sum: number, r: any) => sum + r.cost, 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-800 mb-3">测试趋势</h3>
                    <div className="h-40 flex items-end justify-between px-2">
                      {["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((day, index) => (
                        <div key={day} className="flex flex-col items-center">
                          <div
                            className="bg-purple-500 w-8 rounded-t-md"
                            style={{
                              height: `${Math.max(10, Math.random() * 100)}px`,
                              opacity: index === 3 ? 1 : 0.7,
                            }}
                          ></div>
                          <div className="text-xs mt-2 text-gray-600">{day}</div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-4">本周测试数据趋势</div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    导出记录
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>数据分析</CardTitle>
                    <CardDescription>查看企业测试数据分析和团队洞察</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    导出分析报告
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-medium text-gray-800 mb-4">团队性格分布</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-sm font-medium mb-3">MBTI类型分布</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            {
                              type: "分析家族",
                              types: ["INTJ", "INTP", "ENTJ", "ENTP"],
                              count: 7,
                              color: "bg-blue-500",
                            },
                            {
                              type: "外交家族",
                              types: ["INFJ", "INFP", "ENFJ", "ENFP"],
                              count: 4,
                              color: "bg-green-500",
                            },
                            {
                              type: "哨兵家族",
                              types: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
                              count: 7,
                              color: "bg-amber-500",
                            },
                            {
                              type: "探险家族",
                              types: ["ISTP", "ISFP", "ESTP", "ESFP"],
                              count: 2,
                              color: "bg-purple-500",
                            },
                          ].map((group) => (
                            <div key={group.type} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-sm">{group.type}</span>
                                <span className="text-xs text-gray-500">{Math.round((group.count / 20) * 100)}%</span>
                              </div>
                              <div className="text-xs text-gray-600 mb-2">{group.types.join(", ")}</div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className={`${group.color} h-1.5 rounded-full`}
                                  style={{ width: `${(group.count / 20) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-3">PDP类型分布</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { type: "老虎", count: 8, color: "bg-red-500" },
                            { type: "孔雀", count: 5, color: "bg-blue-500" },
                            { type: "无尾熊", count: 3, color: "bg-green-500" },
                            { type: "猫头鹰", count: 4, color: "bg-amber-500" },
                          ].map((animal) => (
                            <div key={animal.type} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-sm">{animal.type}</span>
                                <span className="text-xs text-gray-500">{Math.round((animal.count / 20) * 100)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                <div
                                  className={`${animal.color} h-1.5 rounded-full`}
                                  style={{ width: `${(animal.count / 20) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <h4 className="text-sm font-medium mt-6 mb-3">DISC类型分布</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { type: "D型(支配型)", count: 6, color: "bg-red-500" },
                            { type: "I型(影响型)", count: 5, color: "bg-yellow-500" },
                            { type: "S型(稳定型)", count: 4, color: "bg-green-500" },
                            { type: "C型(服从型)", count: 5, color: "bg-blue-500" },
                          ].map((disc) => (
                            <div key={disc.type} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-sm">{disc.type}</span>
                                <span className="text-xs text-gray-500">{Math.round((disc.count / 20) * 100)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                <div
                                  className={`${disc.color} h-1.5 rounded-full`}
                                  style={{ width: `${(disc.count / 20) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-medium text-gray-800 mb-4">团队优势与挑战</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-green-600">团队优势</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                            <span>
                              <strong>决策能力强</strong>：团队中思考型(T)和判断型(J)成员占比高，有利于快速决策和执行
                            </span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                            <span>
                              <strong>创新思维</strong>：直觉型(N)成员占比高，团队更善于发现模式和创新解决方案
                            </span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                            <span>
                              <strong>平衡的内外向</strong>：内向(I)和外向(E)成员比例接近，有利于内部思考和外部沟通
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-red-600">潜在挑战</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2"></div>
                            <span>
                              <strong>情感考虑不足</strong>：情感型(F)成员较少，可能在决策中忽略人际因素和团队和谐
                            </span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2"></div>
                            <span>
                              <strong>灵活性不足</strong>：感知型(P)成员较少，团队可能在面对变化时适应性不足
                            </span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2"></div>
                            <span>
                              <strong>细节关注不足</strong>：感觉型(S)成员较少，可能在执行过程中忽略重要细节
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-medium text-gray-800 mb-4">团队岗位匹配度</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {[
                        { role: "产品经理", match: 85, ideal: ["ENTJ", "INTJ", "老虎", "猫头鹰"] },
                        { role: "UI/UX设计", match: 70, ideal: ["INFJ", "ENFP", "孔雀", "变色龙"] },
                        { role: "开发工程师", match: 90, ideal: ["INTJ", "INTP", "猫头鹰", "老虎"] },
                        { role: "市场营销", match: 75, ideal: ["ENFJ", "ESFJ", "孔雀", "老虎"] },
                        { role: "客户服务", match: 65, ideal: ["ISFJ", "ESFJ", "无尾熊", "孔雀"] },
                      ].map((position) => (
                        <div key={position.role} className="p-4 border rounded-lg">
                          <div className="font-medium mb-2">{position.role}</div>
                          <div className="flex items-center mb-2">
                            <span className="text-sm mr-2">匹配度:</span>
                            <span
                              className={`font-bold ${
                                position.match >= 80
                                  ? "text-green-600"
                                  : position.match >= 70
                                    ? "text-blue-600"
                                    : "text-amber-600"
                              }`}
                            >
                              {position.match}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                            <div
                              className={`h-1.5 rounded-full ${
                                position.match >= 80
                                  ? "bg-green-500"
                                  : position.match >= 70
                                    ? "bg-blue-500"
                                    : "bg-amber-500"
                              }`}
                              style={{ width: `${position.match}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">理想类型: {position.ideal.join(", ")}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      导出完整分析报告
                    </Button>
                    <Button>申请专家团队诊断</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>账户设置</CardTitle>
                <CardDescription>管理企业账户信息和偏好设置</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">基本信息</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-name">企业名称</Label>
                        <Input id="company-name" defaultValue={enterprise.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-person">联系人</Label>
                        <Input id="contact-person" defaultValue={enterprise.contact} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone">联系电话</Label>
                        <Input id="contact-phone" defaultValue={enterprise.phone} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">电子邮箱</Label>
                        <Input id="contact-email" type="email" defaultValue={enterprise.email} />
                      </div>
                    </div>
                    <Button className="mt-4">保存信息</Button>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">安全设置</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">当前密码</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">新密码</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">确认新密码</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                    <Button className="mt-4">修改密码</Button>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">账单与发票</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="invoice-title">发票抬头</Label>
                        <Input id="invoice-title" defaultValue={enterprise.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tax-number">税号</Label>
                        <Input id="tax-number" placeholder="请输入企业税号" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="invoice-email">发票接收邮箱</Label>
                        <Input id="invoice-email" type="email" defaultValue={enterprise.email} />
                      </div>
                    </div>
                    <Button className="mt-4">保存发票信息</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 充值对话框 */}
      <Dialog open={showRechargeDialog} onOpenChange={setShowRechargeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>企业充值</DialogTitle>
            <DialogDescription>为企业账户充值测试费用</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {rechargeSuccess && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <AlertDescription>{rechargeSuccess}</AlertDescription>
              </Alert>
            )}

            {rechargeError && (
              <Alert variant="destructive">
                <AlertDescription>{rechargeError}</AlertDescription>
              </Alert>
            )}

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">当前余额</span>
                <span className="font-medium">¥{enterprise.balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">剩余测试次数</span>
                <span className="font-medium">{enterprise.remainingTests}次</span>
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
            <Button variant="outline" onClick={() => setShowRechargeDialog(false)} disabled={rechargeLoading}>
              取消
            </Button>
            <Button onClick={handleRecharge} disabled={rechargeLoading}>
              {rechargeLoading ? "处理中..." : "确认充值"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 添加用户对话框 */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>添加企业成员</DialogTitle>
            <DialogDescription>添加新的企业成员信息</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">姓名</Label>
              <Input
                id="user-name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="输入成员姓名"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-department">部门</Label>
              <Input
                id="user-department"
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                placeholder="输入所属部门"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-position">职位</Label>
              <Input
                id="user-position"
                value={newUser.position}
                onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
                placeholder="输入职位"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-email">电子邮箱</Label>
              <Input
                id="user-email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="输入电子邮箱"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
              取消
            </Button>
            <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.department || !newUser.position}>
              添加成员
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 测试收费配置对话框 */}
      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>测试收费配置</DialogTitle>
            <DialogDescription>设置各类测试的收费标准</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="face-test-price">人脸测试价格 (元/次)</Label>
              <Input
                id="face-test-price"
                type="number"
                value={pricingConfig.faceTest}
                onChange={(e) => setPricingConfig({ ...pricingConfig, faceTest: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mbti-test-price">MBTI测试价格 (元/次)</Label>
              <Input
                id="mbti-test-price"
                type="number"
                value={pricingConfig.mbtiTest}
                onChange={(e) => setPricingConfig({ ...pricingConfig, mbtiTest: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pdp-test-price">PDP测试价格 (元/次)</Label>
              <Input
                id="pdp-test-price"
                type="number"
                value={pricingConfig.pdpTest}
                onChange={(e) => setPricingConfig({ ...pricingConfig, pdpTest: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="disc-test-price">DISC测试价格 (元/次)</Label>
              <Input
                id="disc-test-price"
                type="number"
                value={pricingConfig.discTest}
                onChange={(e) => setPricingConfig({ ...pricingConfig, discTest: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full-report-price">完整报告价格 (元/份)</Label>
              <Input
                id="full-report-price"
                type="number"
                value={pricingConfig.fullReport}
                onChange={(e) => setPricingConfig({ ...pricingConfig, fullReport: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-analysis-price">团队分析价格 (元/次)</Label>
              <Input
                id="team-analysis-price"
                type="number"
                value={pricingConfig.teamAnalysis}
                onChange={(e) => setPricingConfig({ ...pricingConfig, teamAnalysis: Number(e.target.value) })}
                min="1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPricingDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSavePricing}>保存配置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
