"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import BottomNav from "@/components/ui/bottom-nav"

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

export default function PDPResultPage() {
  const router = useRouter()
  const [pdpResult, setPdpResult] = useState<PDPResult | null>(null)

  useEffect(() => {
    // Load PDP results from localStorage if available
    const storedResult = localStorage.getItem("pdpResult")
    if (storedResult) {
      setPdpResult(JSON.parse(storedResult))
    } else {
      // 如果没有测试结果，重定向到测试页面
      router.push("/test/pdp")
    }
  }, [router])

  // PDP type descriptions
  const pdpDescriptions = {
    老虎: "行动导向，直接，果断，喜欢挑战，追求结果，有领导力",
    孔雀: "外向，热情，善于表达，喜欢社交，创意丰富，影响力强",
    无尾熊: "友善，耐心，善解人意，注重关系，稳定可靠，团队合作",
    猫头鹰: "分析型，精确，注重细节，逻辑思维，系统性，追求完美",
    变色龙: "适应性强，灵活，平衡，善于调和，多面手，综合能力",
  }

  // 处理咨询按钮点击
  const handleConsultation = () => {
    // 跳转到"我的"页面的咨询服务板块
    router.push("/profile#consultation")
  }

  if (!pdpResult) {
    return (
      <div className="w-full max-w-md mx-auto h-screen flex flex-col items-center justify-center bg-white">
        <p>加载中...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      <div className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">PDP测试结果</h1>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">PDP性格分析</h2>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg mb-4">
              <div className="text-sm text-gray-500 text-center mb-2">PDP性格类型</div>
              <div className="text-center font-bold text-purple-700 text-lg">
                {pdpResult.primary} + {pdpResult.secondary}
              </div>
              <div className="text-xs text-gray-500 text-center mt-1">
                {pdpDescriptions[pdpResult.primary as keyof typeof pdpDescriptions]}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2">PDP得分详情</h3>
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

            {/* 添加顾问咨询服务按钮 */}
            <Button className="w-full bg-pink-600 hover:bg-pink-700 mt-4" onClick={handleConsultation}>
              顾问咨询服务
            </Button>
          </Card>

          <Card className="p-6 mb-4">
            <h3 className="font-bold text-lg mb-4">PDP性格分析</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">{pdpResult.primary} 型主要特征</h4>
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
                <h4 className="font-medium mb-2">{pdpResult.secondary} 型辅助特征</h4>
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
          </Card>

          <div className="flex space-x-4">
            <Button className="flex-1" variant="outline" onClick={() => router.push("/full-report")}>
              查看综合报告
            </Button>
            <Button className="flex-1" variant="outline" onClick={() => router.push("/personality-tests")}>
              返回测试列表
            </Button>
          </div>
        </div>
      </div>

      <BottomNav currentPath="/pdp-result" />
    </div>
  )
}
