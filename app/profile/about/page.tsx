"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between bg-white">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="flex-1 text-center text-[17px]">关于我们</h1>
        <div className="w-10" />
      </div>

      <div className="p-4 flex-1">
        <Card className="p-6 text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <Image src="/placeholder.svg" alt="Logo" fill className="object-contain" />
          </div>
          <h2 className="text-lg font-medium mb-2">艺施AI面诊</h2>
          <p className="text-sm text-gray-500 mb-4">Version 1.0.0</p>
          <div className="space-y-4 text-sm text-gray-600">
            <p>艺施AI面诊是一款专业的智能肌肤检测工具， 通过先进的AI技术为您提供精准的肌肤分析和个性化护理方案。</p>
            <p>我们致力于为用户提供科学、专业的肌肤检测服务， 帮助您更好地了解和呵护自己的肌肤。</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
