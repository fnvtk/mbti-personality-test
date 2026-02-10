"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import BottomNav from "@/components/ui/bottom-nav"
import { mbtiDescriptions } from "@/data/mbti-descriptions"

interface MBTIResult {
  type: string
  dimensions: {
    EI: { E: number; I: number; percentage: number }
    SN: { S: number; N: number; percentage: number }
    TF: { T: number; F: number; percentage: number }
    JP: { J: number; P: number; percentage: number }
  }
}

export default function MBTIResultPage() {
  const router = useRouter()
  const [mbtiResult, setMbtiResult] = useState<MBTIResult | null>(null)

  useEffect(() => {
    // 从本地存储加载MBTI测试结果
    const storedResult = localStorage.getItem("mbtiResult")
    if (storedResult) {
      setMbtiResult(JSON.parse(storedResult))
    } else {
      // 如果没有测试结果，重定向到测试页面
      router.push("/test/mbti")
    }
  }, [router])

  // 处理咨询按钮点击
  const handleConsultation = () => {
    // 跳转到"我的"页面的咨询服务板块
    router.push("/profile#consultation")
  }

  if (!mbtiResult) {
    return (
      <div className="w-full max-w-md mx-auto h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-gray-600">加载中...</p>
      </div>
    )
  }

  const mbtiType = mbtiResult.type
  const mbtiDesc = mbtiDescriptions[mbtiType] || {
    title: "未知类型",
    description: "无法获取该类型的描述信息。",
    strengths: [],
    weaknesses: [],
    careers: [],
    relationships: "",
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      <div className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">MBTI测试结果</h1>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <Card className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">您的MBTI性格类型</h2>
              <div className="text-3xl font-bold text-purple-600 mt-2">{mbtiType}</div>
              <div className="text-lg font-medium text-purple-500 mt-1">{mbtiDesc.title}</div>
              <p className="text-gray-600 mt-4">{mbtiDesc.description}</p>
            </div>

            <div className="mt-6 space-y-4">
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

            {/* 添加顾问咨询服务按钮 */}
            <Button className="w-full bg-pink-600 hover:bg-pink-700 mt-6" onClick={handleConsultation}>
              顾问咨询服务
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">性格特征分析</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">优势</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  {mbtiDesc.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">需要注意的方面</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  {mbtiDesc.weaknesses.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">职业匹配度分析</h3>
            <p className="text-sm text-gray-600 mb-4">基于您的MBTI性格类型（{mbtiType}），以下是最适合您的职业方向：</p>
            <div className="space-y-2">
              {mbtiDesc.careers.map((career, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <div className="text-gray-800">{career}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">人际关系分析</h3>
            <p className="text-sm text-gray-600">{mbtiDesc.relationships}</p>
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

      <BottomNav currentPath="/mbti-result" />
    </div>
  )
}
