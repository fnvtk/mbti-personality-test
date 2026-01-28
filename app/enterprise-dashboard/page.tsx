"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, Users, FileText, BarChart3, Settings, User, 
  Upload, Search, Check, Plus, Download, Calendar, TrendingUp,
  AlertTriangle, ChevronRight, Building2
} from "lucide-react"
import { cn } from "@/lib/utils"

// 模拟数据
const mockMembers = [
  { id: 1, name: "张三", department: "产品部", position: "产品经理", status: "已完成", mbti: "ENTJ", avatar: "张" },
  { id: 2, name: "李四", department: "技术部", position: "前端开发", status: "已完成", mbti: "INTP", avatar: "李" },
  { id: 3, name: "王五", department: "设计部", position: "UI设计师", status: "进行中", mbti: "-", avatar: "王" },
  { id: 4, name: "赵六", department: "市场部", position: "市场经理", status: "未开始", mbti: "-", avatar: "赵" },
  { id: 5, name: "钱七", department: "销售部", position: "销售总监", status: "已完成", mbti: "ESFJ", avatar: "钱" },
]

const mockCandidates = [
  { id: 1, name: "陈一", position: "产品经理", status: "已完成", match: 85, interview: "2026-02-10 14:00" },
  { id: 2, name: "林二", position: "前端开发", status: "已完成", match: 92, interview: "2026-02-11 10:00" },
  { id: 3, name: "黄三", position: "UI设计师", status: "未开始", match: 0, interview: "待定" },
  { id: 4, name: "刘四", position: "后端开发", status: "已完成", match: 78, interview: "2026-02-12 15:30" },
]

export default function EnterpriseDashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [enterpriseData] = useState({
    name: "示例科技有限公司",
    plan: "团队成长版",
    memberCount: 24,
    usedQuota: 18,
    totalQuota: 30,
    expiryDate: "2026-12-01",
    daysRemaining: 307,
  })

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // 筛选成员
  const filteredMembers = mockMembers.filter(member => 
    member.name.includes(searchTerm) || 
    member.department.includes(searchTerm) ||
    member.position.includes(searchTerm)
  )

  // MBTI分布统计
  const mbtiDistribution = [
    { type: "分析型(NT)", percentage: 40, color: "bg-blue-500" },
    { type: "外交型(NF)", percentage: 25, color: "bg-green-500" },
    { type: "管理型(SJ)", percentage: 20, color: "bg-amber-500" },
    { type: "探索型(SP)", percentage: 15, color: "bg-rose-500" },
  ]

  // DISC分布统计
  const discDistribution = [
    { type: "D (主导型)", percentage: 30, color: "bg-red-500" },
    { type: "I (影响型)", percentage: 25, color: "bg-yellow-500" },
    { type: "S (稳健型)", percentage: 20, color: "bg-green-500" },
    { type: "C (严谨型)", percentage: 25, color: "bg-blue-500" },
  ]

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto min-h-screen flex items-center justify-center bg-enterprise-gradient">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto" />
          <p className="mt-4 text-gray-600">加载企业数据中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen bg-enterprise-gradient">
      {/* 顶部导航 */}
      <header className="glass-nav sticky top-0 z-40 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">企业管理后台</h1>
              <p className="text-xs text-gray-500">{enterpriseData.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
              {enterpriseData.plan}
            </span>
            <Button variant="outline" size="sm" onClick={() => router.push("/enterprise/settings")}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* 数据概览卡片 */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">团队成员</p>
                  <h3 className="text-2xl font-bold text-gray-800">{enterpriseData.memberCount}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(enterpriseData.memberCount / enterpriseData.totalQuota) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {enterpriseData.memberCount}/{enterpriseData.totalQuota}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">完成率</p>
                  <h3 className="text-2xl font-bold text-gray-800">75%</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "75%" }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">18/24 已完成</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">剩余天数</p>
                  <h3 className="text-2xl font-bold text-gray-800">{enterpriseData.daysRemaining}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                到期: {enterpriseData.expiryDate}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 标签页内容 */}
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4 h-auto p-1 bg-white/50">
            <TabsTrigger value="members" className="text-xs py-2 data-[state=active]:bg-white">
              <Users className="w-4 h-4 mr-1" />
              成员
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-xs py-2 data-[state=active]:bg-white">
              <FileText className="w-4 h-4 mr-1" />
              报告
            </TabsTrigger>
            <TabsTrigger value="recruitment" className="text-xs py-2 data-[state=active]:bg-white">
              <User className="w-4 h-4 mr-1" />
              招聘
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs py-2 data-[state=active]:bg-white">
              <BarChart3 className="w-4 h-4 mr-1" />
              分析
            </TabsTrigger>
          </TabsList>

          {/* 团队成员 */}
          <TabsContent value="members">
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="text-base">团队成员管理</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative flex-1 sm:w-48">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="搜索成员..."
                        className="pl-8 h-9 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button size="sm" className="gradient-enterprise text-white">
                      <Plus className="h-4 w-4 mr-1" />
                      添加
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredMembers.map((member) => (
                    <div 
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-all duration-200 cursor-pointer"
                      onClick={() => router.push(`/enterprise/user/${member.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.department} · {member.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-2 py-0.5 text-xs font-medium rounded-full",
                          member.status === "已完成" && "bg-green-100 text-green-700",
                          member.status === "进行中" && "bg-amber-100 text-amber-700",
                          member.status === "未开始" && "bg-gray-100 text-gray-500"
                        )}>
                          {member.status}
                        </span>
                        {member.mbti !== "-" && (
                          <span className="text-sm font-medium text-purple-600">{member.mbti}</span>
                        )}
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 测试报告 */}
          <TabsContent value="reports">
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">测试报告</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    导出
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Card key={item} className="overflow-hidden bg-white/50 hover:bg-white/80 transition-all cursor-pointer">
                      <div className="h-1.5 gradient-enterprise" />
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">成员 {item}</p>
                            <p className="text-xs text-gray-400">2026-01-{10 + item}</p>
                          </div>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">MBTI:</span>
                            <span className="font-medium">
                              {["ENTJ", "INTP", "ISFP", "ESFJ", "INTJ", "ENFP"][item - 1]}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">置信度:</span>
                            <span className="font-medium">{70 + item * 3}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 招聘管理 */}
          <TabsContent value="recruitment">
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">招聘管理</CardTitle>
                  <Button size="sm" className="gradient-enterprise text-white">
                    <Upload className="h-4 w-4 mr-1" />
                    上传简历
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockCandidates.map((candidate) => (
                    <div 
                      key={candidate.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {candidate.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{candidate.name}</p>
                          <p className="text-xs text-gray-500">应聘: {candidate.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {candidate.match > 0 ? (
                          <div className="flex items-center gap-1">
                            <div className="w-12 bg-gray-100 rounded-full h-1.5">
                              <div
                                className={cn(
                                  "h-1.5 rounded-full",
                                  candidate.match >= 80 ? "bg-green-500" : "bg-amber-500"
                                )}
                                style={{ width: `${candidate.match}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600">{candidate.match}%</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">待测试</span>
                        )}
                        <span className={cn(
                          "px-2 py-0.5 text-xs font-medium rounded-full",
                          candidate.status === "已完成" && "bg-green-100 text-green-700",
                          candidate.status === "未开始" && "bg-gray-100 text-gray-500"
                        )}>
                          {candidate.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 团队分析 */}
          <TabsContent value="analysis">
            <div className="space-y-4">
              {/* MBTI分布 */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">MBTI类型分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mbtiDistribution.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{item.type}</span>
                          <span className="font-medium">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className={cn("h-2 rounded-full transition-all duration-500", item.color)}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* DISC分布 */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">DISC行为风格分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {discDistribution.map((item, index) => (
                      <div key={index} className="bg-white/50 p-3 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-600">{item.type}</span>
                          <span className="text-sm font-medium">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className={cn("h-1.5 rounded-full", item.color)}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 团队优化建议 */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                    团队优化建议
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-800">团队优势</p>
                        <p className="text-xs text-green-600 mt-1">
                          分析型人才比例高，擅长解决复杂问题
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-amber-800">需要关注</p>
                        <p className="text-xs text-amber-600 mt-1">
                          稳健型(S)人才比例较低，建议适当引入
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-4 gradient-enterprise text-white">
                    获取详细优化方案
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
