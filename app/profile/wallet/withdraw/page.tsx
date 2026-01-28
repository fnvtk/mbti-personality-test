"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const withdrawMethods = [
  { id: "wechat", name: "微信", icon: "💚" },
  { id: "alipay", name: "支付宝", icon: "💙" },
]

const quickAmounts = [50, 100, 150, 200]

export default function WithdrawPage() {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("wechat")
  const [loading, setLoading] = useState(false)
  const balance = 150.0

  const handleQuickAmount = (value: number) => {
    if (value <= balance) {
      setAmount(value.toString())
    }
  }

  const handleWithdraw = async () => {
    if (!amount || Number.parseFloat(amount) > balance) return
    setLoading(true)
    setTimeout(() => {
      alert("提现申请已提交")
      router.push("/profile/wallet")
    }, 1500)
  }

  return (
    <div className="min-h-screen w-full max-w-md mx-auto flex flex-col gradient-bg">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/3 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      {/* 头部 */}
      <header className="relative z-10 glass-nav">
        <div className="flex items-center px-4 py-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl hover:bg-white/50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold">提现</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* 主内容 */}
      <main className="flex-1 relative z-10 px-6 py-6">
        {/* 可提现金额 */}
        <div className="glass-card rounded-2xl p-6 mb-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">可提现金额</p>
          <p className="text-4xl font-bold text-foreground">¥{balance.toFixed(2)}</p>
        </div>

        {/* 提现金额 */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="font-medium text-foreground mb-4">提现金额</h3>
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-foreground">¥</span>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="pl-10 h-14 text-2xl font-bold border-0 bg-muted rounded-xl"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((value) => (
              <button
                key={value}
                onClick={() => handleQuickAmount(value)}
                disabled={value > balance}
                className={`py-2 rounded-xl text-sm font-medium transition-all ${
                  Number(amount) === value
                    ? "gradient-primary text-white"
                    : value > balance
                      ? "bg-muted text-muted-foreground opacity-50"
                      : "glass-button"
                }`}
              >
                ¥{value}
              </button>
            ))}
          </div>
        </div>

        {/* 提现方式 */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="font-medium text-foreground mb-4">提现到</h3>
          <div className="space-y-3">
            {withdrawMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                  selectedMethod === method.id ? "bg-primary/10 border-2 border-primary" : "glass-button border-0"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-medium text-foreground">{method.name}</span>
                </div>
                {selectedMethod === method.id && (
                  <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 提现按钮 */}
        <Button
          onClick={handleWithdraw}
          disabled={loading || !amount || Number.parseFloat(amount) > balance || Number.parseFloat(amount) <= 0}
          className="w-full gradient-primary text-white rounded-xl py-6 text-lg font-medium"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              提交中...
            </span>
          ) : (
            "确认提现"
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">提现将在1-3个工作日内到账</p>
      </main>
    </div>
  )
}
