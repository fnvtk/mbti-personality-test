"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, MessageCircle, Clock, CheckCircle } from "lucide-react"
import BottomNav from "@/components/ui/bottom-nav"

export default function ConsultantPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"waiting" | "connected" | "error">("waiting")
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes in seconds

  useEffect(() => {
    // 模拟连接纯科宝接口
    const connectToPureScience = async () => {
      try {
        // 这里应该是实际的API调用
        // const response = await fetch('https://api.purekeybao.com/connect', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ userId: sessionStorage.getItem("currentUserId") })
        // });

        // 模拟API调用延迟
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // 模拟成功响应
        setStatus("connected")
      } catch (error) {
        console.error("连接纯科宝接口失败:", error)
        setStatus("error")
      }
    }

    connectToPureScience()

    // 倒计时
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      <div className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">专业顾问</h1>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <Card className="w-full p-6 text-center">
          {status === "waiting" && (
            <>
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-10 w-10 text-blue-500 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold mb-2">正在连接专业顾问</h2>
              <p className="text-gray-600 mb-4">
                专业客服将在 <span className="text-blue-500 font-medium">{formatTime(timeLeft)}</span>{" "}
                内通过微信添加您为好友
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>请保持微信畅通</span>
              </div>
            </>
          )}

          {status === "connected" && (
            <>
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">连接成功</h2>
              <p className="text-gray-600 mb-4">专业客服已收到您的咨询请求，将在1-3分钟内通过微信添加您为好友</p>
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <MessageCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-medium">咨询提示</span>
                </div>
                <p className="text-sm text-gray-600 text-left">
                  1. 请确保您的微信可以接收陌生人消息
                  <br />
                  2. 专业顾问将以"神仙团队顾问"的名义添加您
                  <br />
                  3. 首次咨询可享受15分钟免费咨询服务
                </p>
              </div>
              <Button className="w-full" onClick={() => router.push("/")}>
                返回首页
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">连接失败</h2>
              <p className="text-gray-600 mb-4">很抱歉，连接专业顾问失败，请稍后再试</p>
              <Button className="w-full" onClick={() => setStatus("waiting")}>
                重新连接
              </Button>
            </>
          )}
        </Card>
      </div>

      <BottomNav currentPath="/consultant" />
    </div>
  )
}
