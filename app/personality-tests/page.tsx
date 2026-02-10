"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Check } from "lucide-react"
import BottomNav from "@/components/bottom-nav"

export default function PersonalityTestsPage() {
  const router = useRouter()
  const [completedTests, setCompletedTests] = useState({
    mbti: true,
    pdp: true,
    disc: true,
  })

  const allTestsCompleted = completedTests.mbti && completedTests.pdp && completedTests.disc

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="px-5 py-3 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">性格测试</h1>
      </div>

      {/* 测试进度 */}
      <div className="p-4 border-b">
        <div className="mb-2 text-lg font-medium">测试进度</div>
        <div className="text-gray-600">已完成 {Object.values(completedTests).filter(Boolean).length}/3 项测试</div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {/* MBTI测试 */}
        <Card className={`p-4 border-2 ${completedTests.mbti ? "border-green-500" : "border-gray-200"}`}>
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              {completedTests.mbti ? (
                <Check className="h-6 w-6 text-green-500" />
              ) : (
                <span className="text-purple-600 font-bold">M</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium">MBTI性格测试</h3>
              <p className="text-gray-500 text-sm mt-1">了解您的性格倾向和行为模式</p>
              <div className="text-xs text-gray-400 mt-1">约15分钟 · 90个问题</div>
            </div>
            <div>
              <Button
                variant={completedTests.mbti ? "outline" : "default"}
                className={completedTests.mbti ? "text-purple-600" : ""}
                onClick={() => router.push("/test/mbti")}
              >
                {completedTests.mbti ? "重测" : "开始"}
              </Button>
            </div>
          </div>
          {completedTests.mbti && (
            <div className="mt-2 ml-16">
              <span className="text-green-600 text-sm">已完成</span>
            </div>
          )}
        </Card>

        {/* PDP测试 */}
        <Card className={`p-4 border-2 ${completedTests.pdp ? "border-green-500" : "border-gray-200"}`}>
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              {completedTests.pdp ? (
                <Check className="h-6 w-6 text-green-500" />
              ) : (
                <span className="text-blue-600 font-bold">P</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium">PDP行为偏好测试</h3>
              <p className="text-gray-500 text-sm mt-1">评估您的行为偏好和思维方式</p>
              <div className="text-xs text-gray-400 mt-1">约10分钟 · 30个问题</div>
            </div>
            <div>
              <Button
                variant={completedTests.pdp ? "outline" : "default"}
                className={completedTests.pdp ? "text-purple-600" : ""}
                onClick={() => router.push("/test/pdp")}
              >
                {completedTests.pdp ? "重测" : "开始"}
              </Button>
            </div>
          </div>
          {completedTests.pdp && (
            <div className="mt-2 ml-16">
              <span className="text-green-600 text-sm">已完成</span>
            </div>
          )}
        </Card>

        {/* DISC测试 */}
        <Card className={`p-4 border-2 ${completedTests.disc ? "border-green-500" : "border-gray-200"}`}>
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              {completedTests.disc ? (
                <Check className="h-6 w-6 text-green-500" />
              ) : (
                <span className="text-green-600 font-bold">D</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium">DISC沟通风格测试</h3>
              <p className="text-gray-500 text-sm mt-1">测量您的情绪反应和沟通风格</p>
              <div className="text-xs text-gray-400 mt-1">约12分钟 · 40个问题</div>
            </div>
            <div>
              <Button
                variant={completedTests.disc ? "outline" : "default"}
                className={completedTests.disc ? "text-purple-600" : ""}
                onClick={() => router.push("/test/disc")}
              >
                {completedTests.disc ? "重测" : "开始"}
              </Button>
            </div>
          </div>
          {completedTests.disc && (
            <div className="mt-2 ml-16">
              <span className="text-green-600 text-sm">已完成</span>
            </div>
          )}
        </Card>

        {/* 下一步按钮 */}
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t">
          <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white" onClick={() => router.push("/report")}>
              下一步：深度解析（付费）
            </Button>
            <Button
              variant="outline"
              className="w-full border-red-500 text-red-500 hover:bg-red-50"
              onClick={() => router.push("/")}
            >
              跳过
            </Button>
          </div>
        </div>
      </div>

      <BottomNav currentPath="/ai-test" />
    </div>
  )
}
