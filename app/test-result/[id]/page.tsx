"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import BottomNav from "@/components/ui/bottom-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDatabase } from "@/lib/database"
import { Badge } from "@/components/ui/badge"

export default function TestResultDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取测试结果
    const testId = params.id
    const userId = sessionStorage.getItem("currentUserId")

    if (userId) {
      const db = getDatabase()
      const user = db.getUserById(userId)

      if (user) {
        const result = user.testResults.find((test: any) => test.id === testId)
        if (result) {
          setTestResult(result)
        }
      }
    }

    setLoading(false)
  }, [params.id])

  // 处理咨询按钮点击
  const handleConsultation = (type: string) => {
    if (type === "personal") {
      alert("您即将开始个人超级个体测试咨询，费用为198元/小时")
      // 这里可以添加支付逻辑或跳转到支付页面
    } else if (type === "team") {
      alert("您即将开始团队性格测试分析，费用为980元/小时")
      // 这里可以添加支付逻辑或跳转到支付页面
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-gray-600">加载中...</p>
      </div>
    )
  }

  if (!testResult) {
    return (
      <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
        <div className="p-4 flex items-center border-b">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="flex-1 text-center text-lg font-medium mr-10">测试结果</h1>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">未找到测试结果</p>
            <Button onClick={() => router.back()}>返回</Button>
          </div>
        </div>

        <BottomNav currentPath="/profile" />
      </div>
    )
  }

  // 根据测试类型渲染不同的内容
  let content
  switch (testResult.testType) {
    case "mbti":
      content = <MBTIResultContent result={testResult.result} />
      break
    case "pdp":
      content = <PDPResultContent result={testResult.result} />
      break
    case "disc":
      content = <DISCResultContent result={testResult.result} />
      break
    case "face":
      content = <FaceResultContent result={testResult.result} />
      break
    default:
      content = <div className="p-6 text-center text-gray-500">暂不支持显示此类型的测试结果</div>
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      <div className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">
          {testResult.testType === "mbti"
            ? "MBTI测试结果"
            : testResult.testType === "pdp"
              ? "PDP测试结果"
              : testResult.testType === "disc"
                ? "DISC测试结果"
                : testResult.testType === "face"
                  ? "面相分析结果"
                  : "测试结果"}
        </h1>
      </div>

      <div className="flex-1 overflow-auto">
        {content}

        {/* 添加咨询按钮区域 */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleConsultation("team")}>
            团队性格测试分析 (¥980/小时)
          </Button>

          <Button className="bg-pink-600 hover:bg-pink-700" onClick={() => handleConsultation("personal")}>
            个人超级个体测试咨询 (¥198/小时)
          </Button>
        </div>

        <div className="px-6 pb-6 flex space-x-4">
          <Button className="flex-1" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            下载报告
          </Button>
          <Button className="flex-1" variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            分享报告
          </Button>
        </div>
      </div>

      <BottomNav currentPath={`/test-result/${params.id}`} />
    </div>
  )
}

// MBTI结果内容组件
function MBTIResultContent({ result }: { result: any }) {
  if (!result) return <div className="p-6 text-center text-gray-500">无法加载MBTI测试结果</div>

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">您的MBTI性格类型</h2>
          <div className="text-3xl font-bold text-purple-600 mt-2">{result.type}</div>
          <div className="text-lg font-medium text-purple-500 mt-1">{result.title || "未知类型"}</div>
        </div>

        <div className="mt-6 space-y-4">
          {result.dimensions && (
            <>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>外向 (E)</span>
                  <span>内向 (I)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${result.dimensions.EI?.percentage || 50}%` }}
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
                    style={{ width: `${result.dimensions.SN?.percentage || 50}%` }}
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
                    style={{ width: `${result.dimensions.TF?.percentage || 50}%` }}
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
                    style={{ width: `${result.dimensions.JP?.percentage || 50}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">概述</TabsTrigger>
          <TabsTrigger value="strengths">优势</TabsTrigger>
          <TabsTrigger value="careers">职业</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">性格概述</h3>
            <p className="text-sm text-gray-600">{result.description || "暂无详细描述"}</p>
          </Card>
        </TabsContent>

        <TabsContent value="strengths">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">性格优势</h3>
            <div className="space-y-2">
              {result.strengths ? (
                result.strengths.map((strength: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">{strength}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">暂无优势数据</p>
              )}
            </div>

            <h3 className="font-bold text-lg mt-6 mb-4">需要注意</h3>
            <div className="space-y-2">
              {result.weaknesses ? (
                result.weaknesses.map((weakness: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">{weakness}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">暂无数据</p>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="careers">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">适合职业</h3>
            <div className="space-y-2">
              {result.careers ? (
                result.careers.map((career: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">{career}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">暂无职业匹配数据</p>
              )}
            </div>

            <h3 className="font-bold text-lg mt-6 mb-4">团队角色</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg">
                <Badge className="mb-2">增长负责人</Badge>
                <div className="text-sm text-gray-600">匹配度: {result.teamRoles?.growth || 65}%</div>
              </div>
              <div className="p-3 border rounded-lg">
                <Badge className="mb-2">用户运营</Badge>
                <div className="text-sm text-gray-600">匹配度: {result.teamRoles?.userOps || 75}%</div>
              </div>
              <div className="p-3 border rounded-lg">
                <Badge className="mb-2">内容运营</Badge>
                <div className="text-sm text-gray-600">匹配度: {result.teamRoles?.contentOps || 80}%</div>
              </div>
              <div className="p-3 border rounded-lg">
                <Badge className="mb-2">产品经理</Badge>
                <div className="text-sm text-gray-600">匹配度: {result.teamRoles?.productManager || 70}%</div>
              </div>
              <div className="p-3 border rounded-lg">
                <Badge className="mb-2">开发专员</Badge>
                <div className="text-sm text-gray-600">匹配度: {result.teamRoles?.developer || 60}%</div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// PDP结果内容组件
function PDPResultContent({ result }: { result: any }) {
  if (!result) return <div className="p-6 text-center text-gray-500">无法加载PDP测试结果</div>

  // PDP类型描述
  const pdpDescriptions: Record<string, string> = {
    老虎: "行动导向，直接，果断，喜欢挑战，追求结果，有领导力",
    孔雀: "外向，热情，善于表达，喜欢社交，创意丰富，影响力强",
    无尾熊: "友善，耐心，善解人意，注重关系，稳定可靠，团队合作",
    猫头鹰: "分析型，精确，注重细节，逻辑思维，系统性，追求完美",
    变色龙: "适应性强，灵活，平衡，善于调和，多面手，综合能力",
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">您的PDP行为偏好</h2>
          <div className="text-3xl font-bold text-purple-600 mt-2">
            {result.primary} + {result.secondary}
          </div>
          <p className="text-gray-600 mt-4">{pdpDescriptions[result.primary] || "暂无描述"}</p>
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-2">PDP得分详情</h3>
          <div className="space-y-2">
            {result.scores && (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>老虎</span>
                    <span>{result.scores.tiger}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${(result.scores.tiger / 30) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>孔雀</span>
                    <span>{result.scores.peacock}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: `${(result.scores.peacock / 30) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>无尾熊</span>
                    <span>{result.scores.koala}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(result.scores.koala / 30) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>猫头鹰</span>
                    <span>{result.scores.owl}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(result.scores.owl / 30) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>变色龙</span>
                    <span>{result.scores.chameleon}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${(result.scores.chameleon / 30) * 100}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <Tabs defaultValue="analysis">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="analysis">性格分析</TabsTrigger>
          <TabsTrigger value="teamwork">团队协作</TabsTrigger>
          <TabsTrigger value="careers">职业匹配</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">PDP性格分析</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">{result.primary} 型主要特征</h4>
                <p className="text-sm text-gray-600">
                  {result.primary === "老虎" &&
                    "行动导向，直接，果断，喜欢挑战，追求结果，有领导力。老虎型人格的人通常目标明确，喜欢掌控局面，善于做决策，追求效率和成果。"}
                  {result.primary === "孔雀" &&
                    "外向，热情，善于表达，喜欢社交，创意丰富，影响力强。孔雀型人格的人通常乐观开朗，善于沟通，喜欢成为关注的焦点，有创造力和感染力。"}
                  {result.primary === "无尾熊" &&
                    "友善，耐心，善解人意，注重关系，稳定可靠，团队合作。无尾熊型人格的人通常温和友善，善于倾听，注重人际关系，有同理心，稳定可靠。"}
                  {result.primary === "猫头鹰" &&
                    "分析型，精确，注重细节，逻辑思维，系统性，追求完美。猫头鹰型人格的人通常思维缜密，善于分析，追求精确和完美，有条理，注重细节。"}
                  {result.primary === "变色龙" &&
                    "适应性强，灵活，平衡，善于调和，多面手，综合能力。变色龙型人格的人通常适应力强，灵活多变，善于调和各方关系，综合能力强。"}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">{result.secondary} 型辅助特征</h4>
                <p className="text-sm text-gray-600">
                  {result.secondary === "老虎" &&
                    "作为辅助特征，老虎型的特质使您在需要时能够展现决断力和行动力，帮助您更有效地实现目标。"}
                  {result.secondary === "孔雀" &&
                    "作为辅助特征，孔雀型的特质使您在社交场合更加活跃，并能够有效地表达自己的想法和感受。"}
                  {result.secondary === "无尾熊" &&
                    "作为辅助特征，无尾熊型的特质使您更加关注人际关系，并能够在团队中创造和谐的氛围。"}
                  {result.secondary === "猫头鹰" &&
                    "作为辅助特征，猫头鹰型的特质使您在分析问题时更加细致和逻辑，帮助您做出更加理性的决策。"}
                  {result.secondary === "变色龙" &&
                    "作为辅助特征，变色龙型的特质使您更加灵活多变，能够适应不同的环境和情况。"}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="teamwork">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">团队协作分析</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">团队角色</h4>
                <p className="text-sm text-gray-600">
                  {result.primary === "老虎" &&
                    "您在团队中自然倾向于担任领导者或推动者的角色，善于制定目标并推动团队达成目标。"}
                  {result.primary === "孔雀" &&
                    "您在团队中自然倾向于担任激励者或创意者的角色，善于提高团队士气并提出创新想法。"}
                  {result.primary === "无尾熊" &&
                    "您在团队中自然倾向于担任协调者或支持者的角色，善于促进团队和谐并支持团队成员。"}
                  {result.primary === "猫头鹰" &&
                    "您在团队中自然倾向于担任分析者或专家的角色，善于深入分析问题并提供专业见解。"}
                  {result.primary === "变色龙" &&
                    "您在团队中自然倾向于担任调和者或多面手的角色，善于适应不同情况并在不同角色间切换。"}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">团队岗位匹配度</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border rounded-lg">
                    <Badge className="mb-2">增长负责人</Badge>
                    <div className="text-sm text-gray-600">
                      匹配度:{" "}
                      {result.primary === "老虎"
                        ? 90
                        : result.primary === "孔雀"
                          ? 85
                          : result.primary === "猫头鹰"
                            ? 75
                            : result.primary === "无尾熊"
                              ? 65
                              : 70}
                      %
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <Badge className="mb-2">用户运营</Badge>
                    <div className="text-sm text-gray-600">
                      匹配度:{" "}
                      {result.primary === "孔雀"
                        ? 95
                        : result.primary === "无尾熊"
                          ? 85
                          : result.primary === "变色龙"
                            ? 80
                            : result.primary === "老虎"
                              ? 70
                              : 65}
                      %
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <Badge className="mb-2">内容运营</Badge>
                    <div className="text-sm text-gray-600">
                      匹配度:{" "}
                      {result.primary === "孔雀"
                        ? 90
                        : result.primary === "变色龙"
                          ? 85
                          : result.primary === "无尾熊"
                            ? 80
                            : result.primary === "猫头鹰"
                              ? 75
                              : 65}
                      %
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <Badge className="mb-2">产品经理</Badge>
                    <div className="text-sm text-gray-600">
                      匹配度:{" "}
                      {result.primary === "猫头鹰"
                        ? 90
                        : result.primary === "老虎"
                          ? 85
                          : result.primary === "变色龙"
                            ? 80
                            : result.primary === "孔雀"
                              ? 75
                              : 70}
                      %
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <Badge className="mb-2">开发专员</Badge>
                    <div className="text-sm text-gray-600">
                      匹配度:{" "}
                      {result.primary === "猫头鹰"
                        ? 95
                        : result.primary === "变色龙"
                          ? 80
                          : result.primary === "老虎"
                            ? 75
                            : result.primary === "无尾熊"
                              ? 70
                              : 65}
                      %
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="careers">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">职业匹配度分析</h3>
            <p className="text-sm text-gray-600 mb-4">
              基于您的PDP性格类型（{result.primary} + {result.secondary}
              ），以下是最适合您的职业方向：
            </p>
            <div className="space-y-3">
              {result.primary === "老虎" && (
                <>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">企业高管</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">项目经理</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">创业者</div>
                  </div>
                </>
              )}

              {result.primary === "孔雀" && (
                <>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">市场营销</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">公关顾问</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">销售代表</div>
                  </div>
                </>
              )}

              {result.primary === "无尾熊" && (
                <>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">人力资源</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">客户服务</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">教师/培训师</div>
                  </div>
                </>
              )}

              {result.primary === "猫头鹰" && (
                <>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">研究员</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">数据分析师</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">工程师/技术专家</div>
                  </div>
                </>
              )}

              {result.primary === "变色龙" && (
                <>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">顾问/咨询师</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">项目协调员</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">跨部门管理者</div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// DISC结果内容组件
function DISCResultContent({ result }: { result: any }) {
  if (!result) return <div className="p-6 text-center text-gray-500">无法加载DISC测试结果</div>

  // DISC类型描述
  const discDescriptions: Record<string, any> = {
    M: {
      name: "完美型",
      description: "追求完美，注重细节，有条理，善于分析，追求高标准。",
      strengths: ["有条理", "注重细节", "追求高标准", "分析能力强", "忠诚"],
      weaknesses: ["过分挑剔", "优柔寡断", "容易忧虑", "过度敏感", "完美主义"],
    },
    P: {
      name: "和平型",
      description: "平和，适应力强，善于倾听，避免冲突，稳定可靠。",
      strengths: ["平和", "适应力强", "善于倾听", "忍耐", "稳定"],
      weaknesses: ["优柔寡断", "缺乏热情", "拖延", "被动", "固执"],
    },
    C: {
      name: "力量型",
      description: "果断，有领导力，目标导向，自信，有竞争力。",
      strengths: ["果断", "领导力", "目标导向", "自信", "有远见"],
      weaknesses: ["专横", "急躁", "缺乏同理心", "自负", "固执"],
    },
    S: {
      name: "活跃型",
      description: "外向，热情，善于交际，乐观，充满活力。",
      strengths: ["外向", "热情", "善于交际", "乐观", "有感染力"],
      weaknesses: ["健忘", "散漫", "喋喋不休", "情绪化", "注意力不集中"],
    },
  }

  const primaryType = result.primary?.charAt(0) || "C"
  const secondaryType = result.secondary?.charAt(0) || "S"
  const primaryDesc = discDescriptions[primaryType] || discDescriptions["C"]
  const secondaryDesc = discDescriptions[secondaryType] || discDescriptions["S"]

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">您的DISC性格类型</h2>
          <div className="text-3xl font-bold text-purple-600 mt-2">
            {primaryDesc.name} + {secondaryDesc.name}
          </div>
          <p className="text-gray-600 mt-4">{primaryDesc.description}</p>
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-2">DISC得分详情</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>完美型 (M)</span>
                <span>{result.scores?.M || 0}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${((result.scores?.M || 0) / 40) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>和平型 (P)</span>
                <span>{result.scores?.P || 0}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${((result.scores?.P || 0) / 40) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>力量型 (C)</span>
                <span>{result.scores?.C || 0}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${((result.scores?.C || 0) / 40) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>活跃型 (S)</span>
                <span>{result.scores?.S || 0}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${((result.scores?.S || 0) / 40) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="features">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="features">性格特征</TabsTrigger>
          <TabsTrigger value="teamwork">团队协作</TabsTrigger>
          <TabsTrigger value="careers">职业匹配</TabsTrigger>
        </TabsList>

        <TabsContent value="features">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">主要性格特征分析</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">{primaryDesc.name} 型主要特征</h4>
                <p className="text-sm text-gray-600">{primaryDesc.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">优势</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  {primaryDesc.strengths.map((strength: string, index: number) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">需要注意的方面</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  {primaryDesc.weaknesses.map((weakness: string, index: number) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="teamwork">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">团队协作分析</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">团队角色</h4>
                <p className="text-sm text-gray-600">
                  {primaryType === "C" &&
                    "您在团队中自然倾向于担任领导者或决策者的角色，善于制定目标并推动团队达成目标。"}
                  {primaryType === "S" &&
                    "您在团队中自然倾向于担任激励者或创意者的角色，善于提高团队士气并提出创新想法。"}
                  {primaryType === "P" &&
                    "您在团队中自然倾向于担任协调者或支持者的角色，善于促进团队和谐并支持团队成员。"}
                  {primaryType === "M" &&
                    "您在团队中自然倾向于担任分析者或专家的角色，善于深入分析问题并提供专业见解。"}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">团队岗位匹配度</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border rounded-lg">
                    <Badge className="mb-2">增长负责人</Badge>
                    <div className="text-sm text-gray-600">
                      匹配度: {primaryType === "C" ? 90 : primaryType === "S" ? 85 : primaryType === "M" ? 75 : 65}%
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <Badge className="mb-2">用户运营</Badge>
                    <div className="text-sm text-gray-600">
                      匹配度: {primaryType === "S" ? 95 : primaryType === "P" ? 85 : primaryType === "C" ? 70 : 65}%
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <Badge className="mb-2">内容运营</Badge>
                    <div className="text-sm text-gray-600">
                      匹配度: {primaryType === "S" ? 90 : primaryType === "P" ? 80 : primaryType === "M" ? 75 : 65}%
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <Badge className="mb-2">产品经理</Badge>
                    <div className="text-sm text-gray-600">
                      匹配度: {primaryType === "M" ? 90 : primaryType === "C" ? 85 : primaryType === "S" ? 75 : 70}%
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <Badge className="mb-2">开发专员</Badge>
                    <div className="text-sm text-gray-600">
                      匹配度: {primaryType === "M" ? 95 : primaryType === "C" ? 80 : primaryType === "P" ? 70 : 65}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="careers">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">职业匹配度分析</h3>
            <p className="text-sm text-gray-600 mb-4">
              基于您的DISC性格类型（{primaryDesc.name} + {secondaryDesc.name}
              ），以下是最适合您的职业方向：
            </p>
            <div className="space-y-3">
              {primaryType === "C" && (
                <>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">企业家</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">管理者</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">销售</div>
                  </div>
                </>
              )}

              {primaryType === "S" && (
                <>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">公关</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">营销</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">演艺</div>
                  </div>
                </>
              )}

              {primaryType === "P" && (
                <>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">顾问</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">人力资源</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">客户服务</div>
                  </div>
                </>
              )}

              {primaryType === "M" && (
                <>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">研究员</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">会计师</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-gray-800">工程师</div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// 面相分析结果内容组件
function FaceResultContent({ result }: { result: any }) {
  if (!result) return <div className="p-6 text-center text-gray-500">无法加载面相分析结果</div>

  const data = result.data || {}

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6 space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold">性格类型分析</h2>
          <div className="text-4xl font-bold text-purple-500 mt-2">{data.mbti?.type || "ENTJ"}</div>
          <div className="text-sm text-gray-500 mt-1">{data.mbti?.title || "指挥官型人格"}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-purple-50 rounded-lg text-center">
            <div className="text-sm text-gray-500">PDP主性格</div>
            <div className="font-bold text-purple-700">{data.pdp?.primary || "老虎"}</div>
            <div className="text-xs text-gray-500">辅助: {data.pdp?.secondary || "孔雀"}</div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <div className="text-sm text-gray-500">DISC类型</div>
            <div className="font-bold text-blue-700">{data.disc?.primary || "D型"}</div>
            <div className="text-xs text-gray-500">辅助: {data.disc?.secondary || "I型"}</div>
          </div>
        </div>

        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-gray-500 text-center mb-2">主要优势</div>
          <div className="flex flex-wrap justify-around">
            {(data.strengths || ["领导能力", "战略思维", "决策能力"])
              .slice(0, 3)
              .map((strength: string, index: number) => (
                <div key={index} className="text-center px-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
                  <div className="text-xs font-medium">{strength}</div>
                </div>
              ))}
          </div>
        </div>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">概述</TabsTrigger>
          <TabsTrigger value="mbti">MBTI</TabsTrigger>
          <TabsTrigger value="pdp">PDP</TabsTrigger>
          <TabsTrigger value="disc">DISC</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="p-6">
            <h3 className="font-bold mb-4">性格概述</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {data.overview ||
                "您是一个充满活力、善于表达的人，具有较强的领导能力和决策力。您思维敏捷，喜欢挑战和新鲜事物，同时也注重细节和逻辑分析。在人际交往中，您直接坦率，善于影响他人，但有时可能显得过于强势。您适应能力强，在压力下能保持冷静和理性。"}
            </p>
          </Card>

          <Card className="p-6 mt-4">
            <h3 className="font-bold mb-4">面相骨相分析</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {data.faceAnalysis ||
                "您的面相方正，眉清目秀，眼神坚定有神，显示出较强的领导气质和决断力。额头宽阔，代表思维开阔，具有战略眼光。鼻梁挺直，显示自信和坚定的性格。嘴唇适中，表明表达能力强，善于沟通。下巴轮廓分明，代表意志力强，做事有始有终。整体面相和谐，显示出平衡的性格特质。"}
            </p>
          </Card>

          <Card className="p-6 mt-4">
            <h3 className="font-bold mb-4">职业发展建议</h3>
            <div className="space-y-2">
              {(data.career || ["企业管理与领导", "战略咨询与规划", "项目管理", "营销与公关", "创业与商业开发"]).map(
                (career: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-sm">{career}</div>
                  </div>
                ),
              )}
            </div>
          </Card>

          <Card className="p-6 mt-4">
            <h3 className="font-bold mb-4">团队岗位匹配度</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg">
                <Badge className="mb-2">增长负责人</Badge>
                <div className="text-sm text-gray-600">匹配度: 90%</div>
              </div>
              <div className="p-3 border rounded-lg">
                <Badge className="mb-2">用户运营</Badge>
                <div className="text-sm text-gray-600">匹配度: 75%</div>
              </div>
              <div className="p-3 border rounded-lg">
                <Badge className="mb-2">内容运营</Badge>
                <div className="text-sm text-gray-600">匹配度: 80%</div>
              </div>
              <div className="p-3 border rounded-lg">
                <Badge className="mb-2">产品经理</Badge>
                <div className="text-sm text-gray-600">匹配度: 85%</div>
              </div>
              <div className="p-3 border rounded-lg">
                <Badge className="mb-2">开发专员</Badge>
                <div className="text-sm text-gray-600">匹配度: 70%</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="mbti">
          <Card className="p-6">
            <h3 className="font-bold mb-4">MBTI性格分析</h3>
            <div className="space-y-3">
              <div className="border-b border-gray-100 pb-2">
                <div className="font-medium">能量来源</div>
                <div className="text-sm text-gray-600 mt-1">
                  {data.mbti?.dimensions?.energy || "外向(E) - 从外部世界获取能量，喜欢社交互动"}
                </div>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <div className="font-medium">信息处理</div>
                <div className="text-sm text-gray-600 mt-1">
                  {data.mbti?.dimensions?.information || "直觉(N) - 关注可能性和未来，善于发现模式和联系"}
                </div>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <div className="font-medium">决策方式</div>
                <div className="text-sm text-gray-600 mt-1">
                  {data.mbti?.dimensions?.decisions || "思考(T) - 基于逻辑和客观分析做决定，注重效率"}
                </div>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <div className="font-medium">生活方式</div>
                <div className="text-sm text-gray-600 mt-1">
                  {data.mbti?.dimensions?.lifestyle || "判断(J) - 喜欢计划和组织，追求确定性和结构"}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="pdp">
          <Card className="p-6">
            <h3 className="font-bold mb-4">PDP行为偏好分析</h3>
            <div className="space-y-3">
              <div className="border-b border-gray-100 pb-2">
                <div className="font-medium">主导型: {data.pdp?.primary || "老虎"}</div>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <div className="font-medium">辅助型: {data.pdp?.secondary || "孔雀"}</div>
              </div>
              <div className="text-sm text-gray-600 mt-3">
                {data.pdp?.description ||
                  "您的主导型为老虎型，表现为果断、直接、目标导向；辅助型为孔雀型，增添了表达能力和社交魅力。这种组合使您既有领导力又有感染力，能够有效地激励和指导团队。"}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="disc">
          <Card className="p-6">
            <h3 className="font-bold mb-4">DISC沟通风格分析</h3>
            <div className="space-y-3">
              <div className="border-b border-gray-100 pb-2">
                <div className="font-medium">主要风格: {data.disc?.primary || "D型(支配型)"}</div>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <div className="font-medium">次要风格: {data.disc?.secondary || "I型(影响型)"}</div>
              </div>
              <div className="text-sm text-gray-600 mt-3">
                {data.disc?.description ||
                  "您的沟通风格以支配型为主，表现为直接、果断、结果导向；辅以影响型特质，增强了表达能力和说服力。在沟通中，您倾向于直接表达观点，同时也能够调动他人的积极性。"}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
