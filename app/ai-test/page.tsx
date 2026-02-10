"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, FileText } from "lucide-react"
import BottomNav from "@/components/bottom-nav"
import Image from "next/image"

export default function AITestPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // 检查用户是否已登录
    const userId = sessionStorage.getItem("currentUserId")
    setIsLoggedIn(!!userId)
  }, [])

  const handleStartTest = () => {
    if (!isLoggedIn) {
      // 如果未登录，跳转到登录页面
      router.push("/login")
      return
    }

    // 已登录，跳转到相机页面开始测试
    router.push("/camera")
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      <div className="p-4 bg-white">
        <h1 className="text-lg font-medium text-center">AI面部性格测试</h1>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* 测试介绍 */}
        <div className="mb-8 text-center">
          <div className="relative w-40 h-40 mx-auto mb-4">
            <Image src="/images/mbti-team-image.png" alt="AI面部性格测试" fill className="object-contain" />
          </div>
          <h2 className="text-xl font-bold mb-2">AI面部性格分析</h2>
          <p className="text-gray-600">
            通过AI技术分析您的面部特征，生成专业的MBTI、PDP和DISC性格测试报告，帮助您更好地了解自己。
          </p>
        </div>

        {/* 测试流程 */}
        <Card className="p-4 mb-8">
          <h3 className="font-medium mb-4">测试流程</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-purple-600 font-medium">1</span>
              </div>
              <div>
                <p className="font-medium">拍摄照片</p>
                <p className="text-sm text-gray-500">拍摄正面、左侧45°和右侧45°三张照片</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-purple-600 font-medium">2</span>
              </div>
              <div>
                <p className="font-medium">AI分析</p>
                <p className="text-sm text-gray-500">AI技术分析面部特征和表情</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-purple-600 font-medium">3</span>
              </div>
              <div>
                <p className="font-medium">查看报告</p>
                <p className="text-sm text-gray-500">获取详细的性格分析报告</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 开始测试按钮 */}
        <Button className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-lg" onClick={handleStartTest}>
          <Camera className="mr-2 h-5 w-5" />
          开始AI面部测试
        </Button>

        {/* 其他测试选项 */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3">其他测试选项</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12" onClick={() => router.push("/ai-test/mbti")}>
              <FileText className="mr-2 h-4 w-4" />
              MBTI问卷测试
            </Button>
            <Button variant="outline" className="h-12" onClick={() => router.push("/ai-test/pdp")}>
              <FileText className="mr-2 h-4 w-4" />
              PDP行为测试
            </Button>
          </div>
        </div>
      </div>

      <BottomNav currentPath="/ai-test" />
    </div>
  )
}
