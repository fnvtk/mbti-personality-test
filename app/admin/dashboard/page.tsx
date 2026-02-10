"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, User, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showPricingDialog, setShowPricingDialog] = useState(false)
  const [pricingConfig, setPricingConfig] = useState({
    faceTest: 1,
    mbtiTest: 3,
    pdpTest: 3,
    discTest: 3,
    fullReport: 10,
    teamAnalysis: 50,
  })

  // 检查登录状态
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    if (!adminLoggedIn) {
      router.push("/admin/login")
    } else {
      setIsLoggedIn(true)
    }
  }, [router])

  // 保存价格配置
  const handleSavePricing = () => {
    localStorage.setItem("pricingConfig", JSON.stringify(pricingConfig))
    setShowPricingDialog(false)
  }

  // 统计数据（模拟）
  const stats = {
    totalUsers: 128,
    testsCompleted: 342,
    activeToday: 24,
    pendingReviews: 8,
  }

  if (!isLoggedIn) {
    return null // 等待重定向
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">总用户数</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">已完成测试</p>
                <p className="text-2xl font-bold">{stats.testsCompleted}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">今日活跃</p>
                <p className="text-2xl font-bold">{stats.activeToday}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <BarChart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">待审核</p>
                <p className="text-2xl font-bold">{stats.pendingReviews}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <User className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 最近活动 */}
      <Card>
        <CardHeader>
          <CardTitle>最近活动</CardTitle>
          <CardDescription>用户最近的测试和注册活动</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { user: "张三", action: "完成了DISC测试", time: "10分钟前" },
              { user: "李四", action: "注册了新账号", time: "30分钟前" },
              { user: "王五", action: "完成了MBTI测试", time: "1小时前" },
              { user: "赵六", action: "完成了PDP测试", time: "2小时前" },
              { user: "钱七", action: "上传了照片分析", time: "3小时前" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-sm text-gray-500">{activity.action}</p>
                </div>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 测试收费配置对话框 */}
      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>测试收费配置</DialogTitle>
            <DialogDescription>设置各类测试的收费标准</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="face-test-price">人脸测试价格 (元/次)</Label>
              <Input
                id="face-test-price"
                type="number"
                value={pricingConfig.faceTest}
                onChange={(e) => setPricingConfig({ ...pricingConfig, faceTest: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mbti-test-price">MBTI测试价格 (元/次)</Label>
              <Input
                id="mbti-test-price"
                type="number"
                value={pricingConfig.mbtiTest}
                onChange={(e) => setPricingConfig({ ...pricingConfig, mbtiTest: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pdp-test-price">PDP测试价格 (元/次)</Label>
              <Input
                id="pdp-test-price"
                type="number"
                value={pricingConfig.pdpTest}
                onChange={(e) => setPricingConfig({ ...pricingConfig, pdpTest: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="disc-test-price">DISC测试价格 (元/次)</Label>
              <Input
                id="disc-test-price"
                type="number"
                value={pricingConfig.discTest}
                onChange={(e) => setPricingConfig({ ...pricingConfig, discTest: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full-report-price">完整报告价格 (元/份)</Label>
              <Input
                id="full-report-price"
                type="number"
                value={pricingConfig.fullReport}
                onChange={(e) => setPricingConfig({ ...pricingConfig, fullReport: Number(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-analysis-price">团队分析价格 (元/次)</Label>
              <Input
                id="team-analysis-price"
                type="number"
                value={pricingConfig.teamAnalysis}
                onChange={(e) => setPricingConfig({ ...pricingConfig, teamAnalysis: Number(e.target.value) })}
                min="1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPricingDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSavePricing}>保存配置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
