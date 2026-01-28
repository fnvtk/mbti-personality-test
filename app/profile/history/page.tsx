"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, FileText, ChevronRight, Calendar, Award } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TestHistoryPage() {
  const router = useRouter()

  const testHistory = [
    {
      id: 1,
      type: "MBTI测试",
      result: "INTJ",
      resultName: "战略家",
      date: "2026-01-28",
      time: "10:30",
      confidence: 87,
      color: "purple",
    },
    {
      id: 2,
      type: "AI人脸测试",
      result: "ENTJ",
      resultName: "指挥官",
      date: "2026-01-27",
      time: "15:20",
      confidence: 82,
      color: "rose",
    },
    {
      id: 3,
      type: "DISC测试",
      result: "D型",
      resultName: "支配型",
      date: "2026-01-25",
      time: "09:15",
      confidence: 90,
      color: "blue",
    },
    {
      id: 4,
      type: "PDP测试",
      result: "老虎",
      resultName: "领导型",
      date: "2026-01-20",
      time: "14:00",
      confidence: 85,
      color: "amber",
    },
  ]

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-gradient-to-b from-rose-50 to-white">
      {/* 头部 */}
      <header className="glass-nav sticky top-0 z-40 px-4 py-3 safe-area-top">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="flex-1 text-center text-lg font-semibold mr-10">测试历史</h1>
        </div>
      </header>

      <main className="flex-1 p-4 pb-8">
        {/* 统计概览 */}
        <Card className="glass-card mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-rose-500">{testHistory.length}</div>
                <div className="text-xs text-gray-500">完成测试</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-500">INTJ</div>
                <div className="text-xs text-gray-500">最新MBTI</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-500">87%</div>
                <div className="text-xs text-gray-500">平均置信度</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 测试记录列表 */}
        <div className="space-y-3">
          {testHistory.map((test) => (
            <Card 
              key={test.id} 
              className="glass-card overflow-hidden cursor-pointer card-hover"
              onClick={() => router.push(`/test-result/${test.id}`)}
            >
              <div className={cn(
                "h-1",
                test.color === "purple" && "bg-purple-500",
                test.color === "rose" && "bg-rose-500",
                test.color === "blue" && "bg-blue-500",
                test.color === "amber" && "bg-amber-500"
              )} />
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      test.color === "purple" && "bg-purple-100",
                      test.color === "rose" && "bg-rose-100",
                      test.color === "blue" && "bg-blue-100",
                      test.color === "amber" && "bg-amber-100"
                    )}>
                      <FileText className={cn(
                        "h-6 w-6",
                        test.color === "purple" && "text-purple-600",
                        test.color === "rose" && "text-rose-600",
                        test.color === "blue" && "text-blue-600",
                        test.color === "amber" && "text-amber-600"
                      )} />
                    </div>
                    <div>
                      <p className="font-semibold">{test.type}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{test.date} {test.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={cn(
                        "text-xl font-bold",
                        test.color === "purple" && "text-purple-600",
                        test.color === "rose" && "text-rose-600",
                        test.color === "blue" && "text-blue-600",
                        test.color === "amber" && "text-amber-600"
                      )}>
                        {test.result}
                      </p>
                      <p className="text-xs text-gray-500">{test.resultName}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-300" />
                  </div>
                </div>
                
                {/* 置信度 */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      置信度
                    </span>
                    <span className="font-medium">{test.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        test.color === "purple" && "bg-purple-500",
                        test.color === "rose" && "bg-rose-500",
                        test.color === "blue" && "bg-blue-500",
                        test.color === "amber" && "bg-amber-500"
                      )}
                      style={{ width: `${test.confidence}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 空状态提示 */}
        {testHistory.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无测试记录</p>
            <Button 
              className="mt-4 gradient-personal text-white"
              onClick={() => router.push("/test/mbti")}
            >
              开始第一次测试
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
