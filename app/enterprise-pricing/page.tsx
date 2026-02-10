"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Zap, Star, Shield } from "lucide-react"

export default function EnterprisePricingPage() {
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<"yearly" | "ondemand">("yearly")

  const handlePurchase = (plan: string) => {
    router.push(`/enterprise-apply?plan=${plan}&billing=${billingCycle}`)
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      <div className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">企业服务定价</h1>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-center">神仙团队AI测试系统</h2>
          <p className="text-center text-gray-500 mt-1">为您的团队提供科学的性格分析与团队优化方案</p>
        </div>

        <Tabs
          defaultValue="yearly"
          value={billingCycle}
          onValueChange={(v) => setBillingCycle(v as "yearly" | "ondemand")}
          className="w-full mb-6"
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="yearly" className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              年度订阅
            </TabsTrigger>
            <TabsTrigger value="ondemand" className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              按需付费
            </TabsTrigger>
          </TabsList>

          <TabsContent value="yearly" className="space-y-6">
            {/* 团队启动版 */}
            <Card className="border border-blue-200 overflow-hidden">
              <CardHeader className="bg-blue-50 pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold">团队启动版</CardTitle>
                    <CardDescription>适合初创团队、小型部门</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    基础版
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <span className="text-2xl font-bold">¥19,800</span>
                  <span className="text-gray-500">/年</span>
                  <span className="text-sm text-gray-500 ml-2">最多10人</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">10人完成个人深度洞察报告</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">简历与面部特征匹配分析</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">1次团队动力诊断分析会(2-3小时)</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">团队基础分析报告</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">企业管理后台(基础版)</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handlePurchase("startup")}>
                  选择此方案
                </Button>
              </CardFooter>
            </Card>

            {/* 团队成长版 */}
            <Card className="border-2 border-purple-500 overflow-hidden relative">
              <div className="absolute top-0 right-0">
                <div className="bg-purple-600 text-white text-xs px-3 py-1 rotate-45 translate-x-[30%] translate-y-[-30%] w-32 text-center">
                  推荐方案
                </div>
              </div>
              <CardHeader className="bg-purple-50 pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold">团队成长版</CardTitle>
                    <CardDescription>适合成长型团队</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                    专业版
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <span className="text-2xl font-bold">¥39,800</span>
                  <span className="text-gray-500">/年</span>
                  <span className="text-sm text-gray-500 ml-2">最多30人</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">30人完成个人深度洞察报告</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">包含"启动版"所有功能</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">深度团队分析与冲突预测</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">1次定制化团队协作增效工作坊(7天)</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">企业管理后台(专业版)</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">企业Logo定制</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handlePurchase("growth")}>
                  选择此方案
                </Button>
              </CardFooter>
            </Card>

            {/* 团队蜕变版 */}
            <Card className="border border-gray-200 overflow-hidden">
              <CardHeader className="bg-gray-50 pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold">团队蜕变版</CardTitle>
                    <CardDescription>适合中大型团队</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                    企业版
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <span className="text-2xl font-bold">¥98,000</span>
                  <span className="text-gray-500">/年</span>
                  <span className="text-sm text-gray-500 ml-2">最多100人</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">100人完成个人深度洞察报告</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">包含"成长版"所有功能</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">更深度、更定制化的系列组合(≥2工作日)</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">3个月的落地跟进顾问服务</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">企业管理后台(高级版)</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">API集成与数据导出</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">白标定制与自定义域名</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full" onClick={() => handlePurchase("transform")}>
                  选择此方案
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="ondemand" className="space-y-6">
            {/* 单次团队分析 */}
            <Card className="border border-blue-200 overflow-hidden">
              <CardHeader className="bg-blue-50 pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold">单次团队分析</CardTitle>
                    <CardDescription>适合临时性团队分析需求</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <span className="text-2xl font-bold">¥1,980</span>
                  <span className="text-gray-500">/次</span>
                  <span className="text-sm text-gray-500 ml-2">最多10人</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">10人完成个人深度洞察报告</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">团队基础分析报告</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">有效期30天</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handlePurchase("single-team")}>
                  选择此方案
                </Button>
              </CardFooter>
            </Card>

            {/* 招聘面试包 */}
            <Card className="border-2 border-purple-500 overflow-hidden">
              <CardHeader className="bg-purple-50 pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold">招聘面试包</CardTitle>
                    <CardDescription>适合招聘季使用</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <span className="text-2xl font-bold">¥4,980</span>
                  <span className="text-gray-500">/10人</span>
                  <span className="text-sm text-gray-500 ml-2">可分批使用</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">10人面试候选人分析</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">简历与面部特征匹配分析</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">岗位适配度评估</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">有效期90天</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => handlePurchase("recruitment")}
                >
                  选择此方案
                </Button>
              </CardFooter>
            </Card>

            {/* 团队诊断服务 */}
            <Card className="border border-gray-200 overflow-hidden">
              <CardHeader className="bg-gray-50 pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold">团队诊断服务</CardTitle>
                    <CardDescription>适合深度团队问题解决</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <span className="text-2xl font-bold">¥9,800</span>
                  <span className="text-gray-500">/次</span>
                  <span className="text-sm text-gray-500 ml-2">最多15人</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">15人完成个人深度洞察报告</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">1次线下/线上团队诊断会(3小时)</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">团队问题诊断与解决方案</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">有效期30天</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full" onClick={() => handlePurchase("diagnosis")}>
                  选择此方案
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2 flex items-center">
            <Star className="h-4 w-4 mr-2 text-yellow-500" />
            企业服务特权
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>专属客户成功经理</span>
            </div>
            <div className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>优先技术支持</span>
            </div>
            <div className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>定期产品更新与培训</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Button variant="link" onClick={() => router.push("/enterprise-contact")}>
            需要定制方案？联系我们
          </Button>
        </div>
      </div>
    </div>
  )
}
