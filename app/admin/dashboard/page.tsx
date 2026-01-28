"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  BarChart3, Users, FileText, Camera, TrendingUp, 
  DollarSign, Calendar, Activity, Settings
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [showPricingDialog, setShowPricingDialog] = useState(false)
  const [pricingConfig, setPricingConfig] = useState({
    faceTest: 1,
    mbtiTest: 3,
    pdpTest: 3,
    discTest: 3,
    fullReport: 10,
    teamAnalysis: 50,
  })

  // 加载价格配置
  useEffect(() => {
    const savedPricing = localStorage.getItem("pricingConfig")
    if (savedPricing) {
      setPricingConfig(JSON.parse(savedPricing))
    }
  }, [])

  // 保存价格配置
  const handleSavePricing = () => {
    localStorage.setItem("pricingConfig", JSON.stringify(pricingConfig))
    setShowPricingDialog(false)
  }

  // 统计数据（模拟）
  const stats = {
    totalUsers: 1286,
    testsCompleted: 3420,
    activeToday: 142,
    revenue: 12580,
    faceTests: 856,
    mbtiTests: 1230,
    discTests: 678,
    pdpTests: 656,
  }

  // 最近活动
  const recentActivities = [
    { user: "张三", action: "完成了MBTI测试", time: "10分钟前", type: "mbti" },
    { user: "李四", action: "注册了新账号", time: "30分钟前", type: "register" },
    { user: "王五", action: "完成了人脸测试", time: "1小时前", type: "face" },
    { user: "赵六", action: "完成了DISC测试", time: "2小时前", type: "disc" },
    { user: "钱七", action: "购买了完整报告", time: "3小时前", type: "purchase" },
    { user: "孙八", action: "完成了PDP测试", time: "4小时前", type: "pdp" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
          <p className="text-gray-500 mt-1">欢迎回来，这是您的系统概览</p>
        </div>
        <Button onClick={() => setShowPricingDialog(true)} className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          价格设置
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">总用户数</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% 较上周
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">已完成测试</p>
                <p className="text-3xl font-bold text-gray-900">{stats.testsCompleted.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% 较上周
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
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
                <p className="text-3xl font-bold text-gray-900">{stats.activeToday}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <Activity className="h-3 w-3 mr-1" />
                  在线用户
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">本月收入</p>
                <p className="text-3xl font-bold text-gray-900">¥{stats.revenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15% 较上月
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 测试类型统计 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>测试类型分布</CardTitle>
            <CardDescription>各类型测试完成数量统计</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "人脸测试", count: stats.faceTests, color: "bg-rose-500", icon: Camera },
                { name: "MBTI测试", count: stats.mbtiTests, color: "bg-purple-500", icon: FileText },
                { name: "DISC测试", count: stats.discTests, color: "bg-blue-500", icon: FileText },
                { name: "PDP测试", count: stats.pdpTests, color: "bg-amber-500", icon: FileText },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm text-gray-500">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${(item.count / stats.testsCompleted) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 最近活动 */}
        <Card>
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
            <CardDescription>用户最近的测试和注册活动</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                      activity.type === "mbti" ? "bg-purple-500" :
                      activity.type === "face" ? "bg-rose-500" :
                      activity.type === "disc" ? "bg-blue-500" :
                      activity.type === "pdp" ? "bg-amber-500" :
                      activity.type === "purchase" ? "bg-green-500" : "bg-gray-500"
                    }`}>
                      {activity.user.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{activity.user}</p>
                      <p className="text-xs text-gray-500">{activity.action}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 价格设置对话框 */}
      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>测试收费配置</DialogTitle>
            <DialogDescription>设置各类测试的收费标准（单位：元）</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="face-test-price">人脸测试</Label>
                <Input
                  id="face-test-price"
                  type="number"
                  value={pricingConfig.faceTest}
                  onChange={(e) => setPricingConfig({ ...pricingConfig, faceTest: Number(e.target.value) })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mbti-test-price">MBTI测试</Label>
                <Input
                  id="mbti-test-price"
                  type="number"
                  value={pricingConfig.mbtiTest}
                  onChange={(e) => setPricingConfig({ ...pricingConfig, mbtiTest: Number(e.target.value) })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pdp-test-price">PDP测试</Label>
                <Input
                  id="pdp-test-price"
                  type="number"
                  value={pricingConfig.pdpTest}
                  onChange={(e) => setPricingConfig({ ...pricingConfig, pdpTest: Number(e.target.value) })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disc-test-price">DISC测试</Label>
                <Input
                  id="disc-test-price"
                  type="number"
                  value={pricingConfig.discTest}
                  onChange={(e) => setPricingConfig({ ...pricingConfig, discTest: Number(e.target.value) })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full-report-price">完整报告</Label>
                <Input
                  id="full-report-price"
                  type="number"
                  value={pricingConfig.fullReport}
                  onChange={(e) => setPricingConfig({ ...pricingConfig, fullReport: Number(e.target.value) })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-analysis-price">团队分析</Label>
                <Input
                  id="team-analysis-price"
                  type="number"
                  value={pricingConfig.teamAnalysis}
                  onChange={(e) => setPricingConfig({ ...pricingConfig, teamAnalysis: Number(e.target.value) })}
                  min="0"
                />
              </div>
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
