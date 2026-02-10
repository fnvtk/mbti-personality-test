"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CameraPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [isCapturing, setIsCapturing] = useState(false)
  const [cameraStarted, setCameraStarted] = useState(false)

  const photoAngles = ["正面", "左侧", "右侧"]
  const photoInstructions = [
    "请保持正面朝向摄像头，表情自然",
    "请将头部向左转45度，保持自然表情",
    "请将头部向右转45度，保持自然表情",
  ]

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setCameraStarted(true)
    } catch (error) {
      console.error("无法访问摄像头:", error)
      alert("无法访问摄像头，请确保已授权摄像头权限")
    }
  }, [])

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
      setCapturedPhotos((prev) => [...prev, photoDataUrl])

      if (currentStep < 3) {
        setCurrentStep((prev) => prev + 1)
      } else {
        // 完成所有拍摄后跳转到分析页面
        finishCapture([...capturedPhotos, photoDataUrl])
      }

      setIsCapturing(false)
    }, 100)
  }, [currentStep, capturedPhotos])

  const finishCapture = useCallback(
    (photos: string[]) => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      // 保存照片数据到 sessionStorage
      sessionStorage.setItem("uploadedPhotoUrls", JSON.stringify(photos))
      sessionStorage.setItem("photoAngles", JSON.stringify(photoAngles))
      sessionStorage.setItem("analysisStartTime", Date.now().toString())

      router.push("/analysis")
    },
    [stream, router],
  )

  const goBack = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    router.back()
  }

  // 页面加载时自动启动摄像头
  useEffect(() => {
    startCamera()
  }, [startCamera])

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      {/* 头部 */}
      <div className="px-4 py-3 flex items-center justify-between bg-white border-b">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium">拍摄照片</h1>
        <div className="w-10"></div>
      </div>

      {/* 进度指示器 */}
      <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-pink-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-red-600">步骤 {Math.min(currentStep, 3)}/3</span>
          <span className="text-xs text-gray-500">{capturedPhotos.length}/3 张照片已完成</span>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1">
              <div
                className={`h-2 rounded-full ${
                  capturedPhotos.length >= step ? "bg-green-500" : currentStep === step ? "bg-red-500" : "bg-gray-200"
                }`}
              ></div>
            </div>
          ))}
        </div>

        {currentStep <= 3 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-red-100">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">{currentStep}</span>
              </div>
              <div>
                <div className="font-medium text-sm text-red-700">{photoAngles[currentStep - 1]}照片</div>
                <div className="text-xs text-gray-600 mt-1">{photoInstructions[currentStep - 1]}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 相机预览区域 */}
      <div className="flex-1 p-4">
        <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden border-4 border-gray-300">
          {cameraStarted ? (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />

              {/* 拍摄闪光效果 */}
              {isCapturing && (
                <div className="absolute inset-0 bg-white opacity-80 flex items-center justify-center">
                  <div className="text-black text-xl font-bold">拍摄中...</div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-lg mb-2">启动摄像头中...</div>
                <div className="text-sm opacity-70">请允许摄像头权限</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 拍摄按钮 */}
      <div className="p-6">
        <Button
          onClick={capturePhoto}
          disabled={!cameraStarted || isCapturing}
          className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-full text-lg font-medium"
        >
          {isCapturing ? "拍摄中..." : `拍摄${photoAngles[currentStep - 1]}照片`}
        </Button>
      </div>
    </div>
  )
}
