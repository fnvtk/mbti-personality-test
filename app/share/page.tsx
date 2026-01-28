"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Copy, Check, MessageCircle, Share2, Users, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SharePage() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const shareLink = "https://hairstyle.app/s/HF7825"

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareChannels = [
    { id: "wechat", name: "微信", icon: MessageCircle, color: "bg-green-500" },
    { id: "moments", name: "朋友圈", icon: Users, color: "bg-green-600" },
    { id: "qrcode", name: "二维码", icon: QrCode, color: "bg-gray-700" },
    { id: "more", name: "更多", icon: Share2, color: "bg-blue-500" },
  ]

  const copyTexts = [
    { text: "新年新发型！AI帮你提前预览，不踩雷～", tag: "春节特供" },
    { text: "想换发型又怕翻车？先用AI看看效果吧！", tag: "热门" },
    { text: "发现一个超好用的换发型神器，推荐给你！", tag: "推荐" },
    { text: "不用去理发店也能预览新发型，太方便了！", tag: "实用" },
  ]

  return (
    <div className="min-h-screen w-full max-w-md mx-auto flex flex-col gradient-bg">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-[60px]" />
        <div className="absolute bottom-40 left-0 w-60 h-60 bg-red-500/10 rounded-full blur-[80px]" />
      </div>

      {/* 头部 */}
      <header className="relative z-10 glass-nav sticky top-0">
        <div className="flex items-center px-4 py-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-white">分享赚钱</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* 主内容 */}
      <main className="flex-1 relative z-10 px-5 py-6 pb-24">
        {/* 分享卡片预览 */}
        <div className="glass-card rounded-3xl p-6 mb-5 text-center border border-white/10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
            <span className="text-4xl">✨</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">发型魔镜</h2>
          <p className="text-white/60 mb-4">新年焕新颜，AI帮你选发型</p>
          <div className="glass rounded-xl p-3 text-sm text-white/70 border border-white/10">
            分享好友使用，你可获得<span className="text-orange-400 font-semibold"> ¥1 </span>佣金
          </div>
        </div>

        {/* 分享渠道 */}
        <div className="glass-card rounded-2xl p-5 mb-5 border border-white/10">
          <h3 className="font-medium text-white mb-4">分享到</h3>
          <div className="grid grid-cols-4 gap-4">
            {shareChannels.map((channel) => (
              <button key={channel.id} className="flex flex-col items-center gap-2 group">
                <div
                  className={`w-14 h-14 rounded-full ${channel.color} flex items-center justify-center group-active:scale-95 transition-transform`}
                >
                  <channel.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white/60">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 复制链接 */}
        <div className="glass-card rounded-2xl p-5 mb-5 border border-white/10">
          <h3 className="font-medium text-white mb-4">复制链接</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-sm text-white/60 truncate border border-white/10">
              {shareLink}
            </div>
            <Button
              onClick={handleCopy}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl px-5 h-11 shadow-lg shadow-orange-500/20"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* 推荐话术 */}
        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <h3 className="font-medium text-white mb-4">推荐话术</h3>
          <div className="space-y-3">
            {copyTexts.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  navigator.clipboard.writeText(item.text)
                }}
                className="p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-white/80 flex-1">{item.text}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 whitespace-nowrap">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-white/40 mt-2 group-hover:text-orange-400 transition-colors">点击复制</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
