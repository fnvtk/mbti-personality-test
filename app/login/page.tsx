"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Phone, Lock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendCode = () => {
    if (!phone || phone.length !== 11) {
      setError("请输入正确的手机号")
      return
    }
    setError("")
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !code) {
      setError("请填写完整信息")
      return
    }
    setLoading(true)
    setError("")
    setTimeout(() => {
      localStorage.setItem("userId", `user_${Date.now()}`)
      localStorage.setItem("userPhone", phone)
      router.push("/")
    }, 1500)
  }

  return (
    <div className="min-h-screen w-full max-w-md mx-auto flex flex-col gradient-bg">
      {/* 背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-orange-500/20 rounded-full blur-[80px]" />
      </div>

      {/* 头部 */}
      <header className="relative z-10">
        <div className="flex items-center px-4 py-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      {/* 主内容 */}
      <main className="flex-1 relative z-10 px-5 py-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-4 glow-orange">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">发型魔镜</h1>
          <p className="text-white/50 mt-2">登录后享受更多服务</p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="glass-card rounded-xl p-3 border border-red-500/30 bg-red-500/10">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="glass-card rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-white/40" />
              <Input
                type="tel"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={11}
                className="border-0 bg-transparent focus-visible:ring-0 p-0 text-base text-white placeholder:text-white/40"
              />
            </div>
          </div>

          <div className="glass-card rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-white/40" />
              <Input
                type="text"
                placeholder="请输入验证码"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="border-0 bg-transparent focus-visible:ring-0 p-0 text-base flex-1 text-white placeholder:text-white/40"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSendCode}
                disabled={countdown > 0}
                className="text-orange-400 hover:text-orange-300 hover:bg-transparent px-0"
              >
                {countdown > 0 ? `${countdown}s` : "获取验证码"}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full gradient-primary text-white rounded-xl py-6 text-lg font-medium mt-6"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                登录中...
              </span>
            ) : (
              "登录"
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-white/30 mt-6">
          登录即表示同意
          <span className="text-orange-400">《用户协议》</span>和<span className="text-orange-400">《隐私政策》</span>
        </p>
      </main>
    </div>
  )
}
