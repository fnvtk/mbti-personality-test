"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Clock, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { pdpQuestions, pdpDescriptions } from "@/data/pdp-questions"
import { cn } from "@/lib/utils"
import BottomNav from "@/components/bottom-nav"

export default function PDPTestPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(15 * 60) // 15分钟
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  // 计时器
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const handleAnswer = (questionId: number, answerType: string) => {
    setSelectedOption(answerType)
    setTimeout(() => {
      const newAnswers = { ...answers, [questionId]: answerType }
      setAnswers(newAnswers)
      if (currentQuestion < pdpQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(newAnswers[pdpQuestions[currentQuestion + 1].id] || null)
      } else {
        handleSubmit(newAnswers)
      }
    }, 200)
  }

  // 计算PDP结果
  const calculatePDPResult = (finalAnswers: Record<number, string>) => {
    const scores = { Tiger: 0, Peacock: 0, Koala: 0, Owl: 0, Chameleon: 0 }
    Object.values(finalAnswers).forEach((type) => {
      if (type in scores) {
        scores[type as keyof typeof scores]++
      }
    })
    
    const total = Object.values(scores).reduce((sum, v) => sum + v, 0)
    const percentages = {
      Tiger: Math.round((scores.Tiger / total) * 100),
      Peacock: Math.round((scores.Peacock / total) * 100),
      Koala: Math.round((scores.Koala / total) * 100),
      Owl: Math.round((scores.Owl / total) * 100),
      Chameleon: Math.round((scores.Chameleon / total) * 100),
    }
    
    const dominantType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as keyof typeof pdpDescriptions
    const secondaryType = Object.entries(scores).sort((a, b) => b[1] - a[1])[1][0] as keyof typeof pdpDescriptions
    
    return {
      scores,
      percentages,
      dominantType,
      secondaryType,
      description: pdpDescriptions[dominantType],
    }
  }

  const handleSubmit = useCallback(async (finalAnswers?: Record<number, string>) => {
    const answersToCalculate = finalAnswers || answers
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const result = calculatePDPResult(answersToCalculate)
      localStorage.setItem("pdpResult", JSON.stringify({
        ...result,
        testDuration: 15 * 60 - timeRemaining,
        completedAt: new Date().toISOString(),
      }))
      router.push("/pdp-result")
    } catch (error) {
      console.error("计算结果失败:", error)
      setIsSubmitting(false)
    }
  }, [answers, timeRemaining, isSubmitting, router])

  const goToPrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedOption(answers[pdpQuestions[currentQuestion - 1].id] || null)
    }
  }

  const goToNextQuestion = () => {
    if (currentQuestion < pdpQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(answers[pdpQuestions[currentQuestion + 1].id] || null)
    }
  }

  const progress = ((currentQuestion + 1) / pdpQuestions.length) * 100
  const answeredCount = Object.keys(answers).length
  const currentQ = pdpQuestions[currentQuestion]
  const isTimeWarning = timeRemaining <= 3 * 60

  // 获取选项颜色
  const getOptionColor = (value: string) => {
    const colors: Record<string, string> = {
      Tiger: "amber",
      Peacock: "purple", 
      Koala: "green",
      Owl: "blue",
      Chameleon: "teal",
    }
    return colors[value] || "gray"
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-white">
      {/* 退出确认弹窗 */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-sm w-full animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold">确认退出？</h3>
            </div>
            <p className="text-gray-600 mb-6">
              您已完成 {answeredCount}/{pdpQuestions.length} 题。
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowExitConfirm(false)}>
                继续答题
              </Button>
              <Button variant="destructive" className="flex-1" onClick={() => router.push("/")}>
                确认退出
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 顶部导航 */}
      <header className="glass-nav sticky top-0 z-40 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setShowExitConfirm(true)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-[17px] font-semibold">PDP性格测试</h1>
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
            isTimeWarning ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
          )}>
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </header>

      {/* 进度条 */}
      <div className="px-4 py-3 bg-white/80 border-b border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            第 {currentQuestion + 1} / {pdpQuestions.length} 题
          </span>
          <span className="text-sm text-gray-500">已答 {answeredCount} 题</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill bg-gradient-to-r from-amber-500 to-orange-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 题目区域 */}
      <main className="flex-1 overflow-auto p-4">
        <Card className="glass-card p-6 animate-fade-in">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option) => {
              const emoji = pdpDescriptions[option.value as keyof typeof pdpDescriptions]?.emoji || "🔹"
              return (
                <button
                  key={option.value}
                  className={cn(
                    "w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                    selectedOption === option.value
                      ? "border-amber-400 bg-amber-50 shadow-sm"
                      : "border-gray-200 hover:border-amber-200 hover:bg-amber-50/50"
                  )}
                  onClick={() => handleAnswer(currentQ.id, option.value)}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0",
                    selectedOption === option.value ? "bg-amber-100" : "bg-gray-100"
                  )}>
                    {emoji}
                  </div>
                  <span className={cn(
                    "text-base leading-relaxed pt-2",
                    selectedOption === option.value ? "text-gray-900" : "text-gray-700"
                  )}>
                    {option.text}
                  </span>
                </button>
              )
            })}
          </div>
        </Card>
      </main>

      {/* 底部导航 */}
      <footer className="glass-nav px-4 py-4 safe-area-bottom">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={goToPrevQuestion} disabled={currentQuestion === 0}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            上一题
          </Button>
          <Button variant="outline" onClick={goToNextQuestion} disabled={currentQuestion === pdpQuestions.length - 1}>
            下一题
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        {answeredCount === pdpQuestions.length && (
          <Button
            className="w-full mt-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white"
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
          >
            {isSubmitting ? "正在计算结果..." : "完成测试，查看结果"}
          </Button>
        )}
      </footer>

      <BottomNav currentPath="/test/pdp" />
    </div>
  )
}
