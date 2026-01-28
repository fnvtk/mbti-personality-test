"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { mbtiQuestions } from "@/data/mbti-questions"
import { MBTICalculator } from "@/lib/mbti-calculator"
import { cn } from "@/lib/utils"

export default function MBTITestPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(30 * 60) // 30分钟
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

  // 格式化时间
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  // 处理答案选择
  const handleAnswer = (questionId: number, answerType: string) => {
    setSelectedOption(answerType)

    // 延迟保存答案并前进到下一题
    setTimeout(() => {
      const newAnswers = { ...answers, [questionId]: answerType }
      setAnswers(newAnswers)

      if (currentQuestion < mbtiQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(newAnswers[mbtiQuestions[currentQuestion + 1].id] || null)
      } else {
        // 测试完成
        handleSubmit(newAnswers)
      }
    }, 200)
  }

  // 提交测试
  const handleSubmit = useCallback(async (finalAnswers?: Record<number, string>) => {
    const answersToCalculate = finalAnswers || answers
    
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      // 计算MBTI结果
      const result = MBTICalculator.calculateFromSimpleAnswers(
        answersToCalculate,
        mbtiQuestions
      )

      // 保存结果到localStorage
      const mbtiResult = {
        type: result.mbtiType,
        dimensions: result.dimensionScores,
        confidence: result.confidence,
        description: result.description,
        dominantDimensions: result.dominantDimensions,
        dimensionStrengths: result.dimensionStrengths,
        testDuration: 30 * 60 - timeRemaining,
        completedAt: new Date().toISOString(),
      }

      localStorage.setItem("mbtiResult", JSON.stringify(mbtiResult))
      localStorage.setItem("mbtiAnswers", JSON.stringify(answersToCalculate))

      // 跳转到结果页面
      router.push("/mbti-result")
    } catch (error) {
      console.error("计算结果失败:", error)
      setIsSubmitting(false)
    }
  }, [answers, timeRemaining, isSubmitting, router])

  // 上一题
  const goToPrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedOption(answers[mbtiQuestions[currentQuestion - 1].id] || null)
    }
  }

  // 下一题
  const goToNextQuestion = () => {
    if (currentQuestion < mbtiQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(answers[mbtiQuestions[currentQuestion + 1].id] || null)
    }
  }

  // 跳题（跳到第一个未答的题目）
  const skipToUnanswered = () => {
    for (let i = 0; i < mbtiQuestions.length; i++) {
      if (!answers[mbtiQuestions[i].id]) {
        setCurrentQuestion(i)
        setSelectedOption(null)
        return
      }
    }
  }

  // 计算进度
  const progress = ((currentQuestion + 1) / mbtiQuestions.length) * 100
  const answeredCount = Object.keys(answers).length
  const currentQ = mbtiQuestions[currentQuestion]

  // 时间警告
  const isTimeWarning = timeRemaining <= 5 * 60 // 少于5分钟警告

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-gradient-to-b from-rose-50 to-white">
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
              您已完成 {answeredCount}/{mbtiQuestions.length} 题。退出后当前进度将丢失。
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowExitConfirm(false)}
              >
                继续答题
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => router.push("/")}
              >
                确认退出
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 顶部导航 */}
      <header className="glass-nav sticky top-0 z-40 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowExitConfirm(true)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-[17px] font-semibold">MBTI性格测试</h1>
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
            isTimeWarning ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
          )}>
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </header>

      {/* 进度条区域 */}
      <div className="px-4 py-3 bg-white/80 border-b border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            第 {currentQuestion + 1} / {mbtiQuestions.length} 题
          </span>
          <span className="text-sm text-gray-500">
            已答 {answeredCount} 题
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill progress-bar-fill-personal"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 题目区域 */}
      <main className="flex-1 overflow-auto p-4">
        <Card className="glass-card p-6 animate-fade-in">
          {/* 题目维度标签 */}
          <div className="mb-4">
            <span className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
              currentQ.dimension === "EI" && "bg-blue-100 text-blue-700",
              currentQ.dimension === "SN" && "bg-green-100 text-green-700",
              currentQ.dimension === "TF" && "bg-purple-100 text-purple-700",
              currentQ.dimension === "JP" && "bg-orange-100 text-orange-700",
            )}>
              {currentQ.dimension === "EI" && "外向 vs 内向"}
              {currentQ.dimension === "SN" && "感觉 vs 直觉"}
              {currentQ.dimension === "TF" && "思考 vs 情感"}
              {currentQ.dimension === "JP" && "判断 vs 感知"}
            </span>
          </div>

          {/* 题目内容 */}
          <h2 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
            {currentQ.question}
          </h2>

          {/* 选项 */}
          <div className="space-y-3">
            {currentQ.options.map((option) => (
              <button
                key={option.value}
                className={cn(
                  "w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                  selectedOption === option.value
                    ? "border-rose-400 bg-rose-50 shadow-sm"
                    : "border-gray-200 hover:border-rose-200 hover:bg-rose-50/50"
                )}
                onClick={() => handleAnswer(currentQ.id, option.value)}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200",
                    selectedOption === option.value
                      ? "border-rose-500 bg-rose-500"
                      : "border-gray-300"
                  )}
                >
                  {selectedOption === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className={cn(
                  "text-base leading-relaxed",
                  selectedOption === option.value ? "text-gray-900" : "text-gray-700"
                )}>
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* 快速导航提示 */}
        {answeredCount > 0 && answeredCount < mbtiQuestions.length && (
          <div className="mt-4 text-center">
            <button
              className="text-sm text-rose-500 hover:text-rose-600"
              onClick={skipToUnanswered}
            >
              跳转到未答题目 →
            </button>
          </div>
        )}
      </main>

      {/* 底部导航按钮 */}
      <footer className="glass-nav px-4 py-4 safe-area-bottom">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="flex items-center gap-1"
            onClick={goToPrevQuestion}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            上一题
          </Button>

          <div className="flex gap-1">
            {/* 进度指示器 - 显示当前附近的题目 */}
            {Array.from({ length: 5 }).map((_, i) => {
              const qIndex = Math.max(0, Math.min(mbtiQuestions.length - 5, currentQuestion - 2)) + i
              if (qIndex >= mbtiQuestions.length) return null
              const isAnswered = !!answers[mbtiQuestions[qIndex].id]
              const isCurrent = qIndex === currentQuestion
              return (
                <button
                  key={qIndex}
                  className={cn(
                    "w-8 h-8 rounded-full text-xs font-medium transition-all duration-200",
                    isCurrent && "gradient-personal text-white scale-110",
                    !isCurrent && isAnswered && "bg-rose-100 text-rose-600",
                    !isCurrent && !isAnswered && "bg-gray-100 text-gray-400"
                  )}
                  onClick={() => {
                    setCurrentQuestion(qIndex)
                    setSelectedOption(answers[mbtiQuestions[qIndex].id] || null)
                  }}
                >
                  {qIndex + 1}
                </button>
              )
            })}
          </div>

          <Button
            variant="outline"
            className="flex items-center gap-1"
            onClick={goToNextQuestion}
            disabled={currentQuestion === mbtiQuestions.length - 1}
          >
            下一题
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* 完成按钮 */}
        {answeredCount === mbtiQuestions.length && (
          <Button
            className="w-full mt-3 gradient-personal text-white"
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
          >
            {isSubmitting ? "正在计算结果..." : "完成测试，查看结果"}
          </Button>
        )}
      </footer>
    </div>
  )
}
