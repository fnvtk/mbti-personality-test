"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileUp, FileText, Camera, User } from "lucide-react"
import BottomNav from "@/components/ui/bottom-nav"

export default function DashboardPage() {
  const router = useRouter()
  const [testProgress, setTestProgress] = useState({
    resumeUploaded: false,
    mbtiCompleted: false,
    pdpCompleted: false,
    discCompleted: false,
    photoUploaded: false,
  })

  const totalSteps = 5
  const completedSteps = Object.values(testProgress).filter(Boolean).length
  const progressPercentage = (completedSteps / totalSteps) * 100

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between bg-white">
        <h1 className="text-[17px]">个人测评中心</h1>
        <Button variant="ghost" size="icon" onClick={() => router.push("/profile")} className="text-gray-600">
          <User className="h-5 w-5" />
        </Button>
      </div>

      {/* Progress Card */}
      <Card className="m-4 p-4">
        <h2 className="font-medium mb-2">测评进度</h2>
        <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
          <div className="h-full bg-purple-600 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="text-sm text-gray-600">
          已完成 {completedSteps}/{totalSteps} 步骤
        </div>
      </Card>

      {/* Action Cards */}
      <div className="px-4 space-y-4 flex-1 overflow-auto pb-20">
        <Card
          className={`p-4 ${testProgress.resumeUploaded ? "border-green-500" : "border-gray-200"}`}
          onClick={() => router.push("/resume-upload")}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <FileUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">上传简历</h3>
              <p className="text-sm text-gray-500">上传您的个人简历，开始测评流程</p>
            </div>
            <div className="text-purple-600">{testProgress.resumeUploaded ? "已完成" : "开始"}</div>
          </div>
        </Card>

        <Card
          className={`p-4 ${testProgress.mbtiCompleted ? "border-green-500" : "border-gray-200"}`}
          onClick={() => router.push("/test/mbti")}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">MBTI性格测试</h3>
              <p className="text-sm text-gray-500">了解您的性格倾向和行为模式</p>
            </div>
            <div className="text-purple-600">{testProgress.mbtiCompleted ? "已完成" : "开始"}</div>
          </div>
        </Card>

        <Card
          className={`p-4 ${testProgress.pdpCompleted ? "border-green-500" : "border-gray-200"}`}
          onClick={() => router.push("/test/pdp")}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">PDP测试</h3>
              <p className="text-sm text-gray-500">评估您的行为偏好和思维方式</p>
            </div>
            <div className="text-purple-600">{testProgress.pdpCompleted ? "已完成" : "开始"}</div>
          </div>
        </Card>

        <Card
          className={`p-4 ${testProgress.discCompleted ? "border-green-500" : "border-gray-200"}`}
          onClick={() => router.push("/test/disc")}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">DISC测试</h3>
              <p className="text-sm text-gray-500">测量您的情绪反应和沟通风格</p>
            </div>
            <div className="text-purple-600">{testProgress.discCompleted ? "已完成" : "开始"}</div>
          </div>
        </Card>

        <Card
          className={`p-4 ${testProgress.photoUploaded ? "border-green-500" : "border-gray-200"}`}
          onClick={() => router.push("/camera")}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <Camera className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">上传照片</h3>
              <p className="text-sm text-gray-500">上传照片进行面部表情分析</p>
            </div>
            <div className="text-purple-600">{testProgress.photoUploaded ? "已完成" : "开始"}</div>
          </div>
        </Card>

        {completedSteps === totalSteps && (
          <Button className="w-full bg-purple-600 hover:bg-purple-700 mt-4" onClick={() => router.push("/report")}>
            查看测评报告
          </Button>
        )}
      </div>

      <BottomNav currentPath="/dashboard" />
    </div>
  )
}
