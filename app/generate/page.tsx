"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Sparkles, Download, Share2, CreditCard, Lock, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GeneratePage() {
  const router = useRouter()
  const [image, setImage] = useState<string | null>(null)
  const [style, setStyle] = useState<string | null>(null)
  const [generating, setGenerating] = useState(true)
  const [progress, setProgress] = useState(0)
  const [hasPaid, setHasPaid] = useState(false)

  useEffect(() => {
    setImage(localStorage.getItem("uploadedImage"))
    setStyle(localStorage.getItem("selectedStyle"))
    setHasPaid(localStorage.getItem("hasPaid") === "true")

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setGenerating(false)
          return 100
        }
        return prev + 2
      })
    }, 60)

    return () => clearInterval(interval)
  }, [])

  const handlePayment = () => {
    router.push("/payment")
  }

  const handleDownload = () => {
    alert("图片已保存到相册")
  }

  const handleShare = () => {
    router.push("/share")
  }

  const handleTryAgain = () => {
    localStorage.removeItem("hasPaid")
    router.push("/upload")
  }

  return (
    <div className="min-h-screen w-full max-w-md mx-auto flex flex-col gradient-bg">
      {/* 背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-orange-500/15 rounded-full blur-[100px]" />
      </div>

      {/* 头部 */}
      <header className="relative z-10 glass-nav sticky top-0">
        <div className="flex items-center px-4 py-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-white">发型效果</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* 主内容 */}
      <main className="flex-1 relative z-10 px-5 py-6">
        {/* 发型信息 */}
        <div className="glass-card rounded-2xl p-4 mb-4 flex items-center gap-3 border border-white/10">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-white">{style || "推荐发型"}</p>
            <p className="text-sm text-white/50">AI生成效果预览</p>
          </div>
        </div>

        {/* 效果图 */}
        <div className="glass-card rounded-3xl overflow-hidden mb-6 relative border border-white/10">
          {image ? (
            <img
              src={image || "/placeholder.svg"}
              alt="发型效果"
              className={`w-full aspect-[3/4] object-cover transition-all duration-700 ${
                !hasPaid && !generating ? "blur-2xl scale-110" : ""
              }`}
            />
          ) : (
            <div className="w-full aspect-[3/4] bg-white/5 flex items-center justify-center">
              <p className="text-white/50">请先上传照片</p>
            </div>
          )}

          {/* 生成中 */}
          {generating && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 glow-orange">
                  <Sparkles className="w-10 h-10 text-white animate-pulse" />
                </div>
                <p className="text-white font-medium mb-2">AI正在生成...</p>
                <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto">
                  <div
                    className="h-full gradient-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-white/50 text-sm mt-2">{progress}%</p>
              </div>
            </div>
          )}

          {/* 未付款遮罩 */}
          {!generating && !hasPaid && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass rounded-2xl p-6 text-center max-w-[280px] border border-white/20">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <p className="text-white font-bold text-lg mb-1">解锁高清效果图</p>
                <p className="text-white/60 text-sm mb-4">支付后可查看、下载、分享</p>
                <div className="mb-4">
                  <span className="text-white/50 text-sm line-through mr-2">¥9.9</span>
                  <span className="text-3xl font-bold text-orange-400">¥5</span>
                </div>
                <Button onClick={handlePayment} className="w-full gradient-primary text-white rounded-xl py-5">
                  <CreditCard className="w-4 h-4 mr-2" />
                  立即解锁
                </Button>
                <p className="text-white/30 text-xs mt-3">新春特惠 限时5折</p>
              </div>
            </div>
          )}
        </div>

        {/* 已付款操作 */}
        {!generating && hasPaid && (
          <div className="space-y-3 animate-fade-in">
            <Button onClick={handleDownload} className="w-full gradient-primary text-white rounded-2xl py-5">
              <Download className="w-5 h-5 mr-2" />
              保存到相册
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleShare}
                className="glass-button rounded-2xl py-5 border-white/10 text-white hover:text-white"
              >
                <Share2 className="w-5 h-5 mr-2" />
                分享
              </Button>
              <Button
                onClick={handleTryAgain}
                className="glass-button rounded-2xl py-5 border-white/10 text-white hover:text-white"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                再试一次
              </Button>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-white/30 mt-6">效果图仅供参考，实际效果可能因发质等因素有所不同</p>
      </main>
    </div>
  )
}
