"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Share2, Home, RotateCcw, Briefcase, Users, TrendingUp } from "lucide-react"
import { pdpDescriptions } from "@/data/pdp-questions"
import { cn } from "@/lib/utils"
import BottomNav from "@/components/bottom-nav"

export default function PDPResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedResult = localStorage.getItem("pdpResult")
    if (storedResult) {
      setResult(JSON.parse(storedResult))
    }
    setIsLoading(false)
  }, [])

  const handleRetake = () => {
    localStorage.removeItem("pdpResult")
    router.push("/test/pdp")
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 rounded-full bg-amber-200 mx-auto mb-4" />
          <p className="text-gray-500">加载结果中...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-white p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">暂无测试结果</h2>
          <p className="text-gray-500 mb-6">完成PDP测试后即可查看分析</p>
          <Button className="bg-amber-500" onClick={() => router.push("/test/pdp")}>
            开始测试
          </Button>
        </div>
      </div>
    )
  }

  const desc = result.description
  const typeColors: Record<string, string> = {
    Tiger: "from-amber-500 to-orange-500",
    Peacock: "from-purple-500 to-pink-500",
    Koala: "from-green-500 to-emerald-500",
    Owl: "from-blue-500 to-indigo-500",
    Chameleon: "from-teal-500 to-cyan-500",
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-white">
      <header className="glass-nav sticky top-0 z-40 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-[17px] font-semibold">PDP测试结果</h1>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto pb-24 p-4">
        {/* 类型展示卡片 */}
        <Card className="glass-card overflow-hidden animate-fade-in mb-4">
          <div className={cn("p-6 text-white text-center bg-gradient-to-r", typeColors[result.dominantType])}>
            <div className="text-6xl mb-2">{desc.emoji}</div>
            <h2 className="text-3xl font-bold mb-1">{desc.type}</h2>
            <p className="text-xl font-medium opacity-90">{desc.title}</p>
            {result.secondaryType && (
              <p className="text-sm opacity-80 mt-2">
                辅助类型: {pdpDescriptions[result.secondaryType as keyof typeof pdpDescriptions]?.type}
              </p>
            )}
          </div>
          <CardContent className="p-5">
            <p className="text-gray-700 leading-relaxed text-sm">{desc.description}</p>
          </CardContent>
        </Card>

        {/* 维度分布 */}
        <Card className="glass-card mb-4 animate-fade-in delay-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              性格分布
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(result.percentages).map(([type, percentage]) => {
              const typeDesc = pdpDescriptions[type as keyof typeof pdpDescriptions]
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium flex items-center gap-1">
                      <span>{typeDesc?.emoji}</span>
                      {typeDesc?.type || type}
                    </span>
                    <span>{percentage as number}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={cn("h-2 rounded-full bg-gradient-to-r", typeColors[type])}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* 优势与挑战 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="glass-card animate-fade-in delay-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                <span className="text-green-500">✓</span> 优势
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {desc.strengths?.slice(0, 3).map((s: string, i: number) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="glass-card animate-fade-in delay-300">
            <CardContent className="p-4">
              <h4 className="font-medium text-amber-700 mb-2 flex items-center gap-1">
                <span className="text-amber-500">!</span> 挑战
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {desc.weaknesses?.slice(0, 3).map((s: string, i: number) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* 职业建议 */}
        <Card className="glass-card mb-4 animate-fade-in delay-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-500" />
              推荐职业
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {desc.careers?.map((career: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-sm">
                  {career}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 团队角色 */}
        <Card className="glass-card mb-4 animate-fade-in delay-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              团队角色
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">{desc.teamRole}</p>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleRetake}>
              <RotateCcw className="w-4 h-4 mr-2" />
              重新测试
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              <Home className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </div>
        </div>
      </main>

      <BottomNav currentPath="/pdp-result" />
    </div>
  )
}
