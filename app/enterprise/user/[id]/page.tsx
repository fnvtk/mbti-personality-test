"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, FileText, BarChart, Mail, Phone, Building, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 模拟用户数据
const mockUserData = {
  id: "u001",
  name: "李明",
  department: "技术部",
  position: "开发工程师",
  email: "liming@example.com",
  phone: "13812345678",
  testCount: 3,
  testResults: [
    {
      id: "result-001",
      type: "mbti",
      date: "2025-04-01",
      result: {
        type: "INTJ",
        title: "建筑师型人格",
        description: "具有独创性的战略性思考者，有远见和驱动力来实现自己的想法。",
        strengths: ["战略思维", "独立性", "决断力", "分析能力", "创新能力"],
        weaknesses: ["可能显得傲慢", "过于批判", "不善表达情感", "不耐烦", "完美主义"],
        dimensions: {
          EI: { result: "I", percentage: 65 },
          SN: { result: "N", percentage: 80 },
          TF: { result: "T", percentage: 75 },
          JP: { result: "J", percentage: 60 },
        },
      },
    },
    {
      id: "result-002",
      type: "pdp",
      date: "2025-04-01",
      result: {
        primary: "猫头鹰",
        secondary: "老虎",
        description: "分析型，精确，注重细节，逻辑思维，系统性，追求完美。辅以行动导向，直接，果断的特质。",
        scores: {
          tiger: 18,
          peacock: 12,
          koala: 10,
          owl: 25,
          chameleon: 15,
        },
      },
    },
    {
      id: "result-003",
      type: "face",
      date: "2025-04-01",
      result: {
        overview: "基于面部特征分析，您展现出内向、善于思考的特质，具有较强的分析能力和专注力。",
        mbti: {
          type: "INTJ",
          title: "建筑师型人格",
          dimensions: {
            energy: "内向(I) - 从内部世界获取能量，喜欢独处和深度思考",
            information: "直觉(N) - 关注可能性和未来，善于发现模式和联系",
            decisions: "思考(T) - 基于逻辑和客观分析做决定，注重效率",
            lifestyle: "判断(J) - 喜欢计划和组织，追求确定性和结构",
          },
        },
        pdp: {
          primary: "猫头鹰",
          secondary: "老虎",
          description: "您的主导型为猫头鹰型，表现为分析型，精确，注重细节；辅助型为老虎型，增添了决断力和行动力。",
        },
        disc: {
          primary: "C型(服从型)",
          secondary: "D型(支配型)",
          description:
            "您的沟通风格以服从型为主，表现为注重细节、追求高标准；辅以支配型特质，增强了决策能力和目标导向。",
        },
        facialExpressions: {
          overall: "整体面部表情显示出专注、冷静，同时带有一定的坚定感。",
          emotions: ["专注", "冷静", "坚定"],
        },
      },
    },
  ],
}

export default function EnterpriseUserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem("enterpriseToken")
    const enterpriseId = localStorage.getItem("enterpriseId")

    if (!token || !enterpriseId) {
      router.push("/enterprise/login")
    } else {
      setIsLoggedIn(true)
      loadUserData(userId)
    }
  }, [router, userId])

  // 加载用户数据
  const loadUserData = async (id: string) => {
    setLoading(true)

    try {
      // 在实际应用中，这里应该调用API获取用户数据
      // const response = await fetch(`/api/enterprise/user/${id}`);
      // const data = await response.json();
      // if (data.success) {
      //   setUser(data.user);
      // }

      // 使用模拟数据
      setUser(mockUserData)
    } catch (error) {
      console.error("加载用户数据失败:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">加载用户数据中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-2">用户不存在</h2>
          <p className="text-gray-500 mb-4">未找到ID为 {userId} 的用户</p>
          <Button onClick={() => router.push("/enterprise/dashboard")}>返回仪表盘</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.push("/enterprise/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold ml-2">用户详情</h1>
        </div>
      </header>

      {/* 主内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* 用户信息卡片 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0 h-24 w-24 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-3xl font-medium">{user.name.charAt(0)}</span>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {user.department}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {user.position}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{user.testCount}</div>
                  <div className="text-sm text-gray-500">测试次数</div>
                </div>
                <Button variant="outline" size="sm">
                  编辑信息
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 标签页内容 */}
        <Tabs defaultValue="results">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="results">
              <FileText className="h-4 w-4 mr-2" />
              测试结果
            </TabsTrigger>
            <TabsTrigger value="analysis">
              <BarChart className="h-4 w-4 mr-2" />
              性格分析
            </TabsTrigger>
            <TabsTrigger value="career">
              <Building className="h-4 w-4 mr-2" />
              职业匹配
            </TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>测试结果</CardTitle>
                <CardDescription>查看用户的所有测试结果</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {user.testResults.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">暂无测试结果</div>
                  ) : (
                    user.testResults.map((result: any) => (
                      <div key={result.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                          <div>
                            <Badge className="mb-1">
                              {result.type === "mbti"
                                ? "MBTI测试"
                                : result.type === "pdp"
                                  ? "PDP测试"
                                  : result.type === "disc"
                                    ? "DISC测试"
                                    : "面相分析"}
                            </Badge>
                            <div className="text-sm text-gray-500">测试日期: {result.date}</div>
                          </div>
                          <Button variant="outline" size="sm">
                            查看详情
                          </Button>
                        </div>

                        <div className="p-6">
                          {result.type === "mbti" && (
                            <div className="space-y-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{result.result.type}</div>
                                <div className="text-sm font-medium">{result.result.title}</div>
                              </div>

                              <div className="text-sm text-gray-600">{result.result.description}</div>

                              <div className="space-y-3 mt-4">
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>外向 (E)</span>
                                    <span>内向 (I)</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-100 rounded-full">
                                    <div
                                      className="h-full bg-blue-500 rounded-full"
                                      style={{ width: `${result.result.dimensions.EI.percentage}%` }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>实感 (S)</span>
                                    <span>直觉 (N)</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-100 rounded-full">
                                    <div
                                      className="h-full bg-green-500 rounded-full"
                                      style={{ width: `${result.result.dimensions.SN.percentage}%` }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>思考 (T)</span>
                                    <span>情感 (F)</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-100 rounded-full">
                                    <div
                                      className="h-full bg-red-500 rounded-full"
                                      style={{ width: `${result.result.dimensions.TF.percentage}%` }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>判断 (J)</span>
                                    <span>感知 (P)</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-100 rounded-full">
                                    <div
                                      className="h-full bg-yellow-500 rounded-full"
                                      style={{ width: `${result.result.dimensions.JP.percentage}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {result.type === "pdp" && (
                            <div className="space-y-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                  {result.result.primary} + {result.result.secondary}
                                </div>
                              </div>

                              <div className="text-sm text-gray-600">{result.result.description}</div>

                              <div className="space-y-3 mt-4">
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>老虎</span>
                                    <span>{result.result.scores.tiger}</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-100 rounded-full">
                                    <div
                                      className="h-full bg-red-500 rounded-full"
                                      style={{ width: `${(result.result.scores.tiger / 30) * 100}%` }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>孔雀</span>
                                    <span>{result.result.scores.peacock}</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-100 rounded-full">
                                    <div
                                      className="h-full bg-yellow-500 rounded-full"
                                      style={{ width: `${(result.result.scores.peacock / 30) * 100}%` }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>无尾熊</span>
                                    <span>{result.result.scores.koala}</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-100 rounded-full">
                                    <div
                                      className="h-full bg-green-500 rounded-full"
                                      style={{ width: `${(result.result.scores.koala / 30) * 100}%` }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>猫头鹰</span>
                                    <span>{result.result.scores.owl}</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-100 rounded-full">
                                    <div
                                      className="h-full bg-blue-500 rounded-full"
                                      style={{ width: `${(result.result.scores.owl / 30) * 100}%` }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>变色龙</span>
                                    <span>{result.result.scores.chameleon}</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-100 rounded-full">
                                    <div
                                      className="h-full bg-purple-500 rounded-full"
                                      style={{ width: `${(result.result.scores.chameleon / 30) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {result.type === "face" && (
                            <div className="space-y-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{result.result.mbti.type}</div>
                                <div className="text-sm font-medium">{result.result.mbti.title}</div>
                              </div>

                              <div className="text-sm text-gray-600">{result.result.overview}</div>

                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="p-3 bg-purple-50 rounded-lg text-center">
                                  <div className="text-sm text-gray-500">PDP主性格</div>
                                  <div className="font-bold text-purple-700">{result.result.pdp.primary}</div>
                                  <div className="text-xs text-gray-500">辅助: {result.result.pdp.secondary}</div>
                                </div>

                                <div className="p-3 bg-blue-50 rounded-lg text-center">
                                  <div className="text-sm text-gray-500">DISC类型</div>
                                  <div className="font-bold text-blue-700">{result.result.disc.primary}</div>
                                  <div className="text-xs text-gray-500">辅助: {result.result.disc.secondary}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    导出所有结果
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>性格分析</CardTitle>
                <CardDescription>综合分析用户的性格特点和行为模式</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-800 mb-3">性格概述</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      李明是一个典型的INTJ人格类型，具有强烈的分析思维和战略规划能力。他倾向于独立工作，善于发现系统中的问题并提出创新解决方案。作为一名开发工程师，他展现出对细节的关注和对完美的追求，这与他的猫头鹰型PDP特质相符。
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed mt-2">
                      他的思维方式偏向概念化和抽象，更关注未来可能性而非当下细节。在团队中，他可能不是最活跃的沟通者，但会提供深思熟虑的见解和建设性的批评。
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium text-gray-800 mb-3">优势</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                          <span className="text-sm text-gray-600">
                            <strong>战略思维</strong>：能够看到长远的可能性并制定有效的计划
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                          <span className="text-sm text-gray-600">
                            <strong>分析能力</strong>：善于分析复杂问题并找出根本原因
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                          <span className="text-sm text-gray-600">
                            <strong>独立性</strong>：能够自主工作，不需要持续的指导和监督
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                          <span className="text-sm text-gray-600">
                            <strong>创新能力</strong>：能够提出创新的解决方案和改进建议
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                          <span className="text-sm text-gray-600">
                            <strong>决断力</strong>：在获取足够信息后能够快速做出决策
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium text-gray-800 mb-3">发展建议</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2"></div>
                          <span className="text-sm text-gray-600">
                            <strong>沟通技巧</strong>：提高表达想法的能力，特别是向非技术人员解释复杂概念
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2"></div>
                          <span className="text-sm text-gray-600">
                            <strong>团队协作</strong>：更积极地参与团队活动，分享知识和经验
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2"></div>
                          <span className="text-sm text-gray-600">
                            <strong>情感智能</strong>：提高对他人情感需求的认识和响应能力
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2"></div>
                          <span className="text-sm text-gray-600">
                            <strong>灵活性</strong>：在计划变更时保持开放态度，适应新的工作方式
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2"></div>
                          <span className="text-sm text-gray-600">
                            <strong>耐心</strong>：对进度较慢的团队成员或项目保持耐心
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-800 mb-3">工作风格</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 border rounded-lg">
                        <h4 className="text-sm font-medium mb-2">沟通方式</h4>
                        <p className="text-sm text-gray-600">
                          直接、简洁、注重事实。倾向于讨论想法和概念，而非闲聊。在电子邮件和书面沟通中表现更佳。
                        </p>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <h4 className="text-sm font-medium mb-2">决策方式</h4>
                        <p className="text-sm text-gray-600">
                          基于逻辑和分析做决策，重视数据和事实。在做决定前会收集充分信息，但一旦决定就会坚定执行。
                        </p>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <h4 className="text-sm font-medium mb-2">压力反应</h4>
                        <p className="text-sm text-gray-600">
                          在压力下可能变得更加内向和批判。倾向于通过独处和思考来恢复能量，而非社交活动。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-800 mb-3">团队角色</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">最适合的角色</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2"></div>
                            <span className="text-sm text-gray-600">
                              <strong>战略规划者</strong>：制定长期计划和路线图
                            </span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2"></div>
                            <span className="text-sm text-gray-600">
                              <strong>系统架构师</strong>：设计复杂系统和解决方案
                            </span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2"></div>
                            <span className="text-sm text-gray-600">
                              <strong>问题解决者</strong>：分析和解决复杂技术问题
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">挑战性角色</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 mr-2"></div>
                            <span className="text-sm text-gray-600">
                              <strong>团队协调者</strong>：需要频繁的人际互动和协调
                            </span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 mr-2"></div>
                            <span className="text-sm text-gray-600">
                              <strong>客户关系管理</strong>：需要持续的社交互动和情感支持
                            </span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 mr-2"></div>
                            <span className="text-sm text-gray-600">
                              <strong>日常运营</strong>：重复性工作和严格的流程遵循
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="career" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>职业匹配</CardTitle>
                <CardDescription>基于性格特点的职业发展建议和岗位匹配</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-800 mb-3">职业匹配度</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">软件架构师</span>
                            <span className="text-sm text-gray-500">95%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: "95%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">系统分析师</span>
                            <span className="text-sm text-gray-500">90%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: "90%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">数据科学家</span>
                            <span className="text-sm text-gray-500">85%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">技术主管</span>
                            <span className="text-sm text-gray-500">80%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: "80%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">研发经理</span>
                            <span className="text-sm text-gray-500">75%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">产品经理</span>
                            <span className="text-sm text-gray-500">65%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">项目经理</span>
                            <span className="text-sm text-gray-500">60%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">UI/UX设计师</span>
                            <span className="text-sm text-gray-500">45%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-red-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">销售工程师</span>
                            <span className="text-sm text-gray-500">40%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-red-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">客户支持</span>
                            <span className="text-sm text-gray-500">30%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-red-600 h-2 rounded-full" style={{ width: "30%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-800 mb-3">当前岗位匹配分析</h3>
                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg mb-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-green-800">开发工程师 - 高匹配度</h4>
                          <p className="text-sm text-green-700 mt-1">
                            李明的INTJ性格类型和猫头鹰型PDP特质与开发工程师岗位高度匹配。他的分析能力、逻辑思维和对细节的关注使他能够出色地完成编程和系统设计任务。
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">优势匹配点</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                            <span className="text-sm text-gray-600">分析思维与问题解决能力符合技术岗位需求</span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                            <span className="text-sm text-gray-600">独立工作能力强，适合深度开发任务</span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                            <span className="text-sm text-gray-600">战略思维有助于系统架构设计和长期技术规划</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">发展建议</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                            <span className="text-sm text-gray-600">
                              提升技术沟通能力，更好地与团队和非技术人员协作
                            </span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                            <span className="text-sm text-gray-600">参与更多系统架构设计，发挥战略思维优势</span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                            <span className="text-sm text-gray-600">尝试担任技术指导角色，培养领导能力</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-800 mb-3">职业发展路径</h3>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      <div className="space-y-6 relative">
                        <div className="flex">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center z-10 mr-4">
                            <span className="text-purple-600 text-sm">1</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg border flex-1">
                            <h4 className="text-sm font-medium">高级开发工程师</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              深化技术专业性，负责更复杂的系统模块开发，提升架构设计能力
                            </p>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center z-10 mr-4">
                            <span className="text-purple-600 text-sm">2</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg border flex-1">
                            <h4 className="text-sm font-medium">技术架构师</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              负责系统整体架构设计，技术选型和标准制定，指导团队技术实现
                            </p>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center z-10 mr-4">
                            <span className="text-purple-600 text-sm">3</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg border flex-1">
                            <h4 className="text-sm font-medium">技术主管/研发经理</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              领导开发团队，制定技术战略和路线图，平衡技术债务和业务需求
                            </p>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center z-10 mr-4">
                            <span className="text-purple-600 text-sm">4</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg border flex-1">
                            <h4 className="text-sm font-medium">技术总监/CTO</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              负责公司整体技术方向和战略，参与高层决策，推动技术创新
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      导出职业规划报告
                    </Button>
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
