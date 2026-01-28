"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, Share2, Download, Home, Briefcase, Heart, 
  Sparkles, TrendingUp, TrendingDown, RotateCcw, ChevronRight
} from "lucide-react"
import { mbtiDescriptions } from "@/data/mbti-descriptions"
import { MBTI_DESCRIPTIONS } from "@/lib/mbti-calculator"
import { cn } from "@/lib/utils"
import BottomNav from "@/components/bottom-nav"

interface MBTIResult {
  type: string
  dimensions: {
    E: number
    I: number
    S: number
    N: number
    T: number
    F: number
    J: number
    P: number
  }
  confidence: number
  description: { name: string; category: string }
  dominantDimensions: {
    energySource: string
    informationGathering: string
    decisionMaking: string
    lifestyle: string
  }
  dimensionStrengths: {
    EI: number
    SN: number
    TF: number
    JP: number
  }
  testDuration: number
  completedAt: string
}

export default function MBTIResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<MBTIResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 从localStorage获取结果
    const storedResult = localStorage.getItem("mbtiResult")
    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult)
        setResult(parsed)
      } catch (e) {
        console.error("解析结果失败:", e)
      }
    }
    setIsLoading(false)
  }, [])

  // 重新测试
  const handleRetake = () => {
    localStorage.removeItem("mbtiResult")
    localStorage.removeItem("mbtiAnswers")
    router.push("/test/mbti")
  }

  // 分享结果
  const handleShare = async () => {
    if (!result) return
    
    const shareData = {
      title: `我的MBTI类型是 ${result.type}`,
      text: `我是${MBTI_DESCRIPTIONS[result.type as keyof typeof MBTI_DESCRIPTIONS]?.name || result.type}型人格！来测测你的MBTI类型吧～`,
      url: window.location.origin,
    }
    
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (e) {
        console.log("分享取消")
      }
    } else {
      // 复制到剪贴板
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
      alert("链接已复制到剪贴板")
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-white">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 rounded-full bg-rose-200 mx-auto mb-4" />
          <p className="text-gray-500">加载结果中...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-white p-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">暂无测试结果</h2>
          <p className="text-gray-500 mb-6">完成MBTI测试后即可查看您的性格类型分析</p>
          <Button
            className="gradient-personal text-white"
            onClick={() => router.push("/test/mbti")}
          >
            开始测试
          </Button>
        </div>
      </div>
    )
  }

  // 获取详细描述
  const typeDescription = mbtiDescriptions[result.type as keyof typeof mbtiDescriptions]
  const typeInfo = MBTI_DESCRIPTIONS[result.type as keyof typeof MBTI_DESCRIPTIONS]

  // 维度数据
  const dimensionData = [
    { 
      label: "E-I", 
      name: "能量来源",
      left: { key: "E", label: "外向", value: result.dimensions.E },
      right: { key: "I", label: "内向", value: result.dimensions.I },
      dominant: result.dominantDimensions.energySource,
      color: "blue"
    },
    { 
      label: "S-N", 
      name: "信息获取",
      left: { key: "S", label: "感觉", value: result.dimensions.S },
      right: { key: "N", label: "直觉", value: result.dimensions.N },
      dominant: result.dominantDimensions.informationGathering,
      color: "green"
    },
    { 
      label: "T-F", 
      name: "决策方式",
      left: { key: "T", label: "思考", value: result.dimensions.T },
      right: { key: "F", label: "情感", value: result.dimensions.F },
      dominant: result.dominantDimensions.decisionMaking,
      color: "purple"
    },
    { 
      label: "J-P", 
      name: "生活态度",
      left: { key: "J", label: "判断", value: result.dimensions.J },
      right: { key: "P", label: "感知", value: result.dimensions.P },
      dominant: result.dominantDimensions.lifestyle,
      color: "orange"
    },
  ]

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-gradient-to-b from-rose-50 to-white">
      {/* 顶部导航 */}
      <header className="glass-nav sticky top-0 z-40 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-[17px] font-semibold">测试结果</h1>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto pb-24">
        {/* 类型展示卡片 */}
        <div className="px-4 pt-6 pb-4">
          <Card className="glass-card overflow-hidden animate-fade-in">
            {/* 渐变头部 */}
            <div className="gradient-personal p-6 text-white text-center">
              <p className="text-sm opacity-90 mb-2">{typeInfo?.category || "性格类型"}</p>
              <h2 className="text-5xl font-bold tracking-wider mb-2">{result.type}</h2>
              <p className="text-xl font-medium">{typeInfo?.name || "未知类型"}</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-sm opacity-80">置信度</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {result.confidence}%
                </span>
              </div>
            </div>

            {/* 简介 */}
            <CardContent className="p-5">
              <p className="text-gray-700 leading-relaxed text-sm">
                {typeDescription?.description || "这是一个独特的性格类型，具有独特的优势和特点。"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 维度分析 */}
        <div className="px-4 pb-4">
          <Card className="glass-card animate-fade-in delay-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-rose-500" />
                维度分析
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dimensionData.map((dim, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{dim.name}</span>
                    <span className={cn(
                      "font-medium px-2 py-0.5 rounded-full text-xs",
                      dim.dominant === dim.left.key 
                        ? "bg-rose-100 text-rose-600" 
                        : "bg-blue-100 text-blue-600"
                    )}>
                      {dim.dominant === dim.left.key ? dim.left.label : dim.right.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs font-medium w-8",
                      dim.dominant === dim.left.key ? "text-rose-500" : "text-gray-400"
                    )}>
                      {dim.left.label}
                    </span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex">
                      <div 
                        className={cn(
                          "h-full transition-all duration-500",
                          dim.dominant === dim.left.key ? "bg-rose-400" : "bg-gray-300"
                        )}
                        style={{ width: `${dim.left.value}%` }}
                      />
                      <div 
                        className={cn(
                          "h-full transition-all duration-500",
                          dim.dominant === dim.right.key ? "bg-blue-400" : "bg-gray-300"
                        )}
                        style={{ width: `${dim.right.value}%` }}
                      />
                    </div>
                    <span className={cn(
                      "text-xs font-medium w-8 text-right",
                      dim.dominant === dim.right.key ? "text-blue-500" : "text-gray-400"
                    )}>
                      {dim.right.label}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{dim.left.value}%</span>
                    <span>{dim.right.value}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 详细标签页 */}
        <div className="px-4 pb-4">
          <Tabs defaultValue="strengths" className="animate-fade-in delay-300">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="strengths" className="text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                优势
              </TabsTrigger>
              <TabsTrigger value="weaknesses" className="text-sm">
                <TrendingDown className="w-4 h-4 mr-1" />
                挑战
              </TabsTrigger>
              <TabsTrigger value="careers" className="text-sm">
                <Briefcase className="w-4 h-4 mr-1" />
                职业
              </TabsTrigger>
            </TabsList>

            <TabsContent value="strengths">
              <Card className="glass-card">
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {(typeDescription?.strengths || ["善于分析", "独立思考", "追求卓越"]).map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-xs">
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weaknesses">
              <Card className="glass-card">
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {(typeDescription?.weaknesses || ["可能过于完美主义", "有时忽视他人感受"]).map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 text-xs">
                          !
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="careers">
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {(typeDescription?.careers || ["分析师", "研究员", "工程师"]).map((item, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* 人际关系 */}
        <div className="px-4 pb-4">
          <Card className="glass-card animate-fade-in delay-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                人际关系
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 leading-relaxed">
                {typeDescription?.relationships || "您在人际关系中通常表现出独特的个人魅力，善于建立深度连接。"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 操作按钮 */}
        <div className="px-4 pb-6 space-y-3">
          <Button
            className="w-full gradient-personal text-white py-5"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5 mr-2" />
            分享我的结果
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="py-4"
              onClick={handleRetake}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              重新测试
            </Button>
            <Button
              variant="outline"
              className="py-4"
              onClick={() => router.push("/")}
            >
              <Home className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </div>
        </div>
      </main>

      {/* 底部导航 */}
      <BottomNav currentPath="/mbti-result" />
    </div>
  )
}
