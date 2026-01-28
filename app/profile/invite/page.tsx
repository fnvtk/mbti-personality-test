"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Copy, Check, Share2, Users, Wallet, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"

const recentInvites = [
  { name: "用户***825", time: "10分钟前", amount: 2.5 },
  { name: "用户***136", time: "1小时前", amount: 2.5 },
  { name: "用户***789", time: "3小时前", amount: 2.5 },
  { name: "用户***456", time: "昨天", amount: 2.5 },
]

export default function InvitePage() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const inviteCode = "HF7825"

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen w-full max-w-md mx-auto flex flex-col gradient-bg">
      {/* 背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-red-500/20 rounded-full blur-[100px]" />
      </div>

      {/* 头部 */}
      <header className="relative z-10 glass-nav sticky top-0">
        <div className="flex items-center px-4 py-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-white">邀请得现金</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* 主内容 */}
      <main className="flex-1 relative z-10 px-5 py-6">
        {/* 收益卡片 */}
        <div className="rounded-3xl p-6 mb-4 gradient-accent text-white text-center glow-red">
          <Gift className="w-8 h-8 mx-auto mb-2" />
          <h2 className="text-lg mb-2">累计收益</h2>
          <p className="text-4xl font-bold mb-4">¥360.00</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 rounded-xl p-3">
              <Users className="w-5 h-5 mx-auto mb-1" />
              <p className="text-sm text-white/70">邀请人数</p>
              <p className="text-xl font-bold">12人</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <Wallet className="w-5 h-5 mx-auto mb-1" />
              <p className="text-sm text-white/70">可提现</p>
              <p className="text-xl font-bold">¥150.00</p>
            </div>
          </div>
        </div>

        {/* 邀请码 */}
        <div className="glass-card rounded-2xl p-5 mb-4 border border-white/10">
          <h3 className="font-medium text-white mb-4">我的邀请码</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white/10 rounded-xl px-4 py-3 font-mono text-xl text-center font-bold text-orange-400">
              {inviteCode}
            </div>
            <Button onClick={() => handleCopy(inviteCode)} className="gradient-primary text-white rounded-xl px-6 h-12">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* 分享按钮 */}
        <Button className="w-full gradient-primary text-white rounded-xl py-5 mb-4">
          <Share2 className="w-5 h-5 mr-2" />
          分享给好友
        </Button>

        {/* 邀请规则 */}
        <div className="glass-card rounded-2xl p-5 mb-4 border border-white/10">
          <h3 className="font-medium text-white mb-4">邀请规则</h3>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <span>好友通过您的邀请码注册并完成首次付费，您可获得50%分成</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <span>每邀请一位好友付费5元，您可获得2.5元奖励</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <span>收益可随时提现到微信或支付宝</span>
            </li>
          </ul>
        </div>

        {/* 最近邀请 */}
        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <h3 className="font-medium text-white mb-4">最近邀请</h3>
          <div className="space-y-3">
            {recentInvites.map((invite, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="font-medium text-white">{invite.name}</p>
                  <p className="text-xs text-white/40">{invite.time}</p>
                </div>
                <span className="text-green-400 font-medium">+¥{invite.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
