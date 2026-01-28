"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Camera, Upload, X, ArrowLeft, Check, AlertCircle, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("图片大小不能超过10MB")
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNext = () => {
    if (!image) return
    localStorage.setItem("uploadedImage", image)
    router.push("/hairstyles")
  }

  return (
    <div className="min-h-screen w-full max-w-md mx-auto flex flex-col gradient-bg">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-orange-500/15 rounded-full blur-[80px]" />
      </div>

      {/* 头部 */}
      <header className="relative z-10 glass-nav sticky top-0">
        <div className="flex items-center px-4 py-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-white">上传照片</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* 主内容 */}
      <main className="flex-1 relative z-10 px-5 py-6 flex flex-col">
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

        <div className="flex-1 flex flex-col">
          {image ? (
            <div className="relative flex-1">
              <div className="glass-card rounded-3xl overflow-hidden h-full border border-white/10">
                <img src={image || "/placeholder.svg"} alt="上传的照片" className="w-full h-full object-cover" />
              </div>
              <button
                onClick={() => setImage(null)}
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full border border-white/20"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="glass-card rounded-3xl flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors border border-dashed border-white/20"
            >
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mb-4 glow-orange">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <p className="font-medium text-white">点击上传照片</p>
              <p className="text-sm text-white/50 mt-1">支持拍照或从相册选择</p>
              <div className="flex gap-4 mt-6">
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <Camera className="w-4 h-4" />
                  <span>拍照</span>
                </div>
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <ImageIcon className="w-4 h-4" />
                  <span>相册</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* 提示 */}
        <div className="glass-card rounded-2xl p-4 mt-4 border border-white/10">
          <p className="text-xs text-white/50 mb-2">拍照建议</p>
          <div className="space-y-2">
            {["正脸清晰，五官可见", "光线充足，避免逆光", "头发自然下垂，不遮挡脸部"].map((tip, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-400" />
                <span className="text-sm text-white/70">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 按钮 */}
        <div className="mt-4">
          {image ? (
            <Button
              onClick={handleNext}
              className="w-full gradient-primary text-white rounded-2xl py-6 text-lg font-medium"
            >
              下一步：选择发型
            </Button>
          ) : (
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full gradient-primary text-white rounded-2xl py-6 text-lg font-medium"
            >
              <Upload className="w-5 h-5 mr-2" />
              选择照片
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
