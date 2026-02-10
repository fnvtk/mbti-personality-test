"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Mail, Phone, MessageSquare } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function EnterpriseContactPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 模拟提交处理
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 提交成功
      toast({
        title: "消息已发送",
        description: "我们将尽快与您联系",
      })

      // 重置表单
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "发送失败",
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
        <h1 className="flex-1 text-center text-lg font-medium mr-10">联系我们</h1>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold">需要定制企业方案？</h2>
          <p className="text-gray-500 mt-1">填写下方表单，我们的企业顾问将与您联系</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">您的姓名</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="请输入您的姓名"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">公司名称</label>
            <Input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="请输入公司名称"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="请输入电子邮箱"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="请输入联系电话"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">您的需求</label>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="请描述您的企业需求"
              className="h-32"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
            {loading ? "发送中..." : "发送消息"}
          </Button>
        </form>

        <div className="mt-8">
          <h3 className="font-medium text-gray-800 mb-4">其他联系方式</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <Mail className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">电子邮箱</p>
                <p className="text-sm text-gray-500">enterprise@shenxianteam.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <Phone className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">企业服务热线</p>
                <p className="text-sm text-gray-500">400-888-9999</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">企业微信</p>
                <p className="text-sm text-gray-500">shenxianteam_enterprise</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
