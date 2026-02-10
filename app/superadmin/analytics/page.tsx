"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart, PieChart, TrendingUp, Download, Calendar, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SuperAdminAnalyticsPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [timeRange, setTimeRange] = useState("month")
  const [loading, setLoading] = useState(true)

  // 检查登录状态
  useEffect(() => {
    const superAdminLoggedIn = localStorage.getItem("superAdminLoggedIn") === "true"
    if (!superAdminLoggedIn) {
      router.push("/superadmin/login")
    } else {
      setIsLoggedIn(true)
      setLoading(false)
    }
  }, [router])

  if (!isLoggedIn || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">加载数据中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.push("/superadmin")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold ml-2">数据分析</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="选择时间范围" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">最近一周</SelectItem>
                  <SelectItem value="month">最近一个月</SelectItem>
                  <SelectItem value="quarter">最近一季度</SelectItem>
                  <SelectItem value="year">最近一年</SelectItem>
                  <SelectItem value="all">全部时间</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* 概览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">总收入</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">¥198,500</div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+12.5%</span>
                <span className="text-gray-500 ml-1">vs 上月</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">测试次数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,842</div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+8.3%</span>
                <span className="text-gray-500 ml-1">vs 上月</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">企业客户</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+4</span>
                <span className="text-gray-500 ml-1">vs 上月</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">个人用户</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,256</div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+15.2%</span>
                <span className="text-gray-500 ml-1">vs 上月</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 标签页内容 */}
        <Tabs defaultValue="revenue">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue">
              <BarChart className="h-4 w-4 mr-2" />
              收入分析
            </TabsTrigger>
            <TabsTrigger value="tests">
              <BarChart className="h-4 w-4 mr-2" />
              测试分析
            </TabsTrigger>
            <TabsTrigger value="users">
              <PieChart className="h-4 w-4 mr-2" />
              用户分析
            </TabsTrigger>
            <TabsTrigger value="conversion">
              <TrendingUp className="h-4 w-4 mr-2" />
              转化分析
            </TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>收入分析</CardTitle>
                <CardDescription>分析系统收入来源和趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-800 mb-3">收入趋势</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-gray-500">收入趋势图表</div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">本月收入</div>
                        <div className="text-xl font-bold">¥42,500</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">上月收入</div>
                        <div className="text-xl font-bold">¥37,800</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">环比增长</div>
                        <div className="text-xl font-bold text-green-600">+12.5%</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">年度总收入</div>
                        <div className="text-xl font-bold">¥198,500</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium text-gray-800 mb-3">收入来源分布</h3>
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-gray-500">收入来源分布图表</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>测试分析</CardTitle>
                <CardDescription>分析测试使用情况和趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-800 mb-3">测试次数趋势</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-gray-500">测试次数趋势图表</div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">本月测试次数</div>
                        <div className="text-xl font-bold">1,256</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">上月测试次数</div>
                        <div className="text-xl font-bold">1,150</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">环比增长</div>
                        <div className="text-xl font-bold text-green-600">+8.3%</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">年度总测试次数</div>
                        <div className="text-xl font-bold">3,842</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium text-gray-800 mb-3">测试类型分布</h3>
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-gray-500">测试类型分布图表</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>用户分析</CardTitle>
                <CardDescription>分析用户增长和行为</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-800 mb-3">用户增长趋势</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-gray-500">用户增长趋势图表</div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">本月新增用户</div>
                        <div className="text-xl font-bold">156</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">上月新增用户</div>
                        <div className="text-xl font-bold">135</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">环比增长</div>
                        <div className="text-xl font-bold text-green-600">+15.6%</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">总用户数</div>
                        <div className="text-xl font-bold">1,256</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium text-gray-800 mb-3">用户类型分布</h3>
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-gray-500">用户类型分布图表</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversion" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>转化分析</CardTitle>
                <CardDescription>分析用户转化率和流程</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-800 mb-3">转化率趋势</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-gray-500">转化率趋势图表</div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">本月转化率</div>
                        <div className="text-xl font-bold">3.5%</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">上月转化率</div>
                        <div className="text-xl font-bold">3.2%</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">环比增长</div>
                        <div className="text-xl font-bold text-green-600">+9.4%</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">平均转化时间</div>
                        <div className="text-xl font-bold">5 分钟</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium text-gray-800 mb-3">转化流程分布</h3>
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-gray-500">转化流程分布图表</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
