"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"

// PDP test questions based on the provided image
const pdpQuestions = [
  {
    id: 1,
    question: "你是一个不畏惧挑战的人吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "B", // B section questions
    number: 3, // Question number in the original test
  },
  {
    id: 2,
    question: "你喜欢与他人交流吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "B",
    number: 9,
  },
  {
    id: 3,
    question: "你善于表达自己的想法吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "B",
    number: 15,
  },
  {
    id: 4,
    question: "你喜欢尝试新事物吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "B",
    number: 21,
  },
  {
    id: 5,
    question: "你做事情有计划性吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "B",
    number: 27,
  },
  {
    id: 6,
    question: "你善于倾听他人意见吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "B",
    number: 33,
  },
  {
    id: 7,
    question: "你喜欢分析问题吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "B",
    number: 39,
  },
  {
    id: 8,
    question: "你是一个有耐心的人吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "B",
    number: 45,
  },
  {
    id: 9,
    question: "你喜欢领导他人吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "B",
    number: 51,
  },
  {
    id: 10,
    question: "你做事情有条理吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "B",
    number: 57,
  },
  // Add more questions from the image...
  {
    id: 11,
    question: "你善于解决复杂问题吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "B",
    number: 63,
  },
  {
    id: 12,
    question: "你喜欢创新吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "B",
    number: 69,
  },
  {
    id: 13,
    question: "你善于表达情感吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "B",
    number: 75,
  },
  {
    id: 14,
    question: "你做事情果断吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "B",
    number: 81,
  },
  {
    id: 15,
    question: "你喜欢团队合作吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "B",
    number: 87,
  },
  // E section questions
  {
    id: 16,
    question: "在工作中，你喜欢挑战吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "E",
    number: 3,
  },
  {
    id: 17,
    question: "你喜欢与人交流吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "E",
    number: 9,
  },
  {
    id: 18,
    question: "你喜欢表达自己的想法吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "E",
    number: 15,
  },
  {
    id: 19,
    question: "你喜欢尝试新事物吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "E",
    number: 21,
  },
  {
    id: 20,
    question: "你做事情有计划性吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "E",
    number: 27,
  },
  // Add more E section questions...
  {
    id: 21,
    question: "你善于倾听他人意见吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "E",
    number: 33,
  },
  {
    id: 22,
    question: "你喜欢分析问题吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "E",
    number: 39,
  },
  {
    id: 23,
    question: "你是一个有耐心的人吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "E",
    number: 45,
  },
  {
    id: 24,
    question: "你喜欢领导他人吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "E",
    number: 51,
  },
  {
    id: 25,
    question: "你做事情有条理吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "E",
    number: 57,
  },
  {
    id: 26,
    question: "你善于解决复杂问题吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "E",
    number: 63,
  },
  {
    id: 27,
    question: "你喜欢创新吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "E",
    number: 69,
  },
  {
    id: 28,
    question: "你善于表达情感吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "E",
    number: 75,
  },
  {
    id: 29,
    question: "你做事情果断吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "E",
    number: 81,
  },
  {
    id: 30,
    question: "你喜欢团队合作吗?",
    options: [
      { value: 5, label: "非常同意" },
      { value: 4, label: "比较同意" },
      { value: 3, label: "基本同意" },
      { value: 2, label: "只有一点同意" },
      { value: 1, label: "不同意" },
    ],
    section: "E",
    number: 87,
  },
]

export default function PDPTestPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [timeRemaining, setTimeRemaining] = useState(5 * 60) // 5 minutes in seconds (changed from 20 minutes)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          // 时间到，自动提交测试
          const pdpType = calculatePDPType(answers)
          localStorage.setItem("pdpResult", JSON.stringify(pdpType))
          router.push("/full-report") // 直接跳转到完整报告页面
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [answers, router])

  const handleAnswer = (value: number) => {
    const question = pdpQuestions[currentQuestion]
    const answerKey = `${question.section}${question.number}`

    // 更新答案
    const newAnswers = { ...answers, [answerKey]: value }
    setAnswers(newAnswers)
    setSelectedOption(value)

    // 延迟一小段时间后跳转到下一题，给用户一个视觉反馈
    setTimeout(() => {
      if (currentQuestion < pdpQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(null) // 重置选中状态
      } else {
        // 测试完成，计算PDP类型
        const pdpType = calculatePDPType(newAnswers)
        // 存储结果并导航到PDP结果页面
        localStorage.setItem("pdpResult", JSON.stringify(pdpType))
        router.push("/pdp-result") // 先跳转到PDP结果页面
      }
    }, 300)
  }

  const calculatePDPType = (answers: Record<string, number>) => {
    // Calculate scores based on the formula provided
    const tigerScore =
      (answers["B27"] || 0) +
      (answers["B57"] || 0) +
      (answers["B81"] || 0) +
      (answers["E15"] || 0) +
      (answers["E51"] || 0) +
      (answers["E87"] || 0)

    const peacockScore =
      (answers["B15"] || 0) +
      (answers["B33"] || 0) +
      (answers["B75"] || 0) +
      (answers["E27"] || 0) +
      (answers["E39"] || 0) +
      (answers["E81"] || 0)

    const koalaScore =
      (answers["B9"] || 0) +
      (answers["B45"] || 0) +
      (answers["B87"] || 0) +
      (answers["E9"] || 0) +
      (answers["E57"] || 0) +
      (answers["E75"] || 0)

    const owlScore =
      (answers["B3"] || 0) +
      (answers["B39"] || 0) +
      (answers["B63"] || 0) +
      (answers["E3"] || 0) +
      (answers["E33"] || 0) +
      (answers["E63"] || 0)

    const chameleonScore =
      (answers["B21"] || 0) +
      (answers["B51"] || 0) +
      (answers["B69"] || 0) +
      (answers["E21"] || 0) +
      (answers["E45"] || 0) +
      (answers["E69"] || 0)

    // Find primary and secondary types
    const scores = [
      { type: "老虎", score: tigerScore },
      { type: "孔雀", score: peacockScore },
      { type: "无尾熊", score: koalaScore },
      { type: "猫头鹰", score: owlScore },
      { type: "变色龙", score: chameleonScore },
    ]

    // Sort by score in descending order
    scores.sort((a, b) => b.score - a.score)

    return {
      primary: scores[0].type,
      secondary: scores[1].type,
      scores: {
        tiger: tigerScore,
        peacock: peacockScore,
        koala: koalaScore,
        owl: owlScore,
        chameleon: chameleonScore,
      },
    }
  }

  const progress = ((currentQuestion + 1) / pdpQuestions.length) * 100

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
        <h1 className="flex-1 text-center text-lg font-medium mr-10">PDP行为偏好测试</h1>
      </div>

      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            问题 {currentQuestion + 1}/{pdpQuestions.length}
          </span>
          <span className="text-sm text-gray-500">剩余时间: {formatTime(timeRemaining)}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Card className="p-6">
          <h2 className="text-xl font-medium mb-6">{pdpQuestions[currentQuestion].question}</h2>
          <div className="space-y-4">
            {pdpQuestions[currentQuestion].options.map((option) => (
              <div
                key={option.value}
                className={`flex items-center space-x-2 border p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedOption === option.value ? "bg-purple-100 border-purple-300" : "hover:bg-purple-50"
                }`}
                onClick={() => handleAnswer(option.value)}
              >
                <div
                  className={`w-4 h-4 rounded-full border ${
                    selectedOption === option.value ? "bg-purple-600 border-purple-600" : "border-gray-300"
                  }`}
                >
                  {selectedOption === option.value && <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>}
                </div>
                <Label className="flex-1 cursor-pointer">{option.label}</Label>
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
                setSelectedOption(null)
              }
            }}
            disabled={currentQuestion === 0}
          >
            上一题
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (currentQuestion < pdpQuestions.length - 1) {
                setCurrentQuestion(currentQuestion + 1)
                setSelectedOption(null)
              }
            }}
            disabled={currentQuestion === pdpQuestions.length - 1}
          >
            跳过
          </Button>
        </div>
      </div>
    </div>
  )
}
