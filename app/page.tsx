"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import BottomNav from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Building2, ChevronRight, Sparkles, Users, FileText, BarChart3, Brain, Target, Heart, Camera, Scan } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const router = useRouter()
  const [adminClicks, setAdminClicks] = useState(0)
  const [isEnterpriseMode, setIsEnterpriseMode] = useState(false)

  // 处理标题点击，用于进入管理后台
  const handleTitleClick = () => {
    setAdminClicks((prev) => {
      const newCount = prev + 1
      // 连续点击5次进入管理后台
      if (newCount >= 5) {
        router.push("/admin")
        return 0
      }
      return newCount
    })
  }

  // 切换企业模式
  const toggleEnterpriseMode = () => {
    setIsEnterpriseMode(!isEnterpriseMode)
  }

  // 个人版测试流程步骤
  const personalSteps = [
    { step: 1, title: "选择测试", desc: "MBTI/DISC/PDP", active: true },
    { step: 2, title: "答题测试", desc: "90道专业题目", active: false },
    { step: 3, title: "获取报告", desc: "AI智能分析", active: false },
  ]

  // 企业版功能
  const enterpriseFeatures = [
    { icon: Users, title: "团队管理", desc: "成员性格档案" },
    { icon: FileText, title: "测试报告", desc: "批量导出分析" },
    { icon: BarChart3, title: "团队分析", desc: "性格分布图表" },
  ]

  return (
    <div className={cn(
      "w-full max-w-md mx-auto min-h-screen flex flex-col",
      isEnterpriseMode ? "bg-enterprise-gradient" : "bg-personal-gradient"
    )}>
      {/* 顶部导航栏 */}
      <header className="glass-nav sticky top-0 z-40 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className={cn(
              "h-5 w-5",
              isEnterpriseMode ? "text-purple-600" : "text-rose-500"
            )} />
            <h1 
              className="text-[17px] font-semibold cursor-pointer" 
              onClick={handleTitleClick}
            >
              神仙团队AI性格测试
              {isEnterpriseMode && (
                <span className="text-xs ml-1.5 text-purple-600 font-normal">(企业版)</span>
              )}
            </h1>
          </div>
          <button 
            className={cn(
              "p-2 rounded-full transition-all duration-200",
              isEnterpriseMode 
                ? "bg-purple-100 text-purple-600" 
                : "bg-gray-100 text-gray-500 hover:bg-purple-50 hover:text-purple-500"
            )}
            onClick={toggleEnterpriseMode}
            title={isEnterpriseMode ? "切换到个人版" : "切换到企业版"}
          >
            <Building2 className="h-5 w-5" />
          </button>
        </div>
      </header>

      {isEnterpriseMode ? (
        // ==================== 企业版首页 ====================
        <main className="flex-1 flex flex-col pb-24">
          {/* 主图区域 */}
          <div className="relative flex-1 flex items-center justify-center px-6 py-8">
            {/* 背景装饰 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300 rounded-full opacity-20 animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-300 rounded-full opacity-20 animate-pulse delay-1000" />
              <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-indigo-300 rounded-full opacity-10 animate-float" />
            </div>

            {/* 圆形主图 */}
            <div className="relative w-[85%] aspect-square max-w-[320px]">
              <div className="absolute inset-0 rounded-full bg-white/80 shadow-2xl backdrop-blur-sm" />
              <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center p-8">
                <Image
                  src="/images/mbti-team-types.png"
                  alt="团队性格类型分析"
                  width={280}
                  height={280}
                  className="object-contain animate-fade-in"
                  priority
                />
              </div>

              {/* 浮动标签 */}
              <div className="absolute top-[8%] right-[-5%] animate-fade-in delay-200">
                <div className="glass-tag">
                  <span className="text-purple-600 text-sm font-medium">团队性格分析</span>
                </div>
              </div>

              <div className="absolute bottom-[20%] left-[-8%] animate-fade-in delay-400">
                <div className="glass-tag">
                  <span className="text-purple-600 text-sm font-medium">人才匹配</span>
                </div>
              </div>

              <div className="absolute bottom-[5%] right-[5%] animate-fade-in delay-600">
                <div className="glass-tag">
                  <span className="text-purple-600 text-sm font-medium">团队优化</span>
                </div>
              </div>
            </div>
          </div>

          {/* 企业版功能区 */}
          <div className="px-6 pb-6 space-y-4 animate-fade-in-up">
            {/* 快捷功能 */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {enterpriseFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="glass-card p-4 text-center card-hover cursor-pointer"
                  onClick={() => router.push("/enterprise-dashboard")}
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                    <feature.icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-800">{feature.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* 主按钮 */}
            <Button
              className="w-full py-6 gradient-enterprise text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              onClick={() => router.push("/test/mbti")}
            >
              <Brain className="w-5 h-5 mr-2" />
              开始团队测试
            </Button>

            <Button
              variant="outline"
              className="w-full py-5 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 rounded-2xl font-medium text-base bg-white/50"
              onClick={() => router.push("/recruiter")}
            >
              <Target className="w-5 h-5 mr-2" />
              招聘人才匹配
            </Button>

            {/* 进入管理后台链接 */}
            <div className="pt-2 text-center">
              <Button
                variant="link"
                className="text-purple-600 flex items-center justify-center mx-auto hover:text-purple-700"
                onClick={() => router.push("/enterprise-dashboard")}
              >
                <span>进入企业管理后台</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </main>
      ) : (
        // ==================== 个人版首页 ====================
        <main className="flex-1 flex flex-col pb-24">
          {/* 主图区域 */}
          <div className="relative flex-1 flex items-center justify-center px-6 py-8">
            {/* 背景装饰 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-16 right-8 w-28 h-28 bg-rose-300 rounded-full opacity-20 animate-bounce-gentle" />
              <div className="absolute bottom-24 left-6 w-20 h-20 bg-pink-300 rounded-full opacity-20 animate-bounce-gentle delay-500" />
              <div className="absolute top-1/2 left-4 w-14 h-14 bg-orange-300 rounded-full opacity-15 animate-float delay-1000" />
            </div>

            {/* 圆形主图 */}
            <div className="relative w-[85%] aspect-square max-w-[320px]">
              <div className="absolute inset-0 rounded-full bg-white/80 shadow-2xl backdrop-blur-sm" />
              <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center p-8">
                <Image
                  src="/images/mbti-team-image.png"
                  alt="MBTI性格类型"
                  width={280}
                  height={280}
                  className="object-contain animate-fade-in"
                  priority
                />
              </div>

              {/* 浮动标签 */}
              <div className="absolute top-[10%] right-[-5%] animate-fade-in delay-200">
                <div className="glass-tag">
                  <span className="text-rose-500 text-sm font-medium">MBTI性格分析</span>
                </div>
              </div>

              <div className="absolute bottom-[22%] left-[-8%] animate-fade-in delay-400">
                <div className="glass-tag">
                  <span className="text-rose-500 text-sm font-medium">性格匹配</span>
                </div>
              </div>

              <div className="absolute bottom-[8%] right-[8%] animate-fade-in delay-600">
                <div className="glass-tag">
                  <span className="text-rose-500 text-sm font-medium">特质评估</span>
                </div>
              </div>
            </div>
          </div>

          {/* 测试流程 & 按钮区 */}
          <div className="px-6 pb-6 space-y-6 animate-fade-in-up">
            {/* 测试流程 */}
            <div className="glass-card p-5">
              <h3 className="text-lg font-bold text-center text-rose-500 mb-5">测试流程</h3>

              <div className="relative flex items-center justify-between">
                {/* 连接线 */}
                <div className="absolute left-8 right-8 top-6 h-0.5 bg-gradient-to-r from-rose-200 via-rose-300 to-rose-200" />

                {personalSteps.map((item, index) => (
                  <div key={index} className="relative flex flex-col items-center z-10 bg-transparent">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 shadow-lg transition-all duration-300",
                      item.active 
                        ? "gradient-personal scale-110" 
                        : "bg-gray-300"
                    )}>
                      {item.step}
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400 text-xs mb-0.5">STEP{item.step}</div>
                      <div className="font-medium text-sm text-gray-700">{item.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI人脸测试入口 */}
            <Button
              className="w-full py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              onClick={() => router.push("/camera")}
            >
              <Scan className="w-5 h-5 mr-2" />
              AI人脸性格分析
            </Button>

            {/* 开始测试按钮 */}
            <Button
              className="w-full py-6 gradient-personal text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              onClick={() => router.push("/test/mbti")}
            >
              <Heart className="w-5 h-5 mr-2" />
              开始MBTI测试
            </Button>

            {/* 其他测试入口 */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="py-4 border-2 border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-medium bg-white/50"
                onClick={() => router.push("/test/disc")}
              >
                DISC测试
              </Button>
              <Button
                variant="outline"
                className="py-4 border-2 border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-medium bg-white/50"
                onClick={() => router.push("/test/pdp")}
              >
                PDP测试
              </Button>
            </div>

            {/* 信任背书 */}
            <div className="text-center pt-2">
              <p className="text-gray-400 text-xs">
                已有 <span className="text-rose-500 font-bold">128,000+</span> 人完成测试
              </p>
            </div>
          </div>
        </main>
      )}

      {/* 底部导航 */}
      <BottomNav currentPath="/" isEnterprise={isEnterpriseMode} />
    </div>
  )
}
