"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OrdersPage() {
  const router = useRouter()
  const [orders] = useState([])

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between bg-white">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="flex-1 text-center text-[17px]">我的订单</h1>
        <div className="w-10" />
      </div>

      {orders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-gray-500 text-sm">暂无订单</p>
        </div>
      ) : (
        <div className="flex-1 p-4">{/* Order list would go here */}</div>
      )}
    </div>
  )
}
