"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import BottomNav from "@/components/ui/bottom-nav"

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

// 性格类型描述
const personalityDescriptions = {
  M: {
    name: "完美型",
    description: "追求完美，注重细节，有条理，善于分析，追求高标准。",
    strengths: ["有条理", "注重细节", "追求高标准", "分析能力强", "忠诚"],
    weaknesses: ["过分挑剔", "优柔寡断", "容易忧虑", "过度敏感", "完美主义"],
    career: ["研究员", "会计师", "工程师", "质量控制", "编辑", "程序员"],
    interpersonal:
      "在人际关系中，您注重质量和准确性，可能会对自己和他人要求过高。您善于分析问题，但有时可能过于关注细节而忽略全局。建议在与他人交流时，尝试更加开放和灵活，接受不同的观点和做事方式。",
  },
  P: {
    name: "和平型",
    description: "平和，适应力强，善于倾听，避免冲突，稳定可靠。",
    strengths: ["平和", "适应力强", "善于倾听", "忍耐", "稳定"],
    weaknesses: ["优柔寡断", "缺乏热情", "拖延", "被动", "固执"],
    career: ["顾问", "人力资源", "客户服务", "教师", "社工", "心理咨询师"],
    interpersonal:
      "在人际关系中，您是一个和平的调解者，善于倾听和理解他人。您避免冲突，追求和谐的环境。然而，您有时可能过于顺从，难以表达自己的真实想法。建议在适当的时候表达自己的需求和观点，学会设定健康的界限。",
  },
  C: {
    name: "力量型",
    description: "果断，有领导力，目标导向，自信，有竞争力。",
    strengths: ["果断", "领导力", "目标导向", "自信", "有远见"],
    weaknesses: ["专横", "急躁", "缺乏同理心", "自负", "固执"],

    career: ["企业家", "管理者", "销售", "律师", "政治家", "投资银行家"],
    interpersonal:
      "在人际关系中，您直接、果断，喜欢掌控局面。您有明确的目标和方向，能够有效地领导团队。然而，您有时可能过于强势，忽略他人的感受。建议培养倾听和同理心的能力，学会欣赏不同的观点和做事方式。",
  },
  S: {
    name: "活跃型",
    description: "外向，热情，善于交际，乐观，充满活力。",
    strengths: ["外向", "热情", "善于交际", "乐观", "有感染力"],
    weaknesses: ["健忘", "散漫", "喋喋不休", "情绪化", "注意力不集中"],
    career: ["公关", "营销", "演艺", "销售", "培训师", "活动策划"],
    interpersonal:
      "在人际关系中，您热情开朗，善于交际，能够轻松地与他人建立联系。您乐观积极，能够激励他人。然而，您有时可能过于关注社交而忽略任务，或者过于情绪化。建议培养专注力和条理性，学会在适当的时候倾听而不是主导谈话。",
  },
}

export default function DISCResultPage() {
  const router = useRouter()
  const [discResult, setDiscResult] = useState<DISCResult | null>(null)

  useEffect(() => {
    // 从本地存储加载DISC测试结果
    const storedResult = localStorage.getItem("discResult")
    if (storedResult) {
      setDiscResult(JSON.parse(storedResult))
    } else {
      // 如果没有测试结果，重定向到测试页面
      router.push("/test/disc")
    }
  }, [router])

  // 处理咨询按钮点击
  const handleConsultation = () => {
    // 跳转到"我的"页面的咨询服务板块
    router.push("/profile#consultation")
  }

  if (!discResult) {
    return (
      <div className="w-full max-w-md mx-auto h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-gray-600">加载中...</p>
      </div>
    )
  }

  const primaryType = discResult.primary
  const secondaryType = discResult.secondary
  const primaryDesc = personalityDescriptions[primaryType as keyof typeof personalityDescriptions]
  const secondaryDesc = personalityDescriptions[secondaryType as keyof typeof personalityDescriptions]

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      <div className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">DISC测试结果</h1>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <Card className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">您的DISC性格类型</h2>
              <div className="text-3xl font-bold text-purple-600 mt-2">
                {primaryDesc.name} + {secondaryDesc.name}
              </div>
              <p className="text-gray-600 mt-2">{primaryDesc.description}</p>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">DISC得分详情</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>完美型 (M)</span>
                    <span>{discResult.scores.M}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(discResult.scores.M / 40) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>和平型 (P)</span>
                    <span>{discResult.scores.P}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(discResult.scores.P / 40) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>力量型 (C)</span>
                    <span>{discResult.scores.C}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${(discResult.scores.C / 40) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>活跃型 (S)</span>
                    <span>{discResult.scores.S}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: `${(discResult.scores.S / 40) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 添加顾问咨询服务按钮 */}
            <Button className="w-full bg-pink-600 hover:bg-pink-700 mt-6" onClick={handleConsultation}>
              顾问咨询服务
            </Button>
          </Card>

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
                  {primaryDesc.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">需要注意的方面</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  {primaryDesc.weaknesses.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">辅助性格特征</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">{secondaryDesc.name} 型辅助特征</h4>
                <p className="text-sm text-gray-600">{secondaryDesc.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">性格组合分析</h4>
                <p className="text-sm text-gray-600">
                  {primaryDesc.name}+{secondaryDesc.name}的组合使您既有{primaryDesc.name}的特质，又有
                  {secondaryDesc.name}的特质。 这种组合使您在保持{primaryDesc.strengths[0]}和{primaryDesc.strengths[1]}
                  的同时，也具备{secondaryDesc.strengths[0]}和{secondaryDesc.strengths[1]}的能力。
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">职业匹配度分析</h3>
            <p className="text-sm text-gray-600 mb-4">
              基于您的DISC性格类型（{primaryDesc.name} + {secondaryDesc.name}），以下是最适合您的职业方向：
            </p>
            <div className="space-y-2">
              {primaryDesc.career.slice(0, 3).map((career, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <div className="text-gray-800">{career}</div>
                </div>
              ))}
              {secondaryDesc.career.slice(0, 2).map((career, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <div className="text-gray-800">{career}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">人际关系分析</h3>
            <p className="text-sm text-gray-600">{primaryDesc.interpersonal}</p>
          </Card>

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

      <BottomNav currentPath="/disc-result" />
    </div>
  )
}
