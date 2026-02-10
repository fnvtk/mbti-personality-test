"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, History, FileText, Camera, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import { getDatabase } from "@/lib/database"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BottomNav from "@/components/bottom-nav"

export default function HistoryPage() {
  const router = useRouter()
  const [testResults, setTestResults] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // 获取当前用户ID
    const userId = sessionStorage.getItem("currentUserId")
    if (userId) {
      setIsLoggedIn(true)
      // 获取用户测试记录
      const db = getDatabase()
      const user = db.getUserById(userId)
      if (user) {
        setTestResults(user.testResults || [])
      }
    } else {
      router.push("/login")
    }
  }, [router])

  // 格式化日期
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  // 获取测试类型名称
  const getTestTypeName = (type: string) => {
    switch (type) {
      case "mbti":
        return "MBTI性格测试"
      case "pdp":
        return "PDP行为偏好测试"
      case "disc":
        return "DISC性格测试"
      case "face":
        return "面相分析"
      default:
        return "未知测试"
    }
  }

  // 获取测试结果文本
  const getResultText = (result: any, type: string) => {
    switch (type) {
      case "mbti":
        return result?.type || "未知类型"
      case "pdp":
        return `${result?.primary || "未知"} + ${result?.secondary || "未知"}`
      case "disc":
        return `${result?.primary || "未知"} + ${result?.secondary || "未知"}`
      case "face":
        return result?.data?.mbti?.type || "分析完成"
      default:
        return "未知结果"
    }
  }

  // 获取图标
  const getIcon = (type: string) => {
    switch (type) {
      case "mbti":
        return <FileText className="h-5 w-5 text-purple-500" />
      case "pdp":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "disc":
        return <FileText className="h-5 w-5 text-green-500" />
      case "face":
        return <Camera className="h-5 w-5 text-pink-500" />
      default:
        return <History className="h-5 w-5 text-gray-500" />
    }
  }

  // 获取价格
  const getPrice = (test: any) => {
    if (test.paid) {
      return test.price || "¥19.9"
    }
    return "免费"
  }

  // 根据类型筛选测试结果
  const filteredResults = activeTab === "all" ? testResults : testResults.filter((test) => test.testType === activeTab)

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-5 py-3 flex items-center bg-white">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="flex-1 text-center text-[17px] mr-10">我的测试记录</h1>
      </div>

      {/* 测试类型标签 */}
      <div className="p-4 bg-white border-b">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="mbti">MBTI</TabsTrigger>
            <TabsTrigger value="pdp">PDP</TabsTrigger>
            <TabsTrigger value="disc">DISC</TabsTrigger>
            <TabsTrigger value="face">面相</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        {!isLoggedIn ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-500 mb-4">请先登录</p>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => router.push("/login")}>
              去登录
            </Button>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <History className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500">暂无{activeTab === "all" ? "" : getTestTypeName(activeTab)}历史记录</p>
            <Button className="mt-4 bg-purple-600 hover:bg-purple-700" onClick={() => router.push("/ai-test")}>
              开始测试
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredResults.map((test, index) => (
              <Card
                key={index}
                className="p-4 hover:border-purple-200 cursor-pointer"
                onClick={() => router.push(`/test-result/${test.id}`)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                    {getIcon(test.testType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{getTestTypeName(test.testType)}</h3>
                      <div className="flex items-center">
                        {test.paid ? (
                          <div className="flex items-center mr-2">
                            <CreditCard className="h-3 w-3 text-purple-500 mr-1" />
                            <span className="text-xs text-purple-600 font-medium">{getPrice(test)}</span>
                          </div>
                        ) : null}
                        <Badge
                          className={`
                          ${test.testType === "mbti" ? "bg-purple-100 text-purple-800" : ""}
                          ${test.testType === "pdp" ? "bg-blue-100 text-blue-800" : ""}
                          ${test.testType === "disc" ? "bg-green-100 text-green-800" : ""}
                          ${test.testType === "face" ? "bg-pink-100 text-pink-800" : ""}
                        `}
                        >
                          {getResultText(test.result, test.testType)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">测试时间: {formatDate(test.timestamp)}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav currentPath="/profile" />
    </div>
  )
}
