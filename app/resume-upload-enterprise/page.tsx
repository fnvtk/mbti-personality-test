"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, Check, FileText, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function ResumeUploadEnterprisePage() {
  const router = useRouter()
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    phone: "",
    email: "",
    education: "",
    experience: "",
    skills: "",
    expectedSalary: "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "resume" | "photo") => {
    const files = e.target.files
    if (files && files.length > 0) {
      if (type === "resume") {
        setResumeFile(files[0])
      } else {
        setPhotoFile(files[0])
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 模拟上传处理
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "简历上传成功",
        description: "候选人信息已添加到系统",
      })

      // 重置表单
      setResumeFile(null)
      setPhotoFile(null)
      setFormData({
        name: "",
        position: "",
        phone: "",
        email: "",
        education: "",
        experience: "",
        skills: "",
        expectedSalary: "",
      })
    } catch (error) {
      toast({
        title: "上传失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      <div className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">上传候选人简历</h1>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 简历文件上传 */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-medium">简历文件</h2>
              <span className="text-xs text-gray-500">支持PDF、Word格式</span>
            </div>
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFileChange(e, "resume")}
              />
              <div className="flex flex-col items-center justify-center">
                {resumeFile ? (
                  <>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-500 mr-1" />
                      <p className="text-sm font-medium">{resumeFile.name}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <div className="flex mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => setResumeFile(null)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        删除
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="ml-2 text-xs"
                        onClick={() => document.getElementById("resumeUpload")?.click()}
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        更换
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-2">
                      <Upload className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium">点击上传简历</p>
                    <p className="text-xs text-gray-500 mt-1">或拖拽文件到此处</p>
                  </>
                )}
              </div>
            </label>
          </Card>

          {/* 照片上传 */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-medium">候选人照片</h2>
              <span className="text-xs text-gray-500">用于AI面部分析</span>
            </div>
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                id="photoUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, "photo")}
              />
              <div className="flex flex-col items-center justify-center">
                {photoFile ? (
                  <>
                    <div className="h-20 w-20 relative mb-2">
                      <img
                        src={URL.createObjectURL(photoFile) || "/placeholder.svg"}
                        alt="候选人照片"
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex mt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => setPhotoFile(null)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        删除
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="ml-2 text-xs"
                        onClick={() => document.getElementById("photoUpload")?.click()}
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        更换
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-2">
                      <Upload className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium">上传候选人照片</p>
                    <p className="text-xs text-gray-500 mt-1">正面清晰照片效果最佳</p>
                  </>
                )}
              </div>
            </label>
          </Card>

          {/* 基本信息 */}
          <div className="space-y-4">
            <h2 className="font-medium">基本信息</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  姓名
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="请输入姓名"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="position" className="text-sm font-medium">
                  应聘职位
                </label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="请输入应聘职位"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  联系电话
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="请输入联系电话"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  电子邮箱
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="请输入电子邮箱"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="education" className="text-sm font-medium">
                教育背景
              </label>
              <Textarea
                id="education"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                placeholder="请输入教育背景"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="experience" className="text-sm font-medium">
                工作经历
              </label>
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="请输入工作经历"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="skills" className="text-sm font-medium">
                技能专长
              </label>
              <Textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="请输入技能专长"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="expectedSalary" className="text-sm font-medium">
                期望薪资
              </label>
              <Input
                id="expectedSalary"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleInputChange}
                placeholder="请输入期望薪资"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
              {loading ? "处理中..." : "上传并分析"}
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              上传后系统将自动分析简历与面部特征，生成综合评估报告
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
