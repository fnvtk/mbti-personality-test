"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function WalletPage() {
  const router = useRouter()
  const [balance, setBalance] = useState(150.0)

  const transactions = [
    { id: 1, type: "红包收入", amount: 50, date: "2025-01-26", status: "已到账" },
    { id: 2, type: "提现", amount: -100, date: "2025-01-25", status: "已完成" },
    { id: 3, type: "红包收入", amount: 30, date: "2025-01-24", status: "已到账" },
  ]

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between bg-white">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="flex-1 text-center text-lg">我的钱包</h1>
        <div className="w-10" />
      </div>

      {/* Balance Card */}
      <Card className="m-4">
        <div className="p-6 text-center">
          <p className="text-sm text-gray-500 mb-2">账户余额</p>
          <p className="text-3xl font-bold">¥ {balance.toFixed(2)}</p>
          <Button className="mt-4 w-full" onClick={() => router.push("/profile/wallet/withdraw")}>
            立即提现
          </Button>
        </div>
      </Card>

      {/* Transactions */}
      <div className="flex-1 px-4">
        <h2 className="text-sm font-medium mb-2">交易记录</h2>
        <Card>
          <div className="divide-y">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{tx.type}</p>
                  <p className="text-sm text-gray-500">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className={tx.amount > 0 ? "text-green-500" : "text-gray-900"}>
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                  </p>
                  <p className="text-sm text-gray-500">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
