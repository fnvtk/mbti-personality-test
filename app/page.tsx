"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import BottomNav from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Building, ChevronRight } from "lucide-react"

export default function MainPage() {
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

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      {/* 标题栏 */}
      <div className="px-4 py-3 flex items-center justify-between bg-white border-b border-gray-100">
        <h1 className="text-[17px] font-medium text-center flex-1" onClick={handleTitleClick}>
          神仙团队AI性格测试
          {isEnterpriseMode && <span className="text-xs ml-1 text-purple-600">(企业版)</span>}
        </h1>
        <div className="flex items-center gap-3">
          <button className="text-[#576b95]" onClick={toggleEnterpriseMode}>
            <Building className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isEnterpriseMode ? (
        // 企业版首页
        <div className="flex-1 flex flex-col">
          {/* 主图区域 */}
          <div className="relative w-full flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
            {/* 背景装饰 */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>

            {/* 圆形主图 */}
            <div className="relative w-[85%] aspect-square max-w-[400px] rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden">
              <Image
                src="/images/mbti-team-types.png"
                alt="团队性格类型分析"
                fill
                className="object-contain p-6"
                priority
              />

              {/* 浮动标签 */}
              <div className="absolute top-[10%] right-[5%] animate-fade-in">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-purple-100">
                  <span className="text-purple-600 text-sm font-medium">团队性格分析</span>
                </div>
              </div>

              <div className="absolute bottom-[15%] left-[5%] animate-fade-in delay-300">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-purple-100">
                  <span className="text-purple-600 text-sm font-medium">人才匹配</span>
                </div>
              </div>

              <div className="absolute bottom-[10%] right-[8%] animate-fade-in delay-600">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-purple-100">
                  <span className="text-purple-600 text-sm font-medium">团队优化</span>
                </div>
              </div>
            </div>
          </div>

          {/* 企业版功能按钮 */}
          <div className="px-6 py-6 space-y-4 bg-white">
            <Button
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl font-medium text-lg shadow-lg"
              onClick={() => router.push("/camera")}
            >
              开始AI面部测试
            </Button>
            <Button
              variant="outline"
              className="w-full py-4 border-2 border-purple-300 text-purple-700 hover:bg-purple-50 rounded-2xl font-medium text-lg bg-transparent"
              onClick={() => router.push("/resume-upload-enterprise")}
            >
              上传候选人简历
            </Button>
            <div className="pt-2">
              <Button
                variant="link"
                className="w-full text-purple-600 flex items-center justify-center hover:text-purple-700"
                onClick={() => router.push("/enterprise-dashboard")}
              >
                <span>进入企业管理后台</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // 个人版首页
        <div className="flex-1 flex flex-col">
          {/* 主图区域 */}
          <div className="relative w-full flex-1 flex items-center justify-center bg-gradient-to-br from-pink-50 via-red-50 to-orange-50">
            {/* 背景装饰 */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 right-10 w-32 h-32 bg-red-200 rounded-full opacity-20 animate-bounce"></div>
              <div className="absolute bottom-32 left-8 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-bounce delay-500"></div>
              <div className="absolute top-1/2 left-4 w-16 h-16 bg-orange-200 rounded-full opacity-20 animate-bounce delay-1000"></div>
            </div>

            {/* 圆形主图 */}
            <div className="relative w-[85%] aspect-square max-w-[400px] rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden">
              <Image
                src="/images/mbti-team-image.png"
                alt="MBTI性格类型"
                fill
                className="object-contain p-6"
                priority
              />

              {/* 浮动标签 */}
              <div className="absolute top-[12%] right-[8%] animate-fade-in">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-red-100">
                  <span className="text-red-600 text-sm font-medium">MBTI性格分析</span>
                </div>
              </div>

              <div className="absolute bottom-[20%] left-[8%] animate-fade-in delay-300">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-red-100">
                  <span className="text-red-600 text-sm font-medium">性格匹配</span>
                </div>
              </div>

              <div className="absolute bottom-[12%] right-[10%] animate-fade-in delay-600">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-red-100">
                  <span className="text-red-600 text-sm font-medium">特质评估</span>
                </div>
              </div>
            </div>
          </div>

          {/* 测试流程 */}
          <div className="px-6 py-6 bg-white">
            <h3 className="text-xl font-bold text-center text-red-600 mb-6">测试流程</h3>

            <div className="relative flex items-center justify-between mb-8">
              {/* 连接线 */}
              <div className="absolute left-0 right-0 top-6 h-0.5 bg-gradient-to-r from-red-200 via-red-300 to-red-200"></div>

              {/* 步骤1 */}
              <div className="relative flex flex-col items-center bg-white px-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg mb-3 shadow-lg">
                  1
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-xs mb-1">STEP1</div>
                  <div className="font-medium text-sm">拍摄照片</div>
                </div>
              </div>

              {/* 步骤2 */}
              <div className="relative flex flex-col items-center bg-white px-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-lg mb-3 shadow-lg">
                  2
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-xs mb-1">STEP2</div>
                  <div className="font-medium text-sm">AI分析</div>
                </div>
              </div>

              {/* 步骤3 */}
              <div className="relative flex flex-col items-center bg-white px-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-lg mb-3 shadow-lg">
                  3
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-xs mb-1">STEP3</div>
                  <div className="font-medium text-sm">性格测试</div>
                </div>
              </div>
            </div>

            {/* 开始测试按钮 */}
            <Button
              className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl font-medium text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => router.push("/camera")}
            >
              开始AI面部测试
            </Button>
          </div>
        </div>
      )}

      {/* 底部导航 */}
      <BottomNav currentPath="/" />
    </div>
  )
}
