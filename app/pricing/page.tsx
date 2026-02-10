"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Check, Building, User, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BottomNav from "@/components/bottom-nav"

export default function PricingPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>("personal")

  const handlePurchase = (plan: string) => {
    if (plan === "personal") {
      router.push("/payment?plan=personal&price=198")
    } else {
      router.push(`/enterprise-apply?plan=${plan}`)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      <div className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">服务价格</h1>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="personal" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              个人版
            </TabsTrigger>
            <TabsTrigger value="enterprise" className="flex items-center">
              <Building className="w-4 h-4 mr-2" />
              企业版
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="p-6 border-2 border-purple-500">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">个人深度洞察版</h2>
                <div className="mt-2">
                  <span className="text-3xl font-bold">¥198</span>
                  <span className="text-gray-500">/次</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">三张照片+问卷，全面解锁你的内在潜能</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">AI面部分析（基于东方面相学与西方心理学）</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">MBTI性格测试（16型人格完整解读）</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">盖洛普优势Top5识别（发现你的核心天赋）</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">PDP行为偏好分析（了解你的行为模式）</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">DISC沟通风格分析（提升沟通效率）</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">多维度综合性格报告（包含优势解读、潜在盲区提示）</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">职业发展方向推荐（匹配最适合你的职业）</span>
                </div>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handlePurchase("personal")}>
                立即购买
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="enterprise">
            <div className="space-y-6">
              <Card className="p-6 border border-blue-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-bold">团队启动版</h2>
                    <p className="text-sm text-gray-600">适合初创团队、小型部门</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">¥19,800</div>
                    <div className="text-xs text-gray-500">最多10人</div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-start">
                    <Check className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">10人完成个人深度洞察报告</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">1次团队动力诊断分析会(2-3小时)</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">识别团队优势组合与潜在风险点</span>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handlePurchase("startup")}>
                  申请咨询
                </Button>
              </Card>

              <Card className="p-6 border-2 border-blue-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-bold">团队成长版</h2>
                    <p className="text-sm text-gray-600">适合成长型团队</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">¥39,800</div>
                    <div className="text-xs text-gray-500">10-30人</div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-start">
                    <Check className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">最多30人完成个人深度洞察报告</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">包含"启动版"所有内容</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">1次定制化团队协作增效工作坊(7天)</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">聚焦沟通优化、优势协作等主题</span>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handlePurchase("growth")}>
                  申请咨询
                </Button>
              </Card>

              <Card className="p-6 border border-blue-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-bold">团队蜕变版</h2>
                    <p className="text-sm text-gray-600">适合中大型团队</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">¥98,000</div>
                    <div className="text-xs text-gray-500">最多100人</div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-start">
                    <Check className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">最多100人完成个人深度洞察报告</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">包含"成长版"所有内容</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">更深度、更定制化的系列组合(≥2工作日)</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">3个月的落地跟进顾问服务</span>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handlePurchase("transform")}>
                  申请咨询
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            分润机制
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>内部推荐</span>
              <span className="font-medium">10%</span>
            </div>
            <div className="flex justify-between">
              <span>付费个人版市场合伙人</span>
              <span className="font-medium">20%</span>
            </div>
            <div className="flex justify-between">
              <span>付费企业版市场合伙人</span>
              <span className="font-medium">30%</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav currentPath="/pricing" />
    </div>
  )
}
