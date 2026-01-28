"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Check, DollarSign, Percent, Gift } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PricingConfig {
  faceTest: number
  mbtiTest: number
  pdpTest: number
  discTest: number
  fullReport: number
  teamAnalysis: number
  enablePromo: boolean
  promoDiscount: number
  freeTrialEnabled: boolean
  freeTrialCount: number
}

export default function AdminPricingPage() {
  const [isSaved, setIsSaved] = useState(false)
  const [pricing, setPricing] = useState<PricingConfig>({
    faceTest: 1,
    mbtiTest: 3,
    pdpTest: 3,
    discTest: 3,
    fullReport: 10,
    teamAnalysis: 50,
    enablePromo: false,
    promoDiscount: 20,
    freeTrialEnabled: true,
    freeTrialCount: 1,
  })

  // 加载已保存的配置
  useEffect(() => {
    const savedPricing = localStorage.getItem("pricingConfig")
    if (savedPricing) {
      setPricing({ ...pricing, ...JSON.parse(savedPricing) })
    }
  }, [])

  // 保存配置
  const savePricing = () => {
    localStorage.setItem("pricingConfig", JSON.stringify(pricing))
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  // 价格项配置
  const priceItems = [
    { key: "faceTest", label: "AI人脸测试", desc: "面相性格分析" },
    { key: "mbtiTest", label: "MBTI测试", desc: "90题专业测试" },
    { key: "pdpTest", label: "PDP测试", desc: "行为风格测试" },
    { key: "discTest", label: "DISC测试", desc: "沟通风格测试" },
    { key: "fullReport", label: "完整报告", desc: "综合分析报告" },
    { key: "teamAnalysis", label: "团队分析", desc: "企业团队诊断" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">价格设置</h1>
        <p className="text-gray-500 mt-1">管理各类测试和服务的定价</p>
      </div>

      {isSaved && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">价格配置已保存</AlertDescription>
        </Alert>
      )}

      {/* 测试价格 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-amber-500" />
            测试定价
          </CardTitle>
          <CardDescription>设置各类测试的单次收费价格（单位：元）</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {priceItems.map((item) => (
              <div key={item.key} className="space-y-2">
                <Label htmlFor={item.key}>{item.label}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                  <Input
                    id={item.key}
                    type="number"
                    min="0"
                    step="0.01"
                    value={pricing[item.key as keyof PricingConfig] as number}
                    onChange={(e) => setPricing({
                      ...pricing,
                      [item.key]: parseFloat(e.target.value) || 0
                    })}
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 促销设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-rose-500" />
            促销活动
          </CardTitle>
          <CardDescription>设置促销折扣和优惠活动</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>启用促销折扣</Label>
              <p className="text-sm text-gray-500">开启后所有测试享受折扣价格</p>
            </div>
            <Switch
              checked={pricing.enablePromo}
              onCheckedChange={(checked) => setPricing({ ...pricing, enablePromo: checked })}
            />
          </div>

          {pricing.enablePromo && (
            <div className="space-y-2">
              <Label htmlFor="promoDiscount">折扣比例 (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="promoDiscount"
                  type="number"
                  min="0"
                  max="100"
                  value={pricing.promoDiscount}
                  onChange={(e) => setPricing({
                    ...pricing,
                    promoDiscount: parseInt(e.target.value) || 0
                  })}
                  className="w-32"
                />
                <span className="text-gray-500">%OFF</span>
              </div>
              <p className="text-xs text-gray-500">当前折扣后价格示例：MBTI测试 ¥{(pricing.mbtiTest * (1 - pricing.promoDiscount / 100)).toFixed(2)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 免费试用 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-500" />
            免费试用
          </CardTitle>
          <CardDescription>设置新用户免费试用政策</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>启用免费试用</Label>
              <p className="text-sm text-gray-500">新用户可免费体验指定次数的测试</p>
            </div>
            <Switch
              checked={pricing.freeTrialEnabled}
              onCheckedChange={(checked) => setPricing({ ...pricing, freeTrialEnabled: checked })}
            />
          </div>

          {pricing.freeTrialEnabled && (
            <div className="space-y-2">
              <Label htmlFor="freeTrialCount">免费次数</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="freeTrialCount"
                  type="number"
                  min="1"
                  max="10"
                  value={pricing.freeTrialCount}
                  onChange={(e) => setPricing({
                    ...pricing,
                    freeTrialCount: parseInt(e.target.value) || 1
                  })}
                  className="w-32"
                />
                <span className="text-gray-500">次</span>
              </div>
              <p className="text-xs text-gray-500">新用户注册后可免费使用{pricing.freeTrialCount}次任意测试</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <Button onClick={savePricing} className="min-w-[120px]">
          {isSaved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              已保存
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              保存配置
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
