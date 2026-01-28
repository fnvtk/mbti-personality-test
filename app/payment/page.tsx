"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Check, Shield, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"

const paymentMethods = [
  { id: "wechat", name: "微信支付", icon: "💚", desc: "推荐" },
  { id: "alipay", name: "支付宝", icon: "💙", desc: "" },
]

export default function PaymentPage() {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState("wechat")
  const [loading, setLoading] = useState(false)
  const price = 5
  const originalPrice = 9.9

  const handlePayment = async () => {
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem("hasPaid", "true")
      router.push("/generate")
    }, 2000)
  }

  return (
    <div className="min-h-screen w-full max-w-md mx-auto flex flex-col gradient-bg">
      {/* 背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-60 h-60 bg-orange-500/15 rounded-full blur-[80px]" />
      </div>

      {/* 头部 */}
      <header className="relative z-10 glass-nav sticky top-0">
        <div className="flex items-center px-4 py-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-white">支付</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* 主内容 */}
      <main className="flex-1 relative z-10 px-5 py-6">
        {/* 新春特惠标签 */}
        <div className="glass-card rounded-2xl p-4 mb-4 flex items-center gap-3 border border-red-500/30 glow-red">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">新春特惠</p>
            <p className="text-xs text-white/50">限时5折，过年焕新颜</p>
          </div>
        </div>

        {/* 金额 */}
        <div className="glass-card rounded-2xl p-6 mb-6 text-center border border-white/10">
          <p className="text-white/50 mb-2">支付金额</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-white/40 line-through text-lg">¥{originalPrice}</span>
            <div className="text-5xl font-bold text-orange-400">
              <span className="text-xl">¥</span>
              {price}
            </div>
          </div>
          <p className="text-sm text-white/50 mt-2">发型效果图生成 x1</p>
        </div>

        {/* 支付方式 */}
        <div className="glass-card rounded-2xl p-4 mb-6 border border-white/10">
          <h2 className="font-medium text-white mb-4">选择支付方式</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${
                  selectedMethod === method.id ? "border-orange-500 bg-orange-500/10" : "border-white/10 glass-button"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-medium text-white">{method.name}</span>
                  {method.desc && (
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">{method.desc}</span>
                  )}
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

        {/* 安全提示 */}
        <div className="flex items-center justify-center gap-2 text-white/40 text-sm mb-6">
          <Shield className="w-4 h-4" />
          <span>安全支付，信息加密</span>
        </div>

        {/* 支付按钮 */}
        <Button
          onClick={handlePayment}
          disabled={loading}
          className="w-full gradient-primary text-white rounded-2xl py-6 text-lg font-medium"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              支付中...
            </span>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              确认支付 ¥{price}
            </>
          )}
        </Button>
      </main>
    </div>
  )
}
