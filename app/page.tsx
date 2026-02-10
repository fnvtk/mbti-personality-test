"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import BottomNav from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Camera, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

// MBTI 16类型角色数据
const bossTeam = [
  { type: "ENTJ", name: "镇山的虎", emoji: "🐯" },
  { type: "ESTJ", name: "敏捷的豹", emoji: "🐆" },
  { type: "INTJ", name: "远见的鹰", emoji: "🦅" },
  { type: "ISTP", name: "善战的狼", emoji: "🐺" },
  { type: "ENTP", name: "狡诈的狐", emoji: "🦊" },
]

const realTeam = [
  { type: "ENFP", name: "装饭的桶", emoji: "🪣" },
  { type: "ENFJ", name: "看门的狗", emoji: "🐕" },
  { type: "ENTP", name: "搅屎的棍", emoji: "🥢" },
  { type: "ISTJ", name: "生产的驴", emoji: "🫏" },
  { type: "ESFP", name: "出头的鸟", emoji: "🐦" },
  { type: "INTP", name: "划水的鱼", emoji: "🐟" },
  { type: "ISFJ", name: "做猴的鸡", emoji: "🐔" },
  { type: "ESTP", name: "害群的马", emoji: "🐴" },
  { type: "INFP", name: "退堂的鼓", emoji: "🥁" },
]

export default function HomePage() {
  const router = useRouter()
  const [adminClicks, setAdminClicks] = useState(0)

  const handleTitleClick = () => {
    setAdminClicks((prev) => {
      const newCount = prev + 1
      if (newCount >= 5) {
        router.push("/admin/login")
        return 0
      }
      return newCount
    })
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-gradient-to-b from-rose-50 via-white to-rose-50">
      {/* 顶部 */}
      <header className="px-4 pt-4 pb-2 safe-area-top">
        <div className="flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-rose-500 mr-2" />
          <h1 className="text-lg font-bold cursor-pointer" onClick={handleTitleClick}>
            神仙团队AI性格测试
          </h1>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 px-4 pb-24 overflow-auto">
        
        {/* MBTI团队角色图卡片 */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-5">
          {/* 老板想要的团队 */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-5 pb-4">
            <h2 className="text-center text-red-600 font-black text-lg mb-4">老板想要的团队</h2>
            <div className="flex justify-center gap-3">
              {bossTeam.map((item) => (
                <div key={item.type} className="text-center" onClick={() => router.push(`/test/mbti`)}>
                  <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-2xl mb-1 mx-auto border-2 border-rose-200">
                    {item.emoji}
                  </div>
                  <p className="text-[10px] font-bold text-rose-600">{item.type}</p>
                  <p className="text-[9px] text-gray-500">{item.name}</p>
                </div>
              ))}
            </div>

            {/* 标签 */}
            <div className="flex justify-end mt-2">
              <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">MBTI性格分析</span>
            </div>
          </div>

          {/* 现实中的团队 */}
          <div className="p-5 pt-4">
            <h2 className="text-center text-red-600 font-black text-lg mb-4">现实中的团队</h2>
            <div className="grid grid-cols-5 gap-2">
              {realTeam.map((item, i) => (
                <div key={`${item.type}-${i}`} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-50 shadow-sm flex items-center justify-center text-xl mb-1 mx-auto border border-gray-200">
                    {item.emoji}
                  </div>
                  <p className="text-[9px] font-bold text-gray-600">{item.type}</p>
                  <p className="text-[8px] text-gray-400 leading-tight">{item.name}</p>
                </div>
              ))}
            </div>

            {/* 底部标签 */}
            <div className="flex justify-between mt-3">
              <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full">性格匹配</span>
              <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full">特质评估</span>
            </div>
          </div>
        </div>

        {/* 测试流程 */}
        <div className="mb-5">
          <h2 className="text-center text-rose-500 font-bold text-base mb-4">测试流程</h2>
          <div className="flex items-center justify-center gap-2">
            {[
              { step: 1, label: "STEP1", desc: "拍摄照片", color: "bg-red-500" },
              { step: 2, label: "STEP2", desc: "AI分析", color: "bg-gray-400" },
              { step: 3, label: "STEP3", desc: "性格测试", color: "bg-gray-400" },
            ].map((item, i) => (
              <div key={item.step} className="flex items-center">
                <div className="text-center">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-1",
                    item.color
                  )}>
                    {item.step}
                  </div>
                  <p className="text-[10px] text-gray-500">{item.label}</p>
                  <p className="text-xs font-medium">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="w-8 h-0.5 bg-rose-200 mx-1 -mt-5" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI面部测试按钮 */}
        <Button 
          className="w-full py-6 rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white text-lg font-bold shadow-lg shadow-rose-200 mb-4"
          onClick={() => router.push("/camera")}
        >
          <Camera className="h-5 w-5 mr-2" />
          开始AI面部测试
        </Button>

        {/* 其他测试入口 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Button 
            variant="outline"
            className="flex flex-col items-center py-4 h-auto rounded-xl border-purple-200 hover:bg-purple-50"
            onClick={() => router.push("/test/mbti")}
          >
            <span className="text-lg mb-1">🧠</span>
            <span className="text-xs font-medium">MBTI测试</span>
            <span className="text-[10px] text-gray-400">90题</span>
          </Button>
          <Button 
            variant="outline"
            className="flex flex-col items-center py-4 h-auto rounded-xl border-blue-200 hover:bg-blue-50"
            onClick={() => router.push("/test/disc")}
          >
            <span className="text-lg mb-1">💬</span>
            <span className="text-xs font-medium">DISC测试</span>
            <span className="text-[10px] text-gray-400">20题</span>
          </Button>
          <Button 
            variant="outline"
            className="flex flex-col items-center py-4 h-auto rounded-xl border-amber-200 hover:bg-amber-50"
            onClick={() => router.push("/test/pdp")}
          >
            <span className="text-lg mb-1">🐯</span>
            <span className="text-xs font-medium">PDP测试</span>
            <span className="text-[10px] text-gray-400">20题</span>
          </Button>
        </div>

        {/* 定价入口 */}
        <div 
          className="bg-gradient-to-r from-purple-50 to-rose-50 rounded-2xl p-4 flex items-center justify-between cursor-pointer"
          onClick={() => router.push("/pricing")}
        >
          <div>
            <p className="text-sm font-bold">个人深度洞察版</p>
            <p className="text-xs text-gray-500">AI面相+MBTI+PDP+DISC+盖洛普</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-rose-600">¥198</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>

      </main>

      <BottomNav currentPath="/" />
    </div>
  )
}
