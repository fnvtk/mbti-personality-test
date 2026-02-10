"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Download, Share2, Plus } from "lucide-react"
import BottomNav from "@/components/bottom-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MBTIResult {
  type: string
  dimensions: {
    EI: { E: number; I: number; percentage: number }
    SN: { S: number; N: number; percentage: number }
    TF: { T: number; F: number; percentage: number }
    JP: { J: number; P: number; percentage: number }
  }
}

interface PDPResult {
  primary: string
  secondary: string
  scores: {
    tiger: number
    peacock: number
    koala: number
    owl: number
    chameleon: number
  }
}

interface DISCResult {
  scores: {
    M: number
    P: number
    C: number
    S: number
  }
  primary: string
  secondary: string
}

interface FaceResult {
  data: {
    mbti?: { type: string; title: string }
    pdp?: { primary: string; secondary: string }
    disc?: { primary: string; secondary: string }
    strengths?: string[]
    overview?: string
    faceAnalysis?: string
    career?: string[]
  }
}

export default function FullReportPage() {
  const router = useRouter()
  const [mbtiResult, setMbtiResult] = useState<MBTIResult | null>(null)
  const [pdpResult, setPdpResult] = useState<PDPResult | null>(null)
  const [discResult, setDiscResult] = useState<DISCResult | null>(null)
  const [faceResult, setFaceResult] = useState<FaceResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 从本地存储加载所有测试结果
    const mbtiData = localStorage.getItem("mbtiResult")
    const pdpData = localStorage.getItem("pdpResult")
    const discData = localStorage.getItem("discResult")
    const faceData = localStorage.getItem("faceResult")

    if (mbtiData) setMbtiResult(JSON.parse(mbtiData))
    if (pdpData) setPdpResult(JSON.parse(pdpData))
    if (discData) setDiscResult(JSON.parse(discData))
    if (faceData) setFaceResult(JSON.parse(faceData))

    setLoading(false)
  }, [])

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

  // 检查是否有足够的测试结果
  const hasEnoughResults = mbtiResult && pdpResult && discResult

  if (!hasEnoughResults) {
    return (
      <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
        <div className="p-4 flex items-center border-b">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="flex-1 text-center text-lg font-medium mr-10">综合报告</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center mb-6">
            <p className="text-lg font-medium mb-2">需要完成更多测试</p>
            <p className="text-gray-500 mb-6">请完成至少MBTI、PDP和DISC测试以生成综合报告</p>
            <Button onClick={() => router.push("/personality-tests")}>继续测试</Button>
          </div>
        </div>

        <BottomNav currentPath="/full-report" />
      </div>
    )
  }

  // 获取主要类型
  const mbtiType = mbtiResult?.type || "ENTJ"
  const pdpPrimary = pdpResult?.primary || "老虎"
  const pdpSecondary = pdpResult?.secondary || "孔雀"
  const discPrimary = discResult?.primary || "D"
  const discSecondary = discResult?.secondary || "I"

  // 获取主要优势
  const strengths = faceResult?.data?.strengths || ["战略思考", "执行力", "影响力"]

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      <div className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">测试报告</h1>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-center mb-6">性格类型分析</h2>

            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-purple-600">{mbtiType}</div>
              <div className="text-sm text-gray-500 mt-1">
                {mbtiType === "ENTJ"
                  ? "指挥官型人格"
                  : mbtiType === "INTJ"
                    ? "建筑师型人格"
                    : mbtiType === "ENFJ"
                      ? "主人公型人格"
                      : "领导者型人格"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <div className="text-sm text-gray-500">PDP主性格</div>
                <div className="font-bold text-purple-700">{pdpPrimary}</div>
                <div className="text-xs text-gray-500">辅助: {pdpSecondary}</div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-sm text-gray-500">DISC类型</div>
                <div className="font-bold text-blue-700">{discPrimary}型</div>
                <div className="text-xs text-gray-500">辅助: {discSecondary}型</div>
              </div>
            </div>

            <div className="p-3 bg-green-50 rounded-lg mb-4">
              <div className="text-sm text-gray-500 text-center mb-2">盖洛普优势</div>
              <div className="flex justify-around">
                {strengths.slice(0, 3).map((strength, index) => (
                  <div key={index} className="text-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
                    <div className="text-xs font-medium">{strength}</div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="w-full bg-pink-600 hover:bg-pink-700 mt-2"
              onClick={() => handleConsultation("personal")}
            >
              个人超级个体测试咨询 (¥198/小时)
            </Button>
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
                  {faceResult?.data?.overview ||
                    `您是一个充满活力、善于表达的人，具有较强的领导能力和决策力。您思维敏捷，喜欢挑战和新鲜事物，同时也注重细节和逻辑分析。在人际交往中，您直接坦率，善于影响他人，但有时可能显得过于强势。您适应能力强，在压力下能保持冷静和理性。`}
                </p>
              </Card>

              {faceResult && (
                <Card className="p-6 mt-4">
                  <h3 className="font-bold mb-4">面相分析</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">额头</h4>
                      <p className="text-sm text-gray-600">宽阔饱满，表现出思考力强，有领导才能</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">眼睛</h4>
                      <p className="text-sm text-gray-600">目光坚定有神，显示出决断力与洞察力</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">鼻子</h4>
                      <p className="text-sm text-gray-600">鼻梁挺直，鼻翼适中，表现出自信与权威</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">嘴巴</h4>
                      <p className="text-sm text-gray-600">嘴唇薄而有力，显示出表达能力强，善于沟通</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">下巴</h4>
                      <p className="text-sm text-gray-600">方正有力，体现出坚定的意志力与执行力</p>
                    </div>
                  </div>
                </Card>
              )}

              <Card className="p-6 mt-4">
                <h3 className="font-bold mb-4">职业发展建议</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-sm">企业管理与领导</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-sm">战略咨询与规划</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-sm">项目管理</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-sm">营销与公关</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div className="text-sm">创业与商业开发</div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="mbti">
              <Card className="p-6">
                <h3 className="font-bold mb-4">MBTI性格分析</h3>
                {mbtiResult && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>外向 (E)</span>
                          <span>内向 (I)</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${mbtiResult.dimensions.EI.percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{mbtiResult.dimensions.EI.E}</span>
                          <span>{mbtiResult.dimensions.EI.I}</span>
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
                            style={{ width: `${mbtiResult.dimensions.SN.percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{mbtiResult.dimensions.SN.S}</span>
                          <span>{mbtiResult.dimensions.SN.N}</span>
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
                            style={{ width: `${mbtiResult.dimensions.TF.percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{mbtiResult.dimensions.TF.T}</span>
                          <span>{mbtiResult.dimensions.TF.F}</span>
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
                            style={{ width: `${mbtiResult.dimensions.JP.percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{mbtiResult.dimensions.JP.J}</span>
                          <span>{mbtiResult.dimensions.JP.P}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="font-medium mb-2">能量来源</div>
                      <p className="text-sm text-gray-600">
                        {mbtiType.charAt(0) === "E"
                          ? "外向(E) - 从外部世界获取能量，喜欢社交互动"
                          : "内向(I) - 从内心世界获取能量，需要独处时间"}
                      </p>
                    </div>

                    <div>
                      <div className="font-medium mb-2">信息处理</div>
                      <p className="text-sm text-gray-600">
                        {mbtiType.charAt(1) === "N"
                          ? "直觉(N) - 关注可能性和未来，善于发现模式和联系"
                          : "实感(S) - 关注现实和细节，注重实际经验"}
                      </p>
                    </div>

                    <div>
                      <div className="font-medium mb-2">决策方式</div>
                      <p className="text-sm text-gray-600">
                        {mbtiType.charAt(2) === "T"
                          ? "思考(T) - 基于逻辑和客观分析做决定，注重效率"
                          : "情感(F) - 基于价值观和人际关系做决定，注重和谐"}
                      </p>
                    </div>

                    <div>
                      <div className="font-medium mb-2">生活方式</div>
                      <p className="text-sm text-gray-600">
                        {mbtiType.charAt(3) === "J"
                          ? "判断(J) - 喜欢计划和组织，追求确定性和结构"
                          : "感知(P) - 喜欢灵活和适应，保持开放性和自发性"}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="pdp">
              <Card className="p-6">
                <h3 className="font-bold mb-4">PDP行为偏好分析</h3>
                {pdpResult && (
                  <div className="space-y-4">
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">PDP得分详情</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>老虎</span>
                            <span>{pdpResult.scores.tiger}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full">
                            <div
                              className="h-full bg-red-500 rounded-full"
                              style={{ width: `${(pdpResult.scores.tiger / 30) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>孔雀</span>
                            <span>{pdpResult.scores.peacock}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full">
                            <div
                              className="h-full bg-yellow-500 rounded-full"
                              style={{ width: `${(pdpResult.scores.peacock / 30) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>无尾熊</span>
                            <span>{pdpResult.scores.koala}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${(pdpResult.scores.koala / 30) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>猫头鹰</span>
                            <span>{pdpResult.scores.owl}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${(pdpResult.scores.owl / 30) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>变色龙</span>
                            <span>{pdpResult.scores.chameleon}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full">
                            <div
                              className="h-full bg-purple-500 rounded-full"
                              style={{ width: `${(pdpResult.scores.chameleon / 30) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="font-medium mb-2">{pdpResult.primary} 型主要特征</div>
                      <p className="text-sm text-gray-600">
                        {pdpResult.primary === "老虎" &&
                          "行动导向，直接，果断，喜欢挑战，追求结果，有领导力。老虎型人格的人通常目标明确，喜欢掌控局面，善于做决策，追求效率和成果。"}
                        {pdpResult.primary === "孔雀" &&
                          "外向，热情，善于表达，喜欢社交，创意丰富，影响力强。孔雀型人格的人通常乐观开朗，善于沟通，喜欢成为关注的焦点，有创造力和感染力。"}
                        {pdpResult.primary === "无尾熊" &&
                          "友善，耐心，善解人意，注重关系，稳定可靠，团队合作。无尾熊型人格的人通常温和友善，善于倾听，注重人际关系，有同理心，稳定可靠。"}
                        {pdpResult.primary === "猫头鹰" &&
                          "分析型，精确，注重细节，逻辑思维，系统性，追求完美。猫头鹰型人格的人通常思维缜密，善于分析，追求精确和完美，有条理，注重细节。"}
                        {pdpResult.primary === "变色龙" &&
                          "适应性强，灵活，平衡，善于调和，多面手，综合能力。变色龙型人格的人通常适应力强，灵活多变，善于调和各方关系，综合能力强。"}
                      </p>
                    </div>

                    <div>
                      <div className="font-medium mb-2">{pdpResult.secondary} 型辅助特征</div>
                      <p className="text-sm text-gray-600">
                        {pdpResult.secondary === "老虎" &&
                          "作为辅助特征，老虎型的特质使您在需要时能够展现决断力和行动力，帮助您更有效地实现目标。"}
                        {pdpResult.secondary === "孔雀" &&
                          "作为辅助特征，孔雀型的特质使您在社交场合更加活跃，并能够有效地表达自己的想法和感受。"}
                        {pdpResult.secondary === "无尾熊" &&
                          "作为辅助特征，无尾熊型的特质使您更加关注人际关系，并能够在团队中创造和谐的氛围。"}
                        {pdpResult.secondary === "猫头鹰" &&
                          "作为辅助特征，猫头鹰型的特质使您在分析问题时更加细致和逻辑，帮助您做出更加理性的决策。"}
                        {pdpResult.secondary === "变色龙" &&
                          "作为辅助特征，变色龙型的特质使您更加灵活多变，能够适应不同的环境和情况。"}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="disc">
              <Card className="p-6">
                <h3 className="font-bold mb-4">DISC沟通风格分析</h3>
                {discResult && (
                  <div className="space-y-4">
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">DISC得分详情</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>支配型 (D)</span>
                            <span>{discResult.scores.C || 0}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full">
                            <div
                              className="h-full bg-red-500 rounded-full"
                              style={{ width: `${((discResult.scores.C || 0) / 40) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>影响型 (I)</span>
                            <span>{discResult.scores.S || 0}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full">
                            <div
                              className="h-full bg-yellow-500 rounded-full"
                              style={{ width: `${((discResult.scores.S || 0) / 40) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>稳健型 (S)</span>
                            <span>{discResult.scores.P || 0}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${((discResult.scores.P || 0) / 40) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>完美型 (C)</span>
                            <span>{discResult.scores.M || 0}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${((discResult.scores.M || 0) / 40) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="font-medium mb-2">沟通风格特点</div>
                      <p className="text-sm text-gray-600">
                        {discResult.primary === "D" || discResult.primary === "C"
                          ? "您的沟通风格以支配型为主，表现为直接、果断、结果导向；辅以影响型特质，增强了表达能力和说服力。在沟通中，您倾向于直接表达观点，同时也能够调动他人的积极性。"
                          : discResult.primary === "I" || discResult.primary === "S"
                            ? "您的沟通风格以影响型为主，表现为热情、外向、善于表达；辅以支配型特质，增强了决断力和目标导向。在沟通中，您善于激励他人，同时也能够在需要时做出果断决策。"
                            : "您的沟通风格平衡多元，能够根据不同情境调整自己的表达方式。您既能直接表达观点，也能倾听他人意见；既能关注细节，也能把握大局。"}
                      </p>
                    </div>

                    <div>
                      <div className="font-medium mb-2">团队沟通建议</div>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                        <li>与D型人沟通时，保持简洁直接，关注结果和目标</li>
                        <li>与I型人沟通时，给予热情回应，关注创意和可能性</li>
                        <li>与S型人沟通时，保持耐心和稳定，提供细节和支持</li>
                        <li>与C型人沟通时，提供数据和逻辑分析，尊重他们的专业性</li>
                      </ul>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>

          {/* 添加咨询按钮区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleConsultation("team")}>
              团队性格测试分析 (¥980/小时)
            </Button>

            <Button className="bg-pink-600 hover:bg-pink-700" onClick={() => handleConsultation("personal")}>
              个人超级个体测试咨询 (¥198/小时)
            </Button>
          </div>

          <div className="flex space-x-4">
            <Button className="flex-1" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              下载报告
            </Button>
            <Button className="flex-1" variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              分享报告
            </Button>
          </div>

          <Button className="w-full" variant="outline" onClick={() => router.push("/personality-tests")}>
            <Plus className="h-4 w-4 mr-2" />
            继续测试
          </Button>
        </div>
      </div>

      <BottomNav currentPath="/full-report" />
    </div>
  )
}
