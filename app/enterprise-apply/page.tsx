"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Building } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function EnterpriseApplyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [plan, setPlan] = useState("")
  const [billingCycle, setBillingCycle] = useState("")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    position: "",
    phone: "",
    email: "",
    teamSize: "",
    requirements: "",
  })

  useEffect(() => {
    const planParam = searchParams.get("plan")
    const billingParam = searchParams.get("billing")
    if (planParam) {
      setPlan(planParam)
    }
    if (billingParam) {
      setBillingCycle(billingParam)
    }
  }, [searchParams])

  const getPlanName = () => {
    switch (plan) {
      case "startup":
        return "团队启动版"
      case "growth":
        return "团队成长版"
      case "transform":
        return "团队蜕变版"
      case "single-team":
        return "单次团队分析"
      case "recruitment":
        return "招聘面试包"
      case "diagnosis":
        return "团队诊断服务"
      default:
        return "企业服务"
    }
  }

  const getPlanPrice = () => {
    switch (plan) {
      case "startup":
        return "¥19,800/年"
      case "growth":
        return "¥39,800/年"
      case "transform":
        return "¥98,000/年"
      case "single-team":
        return "¥1,980/次"
      case "recruitment":
        return "¥4,980/10人"
      case "diagnosis":
        return "¥9,800/次"
      default:
        return ""
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        title: "申请已提交",
        description: "我们的顾问将在1-2个工作日内与您联系",
      })

      // 跳转回首页
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error) {
      toast({
        title: "提交失败",
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
        <h1 className="flex-1 text-center text-lg font-medium mr-10">企业服务申请</h1>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center mb-2">
            <Building className="h-5 w-5 text-purple-600 mr-2" />
            <h2 className="font-medium">您选择的方案</h2>
          </div>
          <div className="text-lg font-bold text-purple-600">{getPlanName()}</div>
          <div className="text-sm font-medium text-gray-700 mt-1">{getPlanPrice()}</div>
          <p className="text-sm text-gray-500 mt-2">{billingCycle === "yearly" ? "年度订阅" : "按需付费"}</p>
        </Card>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">公司名称</label>
              <Input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="请输入公司名称"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">联系人姓名</label>
              <Input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="请输入联系人姓名"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">职位</label>
              <Input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="请输入您的职位"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">团队规模</label>
              <select
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">请选择团队规模</option>
                <option value="1-10">1-10人</option>
                <option value="11-30">11-30人</option>
                <option value="31-50">31-50人</option>
                <option value="51-100">51-100人</option>
                <option value="100+">100人以上</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">需求描述</label>
              <Textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="请简要描述您的团队需求和期望"
                className="h-24"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
            {loading ? "提交中..." : "提交申请"}
          </Button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">提交申请后，我们的顾问将在1-2个工作日内与您联系</p>
      </div>
    </div>
  )
}
