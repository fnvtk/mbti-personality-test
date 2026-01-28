"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Plus, CreditCard, ArrowUpRight, ArrowDownLeft, History } from "lucide-react"
import { cn } from "@/lib/utils"

export default function WalletPage() {
  const router = useRouter()
  const [balance, setBalance] = useState(150.0)

  const transactions = [
    { id: 1, type: "测试购买", amount: -3, date: "2026-01-28 10:30", status: "已完成", icon: ArrowUpRight },
    { id: 2, type: "充值", amount: 100, date: "2026-01-27 14:20", status: "已到账", icon: ArrowDownLeft },
    { id: 3, type: "测试购买", amount: -1, date: "2026-01-26 09:15", status: "已完成", icon: ArrowUpRight },
    { id: 4, type: "新人奖励", amount: 50, date: "2026-01-25 08:00", status: "已到账", icon: ArrowDownLeft },
  ]

  const rechargeAmounts = [10, 30, 50, 100, 200, 500]

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-gradient-to-b from-rose-50 to-white">
      {/* 头部 */}
      <header className="glass-nav sticky top-0 z-40 px-4 py-3 safe-area-top">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="flex-1 text-center text-lg font-semibold mr-10">我的钱包</h1>
        </div>
      </header>

      <main className="flex-1 p-4 pb-8">
        {/* 余额卡片 */}
        <Card className="glass-card overflow-hidden mb-6">
          <div className="gradient-personal p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 opacity-80" />
                <span className="text-sm opacity-80">账户余额</span>
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <History className="h-4 w-4 mr-1" />
                明细
              </Button>
            </div>
            <div className="text-4xl font-bold mb-1">¥ {balance.toFixed(2)}</div>
            <p className="text-sm opacity-70">可用于支付测试费用</p>
          </div>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <Button className="w-full" variant="outline">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                提现
              </Button>
              <Button className="w-full gradient-personal text-white border-0">
                <Plus className="h-4 w-4 mr-2" />
                充值
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 快捷充值 */}
        <Card className="glass-card mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">快捷充值</h3>
            <div className="grid grid-cols-3 gap-2">
              {rechargeAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  className="py-6 text-lg font-semibold hover:border-rose-400 hover:bg-rose-50"
                >
                  ¥{amount}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              充值金额即时到账，支持微信/支付宝
            </p>
          </CardContent>
        </Card>

        {/* 交易记录 */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">交易记录</h3>
              <Button variant="link" size="sm" className="text-rose-500">
                查看全部
              </Button>
            </div>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center",
                      tx.amount > 0 ? "bg-green-100" : "bg-gray-100"
                    )}>
                      <tx.icon className={cn(
                        "h-4 w-4",
                        tx.amount > 0 ? "text-green-600" : "text-gray-600"
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tx.type}</p>
                      <p className="text-xs text-gray-500">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-semibold",
                      tx.amount > 0 ? "text-green-600" : "text-gray-900"
                    )}>
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                    </p>
                    <p className="text-xs text-gray-400">{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
