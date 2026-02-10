"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp, TrendingDown, DollarSign, ArrowUpRight,
  ArrowDownRight, Download, Calendar, Building2
} from "lucide-react"

// 模拟财务数据（后续接 API）
const financialOverview = {
  totalRevenue: 198000,
  totalCost: 42000,
  netProfit: 156000,
  profitRate: 78.8,
  monthRevenue: 32500,
  monthCost: 7200,
  monthProfit: 25300,
  monthGrowth: 18.5,
}

// 收入明细
const revenueDetails = [
  { type: "企业首充", amount: 119400, percent: 60.3, trend: "up" },
  { type: "企业续费", amount: 49500, percent: 25.0, trend: "up" },
  { type: "个人付费", amount: 19800, percent: 10.0, trend: "stable" },
  { type: "报告查看", amount: 9300, percent: 4.7, trend: "down" },
]

// 成本明细
const costDetails = [
  { type: "AI API调用（人脸识别）", amount: 8400, percent: 20.0 },
  { type: "AI API调用（MBTI分析）", amount: 16800, percent: 40.0 },
  { type: "AI API调用（PDP/DISC）", amount: 12600, percent: 30.0 },
  { type: "服务器及运维", amount: 3360, percent: 8.0 },
  { type: "其他支出", amount: 840, percent: 2.0 },
]

// 企业充值记录
const rechargeRecords = [
  { enterprise: "科技创新有限公司", amount: 5000, date: "2026-02-09", method: "银行转账" },
  { enterprise: "未来教育集团", amount: 10000, date: "2026-02-08", method: "微信支付" },
  { enterprise: "健康医疗科技", amount: 20000, date: "2026-02-05", method: "对公转账" },
  { enterprise: "智能制造集团", amount: 3000, date: "2026-02-03", method: "微信支付" },
  { enterprise: "科技创新有限公司", amount: 5000, date: "2026-01-28", method: "银行转账" },
  { enterprise: "数字营销公司", amount: 8000, date: "2026-01-25", method: "对公转账" },
  { enterprise: "未来教育集团", amount: 15000, date: "2026-01-20", method: "对公转账" },
]

export default function FinancePage() {
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month")

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">财务管理</h1>
          <p className="text-sm text-gray-500 mt-1">收入、成本及利润分析</p>
        </div>
        <Button variant="outline" size="sm" className="text-xs">
          <Download className="h-3.5 w-3.5 mr-1.5" />
          导出报表
        </Button>
      </div>

      {/* 核心财务指标 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-gray-500 font-medium">总收入</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">¥{(financialOverview.totalRevenue / 10000).toFixed(1)}万</p>
            <div className="flex items-center mt-1.5">
              <span className="text-xs text-emerald-600 font-medium flex items-center">
                <ArrowUpRight className="h-3 w-3" />本月 ¥{(financialOverview.monthRevenue / 10000).toFixed(1)}万
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-gray-500 font-medium">总成本</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">¥{(financialOverview.totalCost / 10000).toFixed(1)}万</p>
            <div className="flex items-center mt-1.5">
              <span className="text-xs text-gray-500 font-medium flex items-center">
                本月 ¥{(financialOverview.monthCost / 10000).toFixed(1)}万
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-gray-500 font-medium">净利润</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">¥{(financialOverview.netProfit / 10000).toFixed(1)}万</p>
            <div className="flex items-center mt-1.5">
              <span className="text-xs text-emerald-600 font-medium flex items-center">
                <ArrowUpRight className="h-3 w-3" />{financialOverview.monthGrowth}% 环比增长
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-gray-500 font-medium">利润率</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{financialOverview.profitRate}%</p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${financialOverview.profitRate}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 收入和成本明细 Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="bg-gray-100/80 p-1">
          <TabsTrigger value="revenue" className="text-sm">收入明细</TabsTrigger>
          <TabsTrigger value="cost" className="text-sm">成本明细</TabsTrigger>
          <TabsTrigger value="records" className="text-sm">充值记录</TabsTrigger>
        </TabsList>

        {/* 收入明细 */}
        <TabsContent value="revenue">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">收入构成</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueDetails.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-900">{item.type}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">¥{item.amount.toLocaleString()}</span>
                          <span className="text-xs text-gray-400 w-12 text-right">{item.percent}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            index === 0 ? "bg-indigo-500" :
                            index === 1 ? "bg-blue-500" :
                            index === 2 ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 总计 */}
              <div className="mt-6 pt-4 border-t flex items-center justify-between">
                <span className="font-medium text-gray-900">总收入</span>
                <span className="text-lg font-bold text-gray-900">
                  ¥{revenueDetails.reduce((s, i) => s + i.amount, 0).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 成本明细 */}
        <TabsContent value="cost">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">成本构成</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costDetails.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-900">{item.type}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">¥{item.amount.toLocaleString()}</span>
                          <span className="text-xs text-gray-400 w-12 text-right">{item.percent}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-red-400"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 总计 */}
              <div className="mt-6 pt-4 border-t flex items-center justify-between">
                <span className="font-medium text-gray-900">总成本</span>
                <span className="text-lg font-bold text-gray-900">
                  ¥{costDetails.reduce((s, i) => s + i.amount, 0).toLocaleString()}
                </span>
              </div>

              {/* 利润分析卡片 */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-xs text-gray-500">总收入</p>
                  <p className="text-lg font-bold mt-1">¥{(financialOverview.totalRevenue / 10000).toFixed(1)}万</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-xs text-gray-500">总成本</p>
                  <p className="text-lg font-bold mt-1">¥{(financialOverview.totalCost / 10000).toFixed(1)}万</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl text-center">
                  <p className="text-xs text-emerald-600">净利润</p>
                  <p className="text-lg font-bold text-emerald-600 mt-1">¥{(financialOverview.netProfit / 10000).toFixed(1)}万</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 充值记录 */}
        <TabsContent value="records">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">企业充值记录</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">企业名称</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">充值金额</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">支付方式</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">时间</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rechargeRecords.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{record.enterprise}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm font-medium text-emerald-600">+¥{record.amount.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-500">{record.method}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-500">{record.date}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
