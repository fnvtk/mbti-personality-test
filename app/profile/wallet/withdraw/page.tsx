"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function WithdrawPage() {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const balance = 150.0

  const handleWithdraw = () => {
    // Handle withdrawal logic here
    router.push("/profile/wallet")
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between bg-white">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="flex-1 text-center text-lg">提现</h1>
        <div className="w-10" />
      </div>

      <Card className="m-4">
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">可提现金额</p>
            <p className="text-2xl font-bold">¥ {balance.toFixed(2)}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">提现金额</label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">¥</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  placeholder="请输入提现金额"
                />
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleWithdraw}
              disabled={!amount || Number.parseFloat(amount) > balance}
            >
              确认提现
            </Button>

            <p className="text-xs text-gray-500">提示：提现金额将在1-3个工作日内到账</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
