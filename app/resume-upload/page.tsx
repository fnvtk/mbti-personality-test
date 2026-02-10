"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, FileText } from "lucide-react"

export default function ResumeUploadPage() {
  const router = useRouter()
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (
        file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword"
      ) {
        setResumeFile(file)
      } else {
        alert("请上传PDF或Word格式的文件")
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (
        file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword"
      ) {
        setResumeFile(file)
      } else {
        alert("请上传PDF或Word格式的文件")
      }
    }
  }

  const handleSubmit = async () => {
    if (!resumeFile) {
      alert("请先上传简历文件")
      return
    }

    setIsUploading(true)

    try {
      // 模拟上传过程
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 保存文件信息到 sessionStorage
      sessionStorage.setItem("resumeFileName", resumeFile.name)
      sessionStorage.setItem("resumeFileSize", resumeFile.size.toString())
      sessionStorage.setItem("resumeUploadTime", Date.now().toString())

      // 跳转到下一步
      router.push("/camera")
    } catch (error) {
      console.error("上传失败:", error)
      alert("上传失败，请重试")
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = () => {
    setResumeFile(null)
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      {/* 头部 */}
      <div className="px-4 py-3 flex items-center justify-between bg-white border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium">上传候选人简历</h1>
        <div className="w-10"></div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 p-6">
        {/* 简历文件上传 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">简历文件</h2>
            <span className="text-sm text-gray-500">支持PDF、Word格式</span>
          </div>

          {!resumeFile ? (
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-purple-400 bg-purple-50"
                  : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">点击上传简历</h3>
                <p className="text-sm text-gray-500">或拖拽文件到此处</p>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{resumeFile.name}</div>
                  <div className="text-sm text-gray-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeFile}
                  className="text-red-600 hover:text-red-700 bg-transparent"
                >
                  删除
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="p-6 border-t">
        <Button
          onClick={handleSubmit}
          disabled={!resumeFile || isUploading}
          className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-lg font-medium"
        >
          {isUploading ? "上传中..." : "下一步"}
        </Button>
      </div>
    </div>
  )
}
