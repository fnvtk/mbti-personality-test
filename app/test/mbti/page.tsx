"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { mbtiQuestions } from "@/data/mbti-questions"

export default function MBTITestPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(30 * 60) // 30 minutes in seconds
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          // 时间到，自动提交测试
          calculateMBTIType()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAnswer = (questionId: number, answerType: string) => {
    setSelectedOption(answerType)

    // 延迟一小段时间后保存答案并前进到下一题
    setTimeout(() => {
      const newAnswers = { ...answers, [questionId]: answerType }
      setAnswers(newAnswers)

      if (currentQuestion < mbtiQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(null)
      } else {
        // 测试完成，计算MBTI类型
        calculateMBTIType(newAnswers)
      }
    }, 300)
  }

  const calculateMBTIType = (finalAnswers?: Record<number, string>) => {
    const answersToCalculate = finalAnswers || answers

    // 计算各维度的得分
    let eScore = 0,
      iScore = 0
    let sScore = 0,
      nScore = 0
    let tScore = 0,
      fScore = 0
    let jScore = 0,
      pScore = 0

    Object.entries(answersToCalculate).forEach(([questionId, answer]) => {
      const qId = Number.parseInt(questionId)
      const question = mbtiQuestions.find((q) => q.id === qId)

      if (!question) return

      // 根据问题类型和答案增加相应维度的分数
      switch (question.dimension) {
        case "EI":
          if (answer === "E") eScore++
          else if (answer === "I") iScore++
          break
        case "SN":
          if (answer === "S") sScore++
          else if (answer === "N") nScore++
          break
        case "TF":
          if (answer === "T") tScore++
          else if (answer === "F") fScore++
          break
        case "JP":
          if (answer === "J") jScore++
          else if (answer === "P") pScore++
          break
      }
    })

    // 确定每个维度的主导类型
    const e_i = eScore >= iScore ? "E" : "I"
    const s_n = sScore >= nScore ? "S" : "N"
    const t_f = tScore >= fScore ? "T" : "F"
    const j_p = jScore >= pScore ? "J" : "P"

    // 组合成MBTI类型
    const mbtiType = e_i + s_n + t_f + j_p

    // 计算各维度的百分比
    const eiTotal = eScore + iScore
    const snTotal = sScore + nScore
    const tfTotal = tScore + fScore
    const jpTotal = jScore + pScore

    const ePercentage = Math.round((eScore / eiTotal) * 100)
    const sPercentage = Math.round((sScore / snTotal) * 100)
    const tPercentage = Math.round((tScore / tfTotal) * 100)
    const jPercentage = Math.round((jScore / jpTotal) * 100)

    // 保存结果
    const mbtiResult = {
      type: mbtiType,
      dimensions: {
        EI: { E: eScore, I: iScore, percentage: ePercentage },
        SN: { S: sScore, N: nScore, percentage: sPercentage },
        TF: { T: tScore, F: fScore, percentage: tPercentage },
        JP: { J: jScore, P: pScore, percentage: jPercentage },
      },
    }

    localStorage.setItem("mbtiResult", JSON.stringify(mbtiResult))

    // 导航到结果页面
    router.push("/mbti-result")
  }

  const progress = ((currentQuestion + 1) / mbtiQuestions.length) * 100

  // Format time remaining
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      <div className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">MBTI性格测试</h1>
      </div>

      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            问题 {currentQuestion + 1}/{mbtiQuestions.length}
          </span>
          <span className="text-sm text-gray-500">剩余时间: {formatTime(timeRemaining)}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Card className="p-6">
          <h2 className="text-xl font-medium mb-6">{mbtiQuestions[currentQuestion].question}</h2>
          <div className="space-y-4">
            {mbtiQuestions[currentQuestion].options.map((option) => (
              <div
                key={option.value}
                className={`flex items-center space-x-2 border p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedOption === option.value ? "bg-purple-100 border-purple-300" : "hover:bg-purple-50"
                }`}
                onClick={() => handleAnswer(mbtiQuestions[currentQuestion].id, option.value)}
              >
                <div
                  className={`w-4 h-4 rounded-full border ${
                    selectedOption === option.value ? "bg-purple-600 border-purple-600" : "border-gray-300"
                  }`}
                >
                  {selectedOption === option.value && <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>}
                </div>
                <div className="flex-1 cursor-pointer">{option.text}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1)
                setSelectedOption(answers[mbtiQuestions[currentQuestion - 1].id] || null)
              }
            }}
            disabled={currentQuestion === 0}
          >
            上一题
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (currentQuestion < mbtiQuestions.length - 1) {
                setCurrentQuestion(currentQuestion + 1)
                setSelectedOption(answers[mbtiQuestions[currentQuestion + 1].id] || null)
              }
            }}
            disabled={currentQuestion === mbtiQuestions.length - 1}
          >
            跳过
          </Button>
        </div>
      </div>
    </div>
  )
}
