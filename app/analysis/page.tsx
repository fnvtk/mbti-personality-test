"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Share2, Download, ChevronRight } from "lucide-react"
import BottomNav from "@/components/bottom-nav"
import { cn } from "@/lib/utils"

export default function AnalysisPage() {
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [progress, setProgress] = useState(0)
  const [photos, setPhotos] = useState<string[]>([])
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  useEffect(() => {
    // 获取照片数据
    const storedPhotos = sessionStorage.getItem("uploadedPhotoUrls")
    if (storedPhotos) {
      setPhotos(JSON.parse(storedPhotos))
    }

    // 模拟AI分析过程
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setIsAnalyzing(false)
          // 设置模拟分析结果
          setAnalysisResult({
            mbti: "INTJ",
            mbtiName: "战略家",
            pdpMain: "老虎",
            pdpSub: "猫头鹰",
            disc: "D型(支配型)",
            discSub: "C型(谨慎型)",
            strengths: ["战略思维", "执行力", "影响力"],
            summary: "此人具有较强的逻辑分析能力和独立思考能力，目标明确，执行力强。善于规划，注重细节，追求完美。在人际关系方面较为直接，建议注重沟通技巧。",
            faceAnalysis: {
              forehead: "较为饱满，智慧较高，善于思考，发际线略高，整体格局良好。",
              eyes: "目光清澈，思维活跃，具有洞察力，眼距适中，眼神坚定。",
              nose: "鼻梁平直，不易受挫，有一定的理财能力和决策能力。",
              mouth: "嘴唇适中，不轻易妥协，言语表达较为客观冷静。",
              chin: "下巴轮廓清晰，晚年运势较好，具有领导能力和决断力。",
            },
            careers: ["战略咨询顾问", "项目经理", "数据分析师", "系统架构师", "研究员"],
            relationships: "在人际关系方面，此人可能较为直接，不善于表达情感。建议在团队协作中，适当展现自己的思考过程，多倾听他人意见，注重沟通技巧。"
          })
          return 100
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(timer)
  }, [])

  // 分析进度页面
  if (isAnalyzing) {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
        <header className="glass-nav sticky top-0 z-40 px-4 py-3">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="flex-1 text-center text-lg font-semibold mr-10">AI分析中</h1>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-xs">
            {/* 照片预览 */}
            <div className="flex justify-center gap-2 mb-8">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`照片${index + 1}`}
                    className="w-20 h-20 rounded-xl object-cover shadow-lg"
                  />
                  {progress > (index + 1) * 30 && (
                    <div className="absolute inset-0 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 进度环 */}
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 2.83} 283`}
                  className="transition-all duration-300"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-purple-600">{progress}%</span>
              </div>
            </div>

            {/* 分析状态 */}
            <div className="text-center">
              <p className="text-lg font-medium text-gray-800 mb-2">
                {progress < 30 ? "正在识别面部特征..." :
                 progress < 60 ? "正在分析性格特质..." :
                 progress < 90 ? "正在生成报告..." : "分析完成!"}
              </p>
              <p className="text-sm text-gray-500">
                AI正在结合多维度理论进行综合分析
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // 分析结果页面
  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      <header className="glass-nav sticky top-0 z-40 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">面相分析报告</h1>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24 overflow-auto">
        {/* 分析完成提示 */}
        <div className="bg-green-50 p-3 rounded-xl flex items-center mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          <p className="text-green-700 text-sm">分析完成，以下是您的个性化报告</p>
        </div>

        {/* 性格类型卡片 */}
        <Card className="glass-card p-6 mb-4 animate-fade-in">
          <h2 className="text-center font-bold mb-4">性格类型分析</h2>
          <div className="text-center">
            <div className="text-5xl font-bold text-purple-600 mb-1">{analysisResult?.mbti}</div>
            <div className="text-gray-600 mb-4">{analysisResult?.mbtiName}</div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-purple-50 p-3 rounded-xl">
              <div className="text-center text-sm text-gray-600 mb-1">PDP主性格</div>
              <div className="text-center font-bold text-purple-700">{analysisResult?.pdpMain}</div>
              <div className="text-center text-xs text-gray-500">辅助: {analysisResult?.pdpSub}</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <div className="text-center text-sm text-gray-600 mb-1">DISC类型</div>
              <div className="text-center font-bold text-blue-700">{analysisResult?.disc}</div>
              <div className="text-center text-xs text-gray-500">辅助: {analysisResult?.discSub}</div>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-xl mb-4">
            <div className="text-center text-sm text-gray-600 mb-2">主要优势</div>
            <div className="flex justify-around">
              {analysisResult?.strengths?.map((strength: string, index: number) => (
                <div key={index} className="text-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1" />
                  <div className="text-xs font-medium">{strength}</div>
                </div>
              ))}
            </div>
          </div>

          <Button 
            className="w-full gradient-enterprise text-white"
            onClick={() => router.push("/test/mbti")}
          >
            下一步：详细性格测试 →
          </Button>
        </Card>

        {/* 性格概述 */}
        <Card className="glass-card p-6 mb-4 animate-fade-in delay-100">
          <h2 className="font-bold mb-3">性格概述</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{analysisResult?.summary}</p>
        </Card>

        {/* 面相/骨相分析标签页 */}
        <Tabs defaultValue="face" className="mb-4 animate-fade-in delay-200">
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="face">面相分析</TabsTrigger>
            <TabsTrigger value="bone">骨相分析</TabsTrigger>
          </TabsList>

          <TabsContent value="face">
            <Card className="glass-card p-6">
              <h2 className="font-bold mb-4">面部特征分析</h2>
              <div className="text-sm text-gray-600 space-y-3">
                {Object.entries(analysisResult?.faceAnalysis || {}).map(([key, value]) => (
                  <p key={key}>
                    <span className="font-medium text-gray-800">
                      {key === "forehead" ? "额头" :
                       key === "eyes" ? "眼睛" :
                       key === "nose" ? "鼻子" :
                       key === "mouth" ? "嘴巴" : "下巴"}：
                    </span>
                    {value as string}
                  </p>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="bone">
            <Card className="glass-card p-6">
              <h2 className="font-bold mb-4">骨相特征分析</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                骨骼轮廓显示出较强的意志力和执行力，头骨形状表明逻辑思维能力出色，
                颧骨位置适中显示出良好的社交能力，下颌骨线条分明展现出坚定的决心。
              </p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 职业发展建议 */}
        <Card className="glass-card p-6 mb-4 animate-fade-in delay-300">
          <h2 className="font-bold mb-4">职业发展建议</h2>
          <div className="space-y-2">
            {analysisResult?.careers?.map((career: string, index: number) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                <div className="text-gray-800">{career}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* 人际关系建议 */}
        <Card className="glass-card p-6 mb-4 animate-fade-in delay-400">
          <h2 className="font-bold mb-4">人际关系与团队合作</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{analysisResult?.relationships}</p>
        </Card>

        {/* 操作按钮 */}
        <div className="space-y-3 animate-fade-in delay-500">
          <Button 
            className="w-full gradient-personal text-white py-5"
            onClick={() => router.push("/test/mbti")}
          >
            继续完成MBTI测试
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              下载报告
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              分享结果
            </Button>
          </div>
        </div>
      </main>

      <BottomNav currentPath="/analysis" />
    </div>
  )
}
