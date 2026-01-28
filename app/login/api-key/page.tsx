"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { setAuthToken } from "@/lib/auth"

export default function ApiKeyLoginPage() {
  const router = useRouter()
  const [apiKey, setApiKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!apiKey.trim()) {
      setError("请输入API密钥")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 保存API密钥作为认证令牌
      setAuthToken(apiKey)

      // 测试API密钥是否有效
      const response = await fetch("/api/validate-token", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error("API密钥无效")
      }

      // 成功后返回上一页或首页
      router.back()
    } catch (error) {
      console.error("登录失败:", error)
      setError(`登录失败: ${(error as Error).message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      <div className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">API密钥登录</h1>
      </div>

      <div className="flex-1 p-6 flex items-center justify-center">
        <Card className="w-full p-6">
          <h2 className="text-xl font-bold mb-6">输入API密钥</h2>

          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                  API密钥
                </label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="输入您的API密钥"
                  className="w-full"
                />
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? "登录中..." : "登录"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>请联系管理员获取API密钥</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
