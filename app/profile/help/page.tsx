"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HelpPage() {
  const router = useRouter()
  const helpItems = [
    { title: "常见问题", desc: "面诊相关问题解答" },
    { title: "使用教程", desc: "如何使用AI面诊" },
    { title: "联系客服", desc: "在线咨询" },
  ]

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between bg-white">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="flex-1 text-center text-[17px]">帮助中心</h1>
        <div className="w-10" />
      </div>

      <div className="p-4">
        <Card className="rounded-lg overflow-hidden">
          {helpItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center justify-between w-full p-4 hover:bg-gray-50 border-b last:border-b-0"
              onClick={() => {}}
            >
              <div>
                <h3 className="text-base font-medium">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          ))}
        </Card>
      </div>
    </div>
  )
}
