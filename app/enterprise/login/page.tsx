"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building, Lock } from "lucide-react"

export default function EnterpriseLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // 这里应该是实际的API调用，现在使用模拟验证
      const response = await fetch("/api/enterprise/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        // 登录成功，保存企业信息和token
        localStorage.setItem("enterpriseToken", data.token)
        localStorage.setItem("enterpriseId", data.enterpriseId)
        localStorage.setItem("enterpriseName", data.enterpriseName)
        router.push("/enterprise/dashboard")
      } else {
        setError(data.message || "用户名或密码错误")
      }
    } catch (err) {
      setError("登录失败，请稍后重试")
      console.error("登录错误:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Building className="h-12 w-12 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold">企业管理平台</CardTitle>
          <CardDescription>登录您的企业管理账户</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">企业账号</Label>
              <Input
                id="username"
                type="text"
                placeholder="输入企业账号"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "登录中..." : "登录"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <Lock className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-xs text-gray-500">安全连接 | 企业专属入口</span>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              没有企业账号？请联系我们
              <Button variant="link" className="p-0 h-auto text-sm" onClick={() => router.push("/enterprise-contact")}>
                申请开通
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
