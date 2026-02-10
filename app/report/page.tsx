"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import BottomNav from "@/components/bottom-nav"
import { ArrowRight, Lock } from "lucide-react"

export default function ReportPage() {
  const router = useRouter()
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    // 从sessionStorage获取分析结果
    try {
      const storedResult = sessionStorage.getItem("analysisResult")
      if (storedResult) {
        const parsedResult = JSON.parse(storedResult)
        setAnalysisResult(parsedResult.data || parsedResult)
      } else {
        setError("未找到分析结果")
      }
    } catch (err) {
      console.error("解析分析结果时出错:", err)
      setError("解析分析结果时出错")
    } finally {
      setLoading(false)
    }

    // 检查是否已购买完整报告
    const hasPremium = localStorage.getItem("hasPremiumReport") === "true"
    setIsPremium(hasPremium)
  }, [])

  // 处理获取更深入测试
  const handleGetDetailedTest = () => {
    router.push("/personality-tests")
  }

  // 处理购买完整报告
  const handleBuyFullReport = () => {
    router.push("/pricing")
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-gray-600">加载分析结果中...</p>
      </div>
    )
  }

  if (error || !analysisResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 p-4 rounded-md text-red-700 mb-4">{error || "无法加载分析结果"}</div>
        <Button onClick={() => router.push("/")}>返回首页</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 overflow-auto pb-16">
        {/* 头部 */}
        <div className="bg-purple-600 text-white p-4 text-center">
          <h1 className="text-xl font-bold">AI面部分析报告</h1>
          <p className="text-sm opacity-80">基于面部特征的性格分析</p>
        </div>

        {/* 概述部分 */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold mb-2">整体性格概述</h2>
          <p className="text-gray-700">{analysisResult.overview}</p>
        </div>

        {/* MBTI部分 */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">MBTI性格类型</h2>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              {analysisResult.mbti?.type || "未知"}
            </span>
          </div>
          <p className="text-gray-700 mb-3">{analysisResult.mbti?.title || "未知类型"}</p>

          <div className="space-y-3 mt-4">
            <div>
              <h3 className="font-medium text-gray-900">能量来源</h3>
              <p className="text-sm text-gray-600">{analysisResult.mbti?.dimensions?.energy || "未知"}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">信息获取</h3>
              <p className="text-sm text-gray-600">{analysisResult.mbti?.dimensions?.information || "未知"}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">决策方式</h3>
              <p className="text-sm text-gray-600">{analysisResult.mbti?.dimensions?.decisions || "未知"}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">生活方式</h3>
              <p className="text-sm text-gray-600">{analysisResult.mbti?.dimensions?.lifestyle || "未知"}</p>
            </div>
          </div>
        </div>

        {/* PDP部分 */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">PDP行为偏好</h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {analysisResult.pdp?.primary || "未知"}
            </span>
          </div>
          <div className="flex items-center mb-3">
            <span className="text-gray-700">辅助类型:</span>
            <span className="ml-2 text-gray-900 font-medium">{analysisResult.pdp?.secondary || "未知"}</span>
          </div>
          <p className="text-gray-700">{analysisResult.pdp?.description || "未知描述"}</p>
        </div>

        {/* DISC部分 */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">DISC沟通风格</h2>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {analysisResult.disc?.primary || "未知"}
            </span>
          </div>
          <div className="flex items-center mb-3">
            <span className="text-gray-700">辅助类型:</span>
            <span className="ml-2 text-gray-900 font-medium">{analysisResult.disc?.secondary || "未知"}</span>
          </div>
          <p className="text-gray-700">{analysisResult.disc?.description || "未知描述"}</p>
        </div>

        {/* 面部表情部分 */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold mb-2">面部表情分析</h2>
          <p className="text-gray-700 mb-3">{analysisResult.facialExpressions?.overall || "未知"}</p>

          <h3 className="font-medium text-gray-900 mb-2">主要情绪:</h3>
          <div className="flex flex-wrap gap-2">
            {analysisResult.facialExpressions?.emotions?.map((emotion: string, index: number) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {emotion}
              </span>
            )) || "未检测到情绪"}
          </div>
        </div>

        {/* 高级分析部分 - 锁定状态 */}
        {!isPremium && (
          <div className="p-4 border-b">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <Lock className="h-5 w-5 text-gray-500 mr-2" />
                <h2 className="text-lg font-bold text-gray-700">高级分析内容</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-full h-4 bg-gray-200 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-gray-500">盖洛普优势Top5</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-full h-4 bg-gray-200 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-gray-500">职业匹配度分析</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-full h-4 bg-gray-200 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-gray-500">潜在盲区提示</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-full h-4 bg-gray-200 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-gray-500">团队角色建议</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                购买完整报告，解锁所有高级分析内容，深入了解自己的性格特质和潜能
              </p>
              <Button onClick={handleBuyFullReport} className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                购买完整报告 (¥198)
              </Button>
            </div>
          </div>
        )}

        {/* 行动号召 */}
        <div className="p-4 mt-4">
          <Button
            onClick={handleGetDetailedTest}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center"
          >
            <span>获取更深入、个性化的测试</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-center text-sm text-gray-500 mt-2">预计完成时间: 25分钟</p>
        </div>
      </div>

      {/* 底部导航 */}
      <BottomNav currentPath="/report" />
    </div>
  )
}
