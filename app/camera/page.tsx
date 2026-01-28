"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera, RotateCcw, Check, ImagePlus } from "lucide-react"
import { cn } from "@/lib/utils"
import BottomNav from "@/components/bottom-nav"

export default function CameraPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [isCapturing, setIsCapturing] = useState(false)
  const [cameraStarted, setCameraStarted] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [useUpload, setUseUpload] = useState(false)

  const photoAngles = ["正面", "左侧", "右侧"]
  const photoInstructions = [
    "请保持正面朝向摄像头，表情自然",
    "请将头部向左转45度，保持自然表情",
    "请将头部向右转45度，保持自然表情",
  ]

  // 启动摄像头
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setCameraStarted(true)
      setUseUpload(false)
    } catch (error: any) {
      console.error("无法访问摄像头:", error)
      setCameraError("无法访问摄像头，请确保已授权摄像头权限，或选择上传照片")
      setUseUpload(true)
    }
  }, [])

  // 拍摄照片
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)

    setTimeout(() => {
      const canvas = canvasRef.current!
      const video = videoRef.current!
      const context = canvas.getContext("2d")!

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)

      const photoDataUrl = canvas.toDataURL("image/jpeg", 0.8)
      const newPhotos = [...capturedPhotos, photoDataUrl]
      setCapturedPhotos(newPhotos)

      if (currentStep < 3) {
        setCurrentStep((prev) => prev + 1)
      } else {
        finishCapture(newPhotos)
      }

      setIsCapturing(false)
    }, 100)
  }, [currentStep, capturedPhotos])

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const photoDataUrl = e.target?.result as string
      const newPhotos = [...capturedPhotos, photoDataUrl]
      setCapturedPhotos(newPhotos)

      if (currentStep < 3) {
        setCurrentStep((prev) => prev + 1)
      } else {
        finishCapture(newPhotos)
      }
    }
    reader.readAsDataURL(file)
    
    // 重置input以允许重复选择同一文件
    event.target.value = ""
  }

  // 完成拍摄
  const finishCapture = useCallback(
    (photos: string[]) => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      // 保存照片数据到sessionStorage
      sessionStorage.setItem("uploadedPhotoUrls", JSON.stringify(photos))
      sessionStorage.setItem("photoAngles", JSON.stringify(photoAngles))
      sessionStorage.setItem("analysisStartTime", Date.now().toString())

      router.push("/analysis")
    },
    [stream, router],
  )

  // 重新拍摄当前照片
  const retakePhoto = () => {
    if (capturedPhotos.length > 0) {
      setCapturedPhotos(capturedPhotos.slice(0, -1))
      setCurrentStep(capturedPhotos.length)
    }
  }

  // 返回上一页
  const goBack = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    router.back()
  }

  // 页面加载时启动摄像头
  useEffect(() => {
    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-gradient-to-b from-rose-50 to-white">
      {/* 头部 */}
      <header className="glass-nav sticky top-0 z-40 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={goBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">AI人脸测试</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* 进度指示器 */}
      <div className="px-4 py-4 bg-gradient-to-r from-rose-50 to-pink-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-rose-600">
            步骤 {Math.min(currentStep, 3)}/3
          </span>
          <span className="text-xs text-gray-500">
            {capturedPhotos.length}/3 张照片已完成
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  capturedPhotos.length >= step
                    ? "bg-green-500"
                    : currentStep === step
                    ? "bg-rose-500"
                    : "bg-gray-200"
                )}
              />
            </div>
          ))}
        </div>

        {currentStep <= 3 && (
          <div className="glass-card p-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full gradient-personal flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">{currentStep}</span>
              </div>
              <div>
                <div className="font-medium text-sm text-rose-700">
                  {photoAngles[currentStep - 1]}照片
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {photoInstructions[currentStep - 1]}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 相机/上传区域 */}
      <div className="flex-1 p-4">
        {useUpload ? (
          // 上传模式
          <div className="w-full h-full bg-gray-100 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-6">
            <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mb-4">
              <ImagePlus className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">上传{photoAngles[currentStep - 1]}照片</h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              {photoInstructions[currentStep - 1]}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="gradient-personal text-white"
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              选择照片
            </Button>
            
            {cameraError && (
              <div className="mt-4">
                <Button
                  variant="link"
                  className="text-rose-500"
                  onClick={startCamera}
                >
                  重试摄像头
                </Button>
              </div>
            )}
          </div>
        ) : (
          // 摄像头模式
          <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden border-4 border-gray-300">
            {cameraStarted ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                  style={{ transform: "scaleX(-1)" }}
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* 人脸引导框 */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-64 border-2 border-white/50 rounded-[100px] border-dashed" />
                </div>

                {/* 拍摄闪光效果 */}
                {isCapturing && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center animate-pulse">
                    <div className="text-black text-xl font-bold">拍摄中...</div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white mx-auto mb-3" />
                  <div className="text-lg mb-2">启动摄像头中...</div>
                  <div className="text-sm opacity-70">请允许摄像头权限</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 已拍摄照片预览 */}
        {capturedPhotos.length > 0 && (
          <div className="flex gap-2 mt-4 justify-center">
            {capturedPhotos.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={photo}
                  alt={`已拍摄 ${photoAngles[index]}`}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-green-400"
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 拍摄按钮 */}
      <div className="p-4 pb-24 space-y-3">
        {!useUpload && (
          <Button
            onClick={capturePhoto}
            disabled={!cameraStarted || isCapturing}
            className="w-full py-6 gradient-personal text-white rounded-2xl text-lg font-medium"
          >
            {isCapturing ? (
              "拍摄中..."
            ) : (
              <>
                <Camera className="w-5 h-5 mr-2" />
                拍摄{photoAngles[currentStep - 1]}照片
              </>
            )}
          </Button>
        )}

        {capturedPhotos.length > 0 && (
          <Button
            variant="outline"
            onClick={retakePhoto}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重新拍摄上一张
          </Button>
        )}

        {!useUpload && (
          <Button
            variant="link"
            onClick={() => setUseUpload(true)}
            className="w-full text-gray-500"
          >
            或者上传本地照片
          </Button>
        )}
      </div>

      <BottomNav currentPath="/camera" />
    </div>
  )
}
