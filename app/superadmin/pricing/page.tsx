"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Save, RotateCcw, Tag, Users, Sparkles } from "lucide-react"

// 价格项类型
interface PriceItem {
  key: string
  label: string
  unit: string
  description?: string
}

// 个人版价格项
const personalPriceItems: PriceItem[] = [
  { key: "faceTest", label: "人脸测试", unit: "元/次", description: "AI人脸性格分析" },
  { key: "mbtiTest", label: "MBTI测试", unit: "元/次", description: "16型人格测试" },
  { key: "pdpTest", label: "PDP测试", unit: "元/次", description: "5种动物性格测试" },
  { key: "discTest", label: "DISC测试", unit: "元/次", description: "4维行为风格测试" },
  { key: "fullReport", label: "完整报告", unit: "元/份", description: "综合性格分析报告" },
]

// 企业版价格项
const enterprisePriceItems: PriceItem[] = [
  ...personalPriceItems,
  { key: "teamAnalysis", label: "团队分析", unit: "元/次", description: "团队性格组合分析" },
  { key: "minRecharge", label: "最低充值金额", unit: "元", description: "企业充值最低限额" },
  { key: "testsPerRecharge", label: "每充值测试次数", unit: "次", description: "每500元对应的测试次数" },
]

// 深度服务价格项
const deepServicePriceItems: PriceItem[] = [
  { key: "personalService", label: "个人深度服务", unit: "元/次", description: "一对一深度性格解读" },
  { key: "teamService", label: "团队深度服务", unit: "元/人次", description: "团队性格匹配分析与建议" },
]

// 默认价格
const defaultPrices = {
  personal: { faceTest: 1, mbtiTest: 3, pdpTest: 3, discTest: 3, fullReport: 10 },
  enterprise: { faceTest: 1, mbtiTest: 3, pdpTest: 3, discTest: 3, fullReport: 10, teamAnalysis: 50, minRecharge: 500, testsPerRecharge: 10 },
  deepService: { personalService: 198, teamService: 1980 },
}

export default function PricingPage() {
  const [personalPricing, setPersonalPricing] = useState<Record<string, number>>(defaultPrices.personal)
  const [enterprisePricing, setEnterprisePricing] = useState<Record<string, number>>(defaultPrices.enterprise)
  const [deepServicePricing, setDeepServicePricing] = useState<Record<string, number>>(defaultPrices.deepService)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  // 加载已保存的价格
  useEffect(() => {
    const saved1 = localStorage.getItem("personalPricing")
    const saved2 = localStorage.getItem("enterprisePricing")
    const saved3 = localStorage.getItem("deepServicePricing")
    if (saved1) setPersonalPricing(JSON.parse(saved1))
    if (saved2) setEnterprisePricing(JSON.parse(saved2))
    if (saved3) setDeepServicePricing(JSON.parse(saved3))
  }, [])

  // 保存价格
  const handleSave = (type: string) => {
    if (type === "personal") localStorage.setItem("personalPricing", JSON.stringify(personalPricing))
    if (type === "enterprise") localStorage.setItem("enterprisePricing", JSON.stringify(enterprisePricing))
    if (type === "deepService") localStorage.setItem("deepServicePricing", JSON.stringify(deepServicePricing))
    setSaveSuccess(type)
    setTimeout(() => setSaveSuccess(null), 3000)
  }

  // 重置价格
  const handleReset = (type: string) => {
    if (type === "personal") setPersonalPricing(defaultPrices.personal)
    if (type === "enterprise") setEnterprisePricing(defaultPrices.enterprise)
    if (type === "deepService") setDeepServicePricing(defaultPrices.deepService)
  }

  // 渲染价格编辑项
  const renderPriceItems = (
    items: PriceItem[],
    values: Record<string, number>,
    onChange: (key: string, value: number) => void
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item) => (
        <div key={item.key} className="space-y-1.5">
          <Label htmlFor={item.key} className="text-sm font-medium">
            {item.label}
            <span className="text-xs text-gray-400 font-normal ml-2">({item.unit})</span>
          </Label>
          <Input
            id={item.key}
            type="number"
            value={values[item.key] ?? 0}
            onChange={(e) => onChange(item.key, Number(e.target.value))}
            min="0"
            step={item.key === "minRecharge" ? "100" : "1"}
            className="h-9"
          />
          {item.description && (
            <p className="text-xs text-gray-400">{item.description}</p>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">价格管理</h1>
        <p className="text-sm text-gray-500 mt-1">统一管理个人版、企业版和深度服务的定价</p>
      </div>

      {/* 保存成功提示 */}
      {saveSuccess && (
        <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>价格设置已保存成功</AlertDescription>
        </Alert>
      )}

      {/* 价格管理 Tabs */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="bg-gray-100/80 p-1">
          <TabsTrigger value="personal" className="text-sm gap-1.5">
            <Tag className="h-3.5 w-3.5" />个人版
          </TabsTrigger>
          <TabsTrigger value="enterprise" className="text-sm gap-1.5">
            <Users className="h-3.5 w-3.5" />企业版
          </TabsTrigger>
          <TabsTrigger value="deepService" className="text-sm gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />深度服务
          </TabsTrigger>
        </TabsList>

        {/* 个人版价格 */}
        <TabsContent value="personal">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">个人版价格设置</CardTitle>
              <CardDescription>设置个人用户各项测试的收费标准</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderPriceItems(
                personalPriceItems,
                personalPricing,
                (key, value) => setPersonalPricing({ ...personalPricing, [key]: value })
              )}

              {/* 价格预览 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium mb-3">价格预览</p>
                <div className="flex flex-wrap gap-2">
                  {personalPriceItems.map((item) => (
                    <div key={item.key} className="bg-white rounded-lg px-3 py-2 border text-center min-w-[100px]">
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-sm font-bold text-indigo-600 mt-0.5">¥{personalPricing[item.key]}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleSave("personal")} className="bg-indigo-600 hover:bg-indigo-700">
                  <Save className="h-4 w-4 mr-1.5" />保存设置
                </Button>
                <Button variant="outline" onClick={() => handleReset("personal")}>
                  <RotateCcw className="h-4 w-4 mr-1.5" />恢复默认
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 企业版价格 */}
        <TabsContent value="enterprise">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">企业版价格设置</CardTitle>
              <CardDescription>设置企业客户的定价和充值规则</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderPriceItems(
                enterprisePriceItems,
                enterprisePricing,
                (key, value) => setEnterprisePricing({ ...enterprisePricing, [key]: value })
              )}

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <p className="text-xs text-amber-700">
                  企业充值规则：每充值 <strong>¥{enterprisePricing.minRecharge}</strong> 可获得{" "}
                  <strong>{enterprisePricing.testsPerRecharge}</strong> 次测试额度
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleSave("enterprise")} className="bg-indigo-600 hover:bg-indigo-700">
                  <Save className="h-4 w-4 mr-1.5" />保存设置
                </Button>
                <Button variant="outline" onClick={() => handleReset("enterprise")}>
                  <RotateCcw className="h-4 w-4 mr-1.5" />恢复默认
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 深度服务价格 */}
        <TabsContent value="deepService">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">深度服务价格设置</CardTitle>
              <CardDescription>设置一对一深度解读和团队分析服务的价格</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderPriceItems(
                deepServicePriceItems,
                deepServicePricing,
                (key, value) => setDeepServicePricing({ ...deepServicePricing, [key]: value })
              )}

              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <p className="text-xs text-purple-700">
                  深度服务由专业性格分析师提供，包含详细的性格解读报告和个性化建议。
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleSave("deepService")} className="bg-indigo-600 hover:bg-indigo-700">
                  <Save className="h-4 w-4 mr-1.5" />保存设置
                </Button>
                <Button variant="outline" onClick={() => handleReset("deepService")}>
                  <RotateCcw className="h-4 w-4 mr-1.5" />恢复默认
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
