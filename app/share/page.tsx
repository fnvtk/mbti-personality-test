"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Share2 } from "lucide-react"
import { useRouter } from "next/navigation"
import BottomNav from "@/components/ui/bottom-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RewardRecipient {
  id: number
  name: string
  avatar: string
  amount: number
  time: string
}

export default function SharePage() {
  const router = useRouter()
  const [recipients] = useState<RewardRecipient[]>([
    {
      id: 1,
      name: "小红",
      avatar: "/placeholder.svg",
      amount: 38,
      time: "刚刚",
    },
    {
      id: 2,
      name: "小明",
      avatar: "/placeholder.svg",
      amount: 42,
      time: "2分钟前",
    },
    {
      id: 3,
      name: "小张",
      avatar: "/placeholder.svg",
      amount: 15,
      time: "5分钟前",
    },
  ])

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between bg-white">
        <h1 className="text-[17px]">分享得红包</h1>
        <Button variant="ghost" size="icon">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Share Card */}
      <Card className="mx-4 mt-4 p-6">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image src="/placeholder.svg" alt="Share reward" fill className="object-contain" />
          </div>
          <h3 className="text-lg font-medium mb-2">邀请好友得红包</h3>
          <p className="text-base text-pink-500 font-medium mb-4">可得1-50元红包</p>
          <Button className="w-full bg-pink-500 hover:bg-pink-600" onClick={() => router.push("/share/moments")}>
            立即分享
          </Button>
        </div>
      </Card>

      {/* Recent Recipients */}
      <div className="px-4 mt-4">
        <h4 className="text-sm font-medium mb-2">最近领取</h4>
        <Card className="divide-y">
          {recipients.map((recipient) => (
            <div key={recipient.id} className="flex items-center gap-3 p-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={recipient.avatar} />
                <AvatarFallback>{recipient.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{recipient.name}</span>
                  <span className="text-pink-500">获得{recipient.amount}元</span>
                </div>
                <div className="text-xs text-gray-500">{recipient.time}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Share Tips */}
      <div className="p-4 mt-4">
        <h4 className="text-sm font-medium mb-2">分享说明</h4>
        <Card className="p-4">
          <div className="space-y-2 text-sm text-gray-600">
            <p>1. 邀请好友完成面诊即可获得红包奖励</p>
            <p>2. 每邀请一位好友完成面诊可得1-50元红包</p>
            <p>3. 活动期间邀请人数不限</p>
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentPath="/share" />
    </div>
  )
}
