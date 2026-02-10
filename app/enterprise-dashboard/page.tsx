"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, FileText, BarChart, Settings, User, Upload, Search, Check } from "lucide-react"

export default function EnterpriseDashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [enterpriseData, setEnterpriseData] = useState({
    name: "示例科技有限公司",
    plan: "团队成长版",
    memberCount: 24,
    usedQuota: 18,
    totalQuota: 30,
    expiryDate: "2026-05-01",
  })

  useEffect(() => {
    // 模拟加载数据
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">加载企业数据中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold ml-2">企业管理后台</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">{enterpriseData.name}</span>
              <span className="mx-2">|</span>
              <span>{enterpriseData.plan}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push("/enterprise-settings")}>
              <Settings className="h-4 w-4 mr-2" />
              设置
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">团队成员</p>
                  <h3 className="text-2xl font-bold mt-1">{enterpriseData.memberCount}人</h3>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: `${(enterpriseData.memberCount / enterpriseData.totalQuota) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  已使用 {enterpriseData.memberCount}/{enterpriseData.totalQuota} 人
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">测试完成率</p>
                  <h3 className="text-2xl font-bold mt-1">75%</h3>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "75%" }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">18人已完成 / 24人总数</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">服务有效期</p>
                  <h3 className="text-2xl font-bold mt-1">365天</h3>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-700">到期日期: {enterpriseData.expiryDate}</p>
                <Button variant="link" className="p-0 h-auto text-sm mt-1">
                  续费服务
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="members" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              团队成员
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              测试报告
            </TabsTrigger>
            <TabsTrigger value="recruitment" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              招聘管理
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center">
              <BarChart className="w-4 h-4 mr-2" />
              团队分析
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>团队成员管理</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="搜索成员"
                        className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md w-64"
                      />
                    </div>
                    <Button>
                      <User className="h-4 w-4 mr-2" />
                      添加成员
                    </Button>
                  </div>
                </div>
                <CardDescription>管理团队成员和测试状态</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          姓名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          部门
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          职位
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          测试状态
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          MBTI
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        {
                          name: "张三",
                          department: "产品部",
                          position: "产品经理",
                          status: "已完成",
                          mbti: "ENTJ",
                        },
                        {
                          name: "李四",
                          department: "技术部",
                          position: "前端开发",
                          status: "已完成",
                          mbti: "INTP",
                        },
                        {
                          name: "王五",
                          department: "设计部",
                          position: "UI设计师",
                          status: "进行中",
                          mbti: "-",
                        },
                        {
                          name: "赵六",
                          department: "市场部",
                          position: "市场经理",
                          status: "未开始",
                          mbti: "-",
                        },
                        {
                          name: "钱七",
                          department: "销售部",
                          position: "销售总监",
                          status: "已完成",
                          mbti: "ESFJ",
                        },
                      ].map((member, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                {member.name.charAt(0)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{member.department}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{member.position}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                member.status === "已完成"
                                  ? "bg-green-100 text-green-800"
                                  : member.status === "进行中"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {member.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{member.mbti}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="link" className="text-purple-600 hover:text-purple-900">
                              查看
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>测试报告</CardTitle>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    导出报告
                  </Button>
                </div>
                <CardDescription>查看团队成员的测试报告</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Card key={item} className="overflow-hidden">
                      <div className="h-2 bg-purple-600"></div>
                      <CardContent className="p-4">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">测试报告 #{item}</h4>
                            <p className="text-xs text-gray-500">完成于 2025-05-0{item}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">MBTI类型:</span>
                            <span className="font-medium">
                              {["ENTJ", "INTP", "ISFP", "ESFJ", "INTJ", "ENFP"][item - 1]}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">PDP类型:</span>
                            <span className="font-medium">
                              {["老虎", "孔雀", "考拉", "猫头鹰", "变色龙", "狮子"][item - 1]}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">DISC类型:</span>
                            <span className="font-medium">
                              {["D主导", "I影响", "S稳健", "C严谨", "DI", "SC"][item - 1]}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full mt-4 text-sm">
                          查看详情
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recruitment">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>招聘管理</CardTitle>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    上传简历
                  </Button>
                </div>
                <CardDescription>管理候选人简历和面试评估</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          候选人
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          应聘职位
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          测试状态
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          匹配度
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          面试时间
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        {
                          name: "陈一",
                          position: "产品经理",
                          status: "已完成",
                          match: "85%",
                          interview: "2025-05-10 14:00",
                        },
                        {
                          name: "林二",
                          position: "前端开发",
                          status: "已完成",
                          match: "92%",
                          interview: "2025-05-11 10:00",
                        },
                        {
                          name: "黄三",
                          position: "UI设计师",
                          status: "未开始",
                          match: "-",
                          interview: "待定",
                        },
                        {
                          name: "刘四",
                          position: "后端开发",
                          status: "已完成",
                          match: "78%",
                          interview: "2025-05-12 15:30",
                        },
                      ].map((candidate, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                {candidate.name.charAt(0)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                                <div className="text-sm text-gray-500">candidate{index + 1}@example.com</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{candidate.position}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                candidate.status === "已完成"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {candidate.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {candidate.match !== "-" ? (
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                                  <div
                                    className="bg-green-600 h-2.5 rounded-full"
                                    style={{ width: candidate.match }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-900">{candidate.match}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{candidate.interview}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="link" className="text-purple-600 hover:text-purple-900">
                              查看分析
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>团队分析</CardTitle>
                  <Button>
                    <BarChart className="h-4 w-4 mr-2" />
                    生成报告
                  </Button>
                </div>
                <CardDescription>查看团队整体分析和优化建议</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-3">MBTI类型分布</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-3 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">分析型(NT)</span>
                            <span className="text-sm text-gray-500">40%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">外交型(NF)</span>
                            <span className="text-sm text-gray-500">25%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">管理型(SJ)</span>
                            <span className="text-sm text-gray-500">20%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">探索型(SP)</span>
                            <span className="text-sm text-gray-500">15%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-red-600 h-2 rounded-full" style={{ width: "15%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-3">DISC行为风格分布</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-3 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">D (主导型)</span>
                            <span className="text-sm text-gray-500">30%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-red-600 h-2 rounded-full" style={{ width: "30%" }}></div>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">I (影响型)</span>
                            <span className="text-sm text-gray-500">25%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">S (稳健型)</span>
                            <span className="text-sm text-gray-500">20%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">C (严谨型)</span>
                            <span className="text-sm text-gray-500">25%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-3">团队优势与潜在风险</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-md border-l-4 border-green-500">
                        <h4 className="font-medium text-green-700 mb-2">团队优势</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                              <Check className="h-3 w-3 text-green-600" />
                            </div>
                            <span>分析型人才比例高，擅长解决复杂问题</span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                              <Check className="h-3 w-3 text-green-600" />
                            </div>
                            <span>主导型与影响型人才平衡，决策与沟通能力强</span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                              <Check className="h-3 w-3 text-green-600" />
                            </div>
                            <span>团队成员性格互补，覆盖多种工作风格</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-md border-l-4 border-red-500">
                        <h4 className="font-medium text-red-700 mb-2">潜在风险</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-2">
                              <span className="text-red-600 text-xs">!</span>
                            </div>
                            <span>稳健型(S)人才比例较低，可能影响项目执行稳定性</span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-2">
                              <span className="text-red-600 text-xs">!</span>
                            </div>
                            <span>主导型(D)人才较多，可能导致团队内部竞争与冲突</span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-2">
                              <span className="text-red-600 text-xs">!</span>
                            </div>
                            <span>探索型(SP)人才比例低，创新能力可能受限</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <h3 className="font-medium text-gray-800 mb-3">团队优化建议</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <span className="text-purple-600 font-medium">1</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">增加稳健型(S)人才</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            在项目执行团队中引入更多稳健型人才，提高团队执行力和稳定性
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <span className="text-purple-600 font-medium">2</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">优化沟通机制</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            针对不同性格类型设计差异化沟通策略，减少主导型人才之间的冲突
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <span className="text-purple-600 font-medium">3</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">创新团队组合</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            组建跨部门创新小组，确保每个小组包含不同性格类型的成员，提升创新能力
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full mt-4">获取详细优化方案</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
