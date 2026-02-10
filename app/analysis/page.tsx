"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import BottomNav from "@/components/bottom-nav"

export default function AnalysisPage() {
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [progress, setProgress] = useState(0)
  const [analysisComplete, setAnalysisComplete] = useState(false)

  useEffect(() => {
    // 模拟分析过程
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setIsAnalyzing(false)
          setAnalysisComplete(true)
          return 100
        }
        return prev + 5
      })
    }, 200)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="px-5 py-3 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">面相分析报告</h1>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {/* 分析状态 */}
        <div className="bg-green-50 p-3 rounded-md flex items-center mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <p className="text-green-700 text-sm">分析完成，以下是您的个性化报告</p>
        </div>

        {/* 性格类型分析卡片 */}
        <Card className="p-6 mb-4">
          <h2 className="text-center font-bold mb-4">性格类型分析</h2>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-1">INTJ</div>
            <div className="text-gray-600 mb-4">战略家</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-center text-sm text-gray-600 mb-1">PDP主性格</div>
              <div className="text-center font-bold text-purple-700">老虎</div>
              <div className="text-center text-xs text-gray-500">辅助: 猫头鹰</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-center text-sm text-gray-600 mb-1">DISC类型</div>
              <div className="text-center font-bold text-blue-700">D型(支配型)</div>
              <div className="text-center text-xs text-gray-500">辅助: C型(谨慎型)</div>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-center text-sm text-gray-600 mb-2">主要优势</div>
            <div className="flex justify-around">
              <div className="text-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
                <div className="text-xs font-medium">战略思维</div>
              </div>
              <div className="text-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
                <div className="text-xs font-medium">执行力</div>
              </div>
              <div className="text-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
                <div className="text-xs font-medium">影响力</div>
              </div>
            </div>
          </div>

          <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700" onClick={() => router.push("/test/mbti")}>
            下一步：详细性格测试 →
          </Button>
        </Card>

        {/* 性格概述 */}
        <Card className="p-6 mb-4">
          <h2 className="font-bold mb-4">性格概述</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            此人具有较强的逻辑分析能力和独立思考能力，目标明确，执行力强，但可能在人际沟通方面略显不足。善于规划，注重细节，追求完美，有一定的控制欲。
          </p>
        </Card>

        {/* 面相分析和骨相分析标签 */}
        <div className="flex border-b mb-4">
          <button className="flex-1 py-2 text-center border-b-2 border-purple-600 font-medium">面相分析</button>
          <button className="flex-1 py-2 text-center text-gray-500">骨相分析</button>
        </div>

        {/* 面部特征分析 */}
        <Card className="p-6 mb-4">
          <h2 className="font-bold mb-4">面部特征分析</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <span className="font-medium">额头：</span>
              较为饱满，智慧较高，善于思考，发际线略高，可能在早年运势上有阻碍，但整体格局良好。
            </p>
            <p>
              <span className="font-medium">眼睛：</span>
              目光清澈，思维活跃，具有洞察力，眼距适中，眼神坚定，不轻易受外界干扰。
            </p>
            <p>
              <span className="font-medium">鼻子：</span>
              鼻梁平直，不易受挫，有一定的理财能力和决策能力，鼻翼稳定，有主见，事业心强，善于把握机会。
            </p>
            <p>
              <span className="font-medium">嘴巴：</span>
              嘴唇适中，不轻易妥协，有一定的创造性，唇形薄薄适中，言语表达较为客观冷静。
            </p>
            <p>
              <span className="font-medium">下巴：</span>下巴轮廓清晰，晚年运势较好，具有一定的领导能力和决断力。
            </p>
          </div>
        </Card>

        {/* 职业发展建议 */}
        <Card className="p-6 mb-4">
          <h2 className="font-bold mb-4">职业发展建议</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <div className="text-gray-800">战略咨询顾问</div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <div className="text-gray-800">项目经理</div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <div className="text-gray-800">数据分析师</div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <div className="text-gray-800">系统架构师</div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <div className="text-gray-800">研究员</div>
            </div>
          </div>
        </Card>

        {/* 人际关系与团队合作 */}
        <Card className="p-6 mb-4">
          <h2 className="font-bold mb-4">人际关系与团队合作</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            在人际关系方面，此人可能较为直接，不善于表达情感，容易给人冷漠的印象。建议在团队协作中，适当展现自己的思考过程，多倾听他人的意见，注重沟通技巧，以增强团队凝聚力。可以尝试学习一些人际交往技巧，更有助于事业发展。
          </p>
        </Card>

        {/* 盘活潜能 */}
        <Card className="p-6 mb-4">
          <h2 className="font-bold mb-4">盘活潜能（完整）</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>战略思维</li>
            <li>执行力</li>
            <li>影响力</li>
          </ul>
        </Card>

        {/* 付费入口 - 测试完+看完报告后才显示 */}
        <Card className="p-6 mb-4 bg-gradient-to-r from-purple-50 to-rose-50 border-purple-200">
          <div className="text-center">
            <h2 className="font-bold text-lg mb-2">解锁完整深度报告</h2>
            <p className="text-sm text-gray-600 mb-4">
              获取更详细的性格解读、职业建议、团队匹配度分析
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-3xl font-bold text-purple-600">¥198</span>
              <span className="text-sm text-gray-400 line-through">¥398</span>
            </div>
            <div className="space-y-2">
              <button 
                onClick={() => window.location.href = '/payment?plan=personal&price=198'}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-rose-500 text-white rounded-xl font-bold"
              >
                立即解锁完整报告
              </button>
              <p className="text-xs text-gray-400">包含：AI深度面相 + MBTI + PDP + DISC + 盖洛普优势</p>
            </div>
          </div>
        </Card>

        {/* 分享赚佣金 */}
        <Card className="p-4 mb-12 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm text-green-700">分享赚佣金</p>
              <p className="text-xs text-green-600">好友付费你赚30%</p>
            </div>
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium"
            >
              分享给好友
            </button>
          </div>
        </Card>
      </div>

      <BottomNav currentPath="/analysis" />
    </div>
  )
}
