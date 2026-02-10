"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

export default function PricingPage() {
  const [personalPricing, setPersonalPricing] = useState({
    faceTest: 1,
    mbtiTest: 3,
    pdpTest: 3,
    discTest: 3,
    fullReport: 10,
  })

  const [enterprisePricing, setEnterprisePricing] = useState({
    faceTest: 1,
    mbtiTest: 3,
    pdpTest: 3,
    discTest: 3,
    fullReport: 10,
    teamAnalysis: 50,
    minRecharge: 500,
    testsPerRecharge: 10,
  })

  const [deepServicePricing, setDeepServicePricing] = useState({
    personalService: 198,
    teamService: 1980,
  })

  const [saveSuccess, setSaveSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  // 加载保存的价格设置
  useEffect(() => {
    const savedPersonalPricing = localStorage.getItem("personalPricing")
    const savedEnterprisePricing = localStorage.getItem("enterprisePricing")
    const savedDeepServicePricing = localStorage.getItem("deepServicePricing")

    if (savedPersonalPricing) {
      setPersonalPricing(JSON.parse(savedPersonalPricing))
    }
    if (savedEnterprisePricing) {
      setEnterprisePricing(JSON.parse(savedEnterprisePricing))
    }
    if (savedDeepServicePricing) {
      setDeepServicePricing(JSON.parse(savedDeepServicePricing))
    }
  }, [])

  // 保存价格设置
  const handleSavePersonalPricing = () => {
    localStorage.setItem("personalPricing", JSON.stringify(personalPricing))
    showSaveSuccess()
  }

  const handleSaveEnterprisePricing = () => {
    localStorage.setItem("enterprisePricing", JSON.stringify(enterprisePricing))
    showSaveSuccess()
  }

  const handleSaveDeepServicePricing = () => {
    localStorage.setItem("deepServicePricing", JSON.stringify(deepServicePricing))
    showSaveSuccess()
  }

  const showSaveSuccess = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>价格设置</CardTitle>
        <CardDescription>设置个人版和企业版的价格配置</CardDescription>
      </CardHeader>
      <CardContent>
        {saveSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4 mr-2" />
            <AlertDescription>价格设置已成功保存</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="personal">个人版价格</TabsTrigger>
            <TabsTrigger value="enterprise">企业版价格</TabsTrigger>
            <TabsTrigger value="deepService">深度服务价格</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="personal-face-test">人脸测试价格 (元/次)</Label>
                  <Input
                    id="personal-face-test"
                    type="number"
                    value={personalPricing.faceTest}
                    onChange={(e) => setPersonalPricing({ ...personalPricing, faceTest: Number(e.target.value) })}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personal-mbti-test">MBTI测试价格 (元/次)</Label>
                  <Input
                    id="personal-mbti-test"
                    type="number"
                    value={personalPricing.mbtiTest}
                    onChange={(e) => setPersonalPricing({ ...personalPricing, mbtiTest: Number(e.target.value) })}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personal-pdp-test">PDP测试价格 (元/次)</Label>
                  <Input
                    id="personal-pdp-test"
                    type="number"
                    value={personalPricing.pdpTest}
                    onChange={(e) => setPersonalPricing({ ...personalPricing, pdpTest: Number(e.target.value) })}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personal-disc-test">DISC测试价格 (元/次)</Label>
                  <Input
                    id="personal-disc-test"
                    type="number"
                    value={personalPricing.discTest}
                    onChange={(e) => setPersonalPricing({ ...personalPricing, discTest: Number(e.target.value) })}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personal-full-report">完整报告价格 (元/份)</Label>
                  <Input
                    id="personal-full-report"
                    type="number"
                    value={personalPricing.fullReport}
                    onChange={(e) => setPersonalPricing({ ...personalPricing, fullReport: Number(e.target.value) })}
                    min="1"
                  />
                </div>
              </div>

              <Button onClick={handleSavePersonalPricing}>保存个人版价格设置</Button>
            </div>
          </TabsContent>

          <TabsContent value="enterprise">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enterprise-face-test">人脸测试价格 (元/次)</Label>
                  <Input
                    id="enterprise-face-test"
                    type="number"
                    value={enterprisePricing.faceTest}
                    onChange={(e) => setEnterprisePricing({ ...enterprisePricing, faceTest: Number(e.target.value) })}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enterprise-mbti-test">MBTI测试价格 (元/次)</Label>
                  <Input
                    id="enterprise-mbti-test"
                    type="number"
                    value={enterprisePricing.mbtiTest}
                    onChange={(e) => setEnterprisePricing({ ...enterprisePricing, mbtiTest: Number(e.target.value) })}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enterprise-pdp-test">PDP测试价格 (元/次)</Label>
                  <Input
                    id="enterprise-pdp-test"
                    type="number"
                    value={enterprisePricing.pdpTest}
                    onChange={(e) => setEnterprisePricing({ ...enterprisePricing, pdpTest: Number(e.target.value) })}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enterprise-disc-test">DISC测试价格 (元/次)</Label>
                  <Input
                    id="enterprise-disc-test"
                    type="number"
                    value={enterprisePricing.discTest}
                    onChange={(e) => setEnterprisePricing({ ...enterprisePricing, discTest: Number(e.target.value) })}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enterprise-full-report">完整报告价格 (元/份)</Label>
                  <Input
                    id="enterprise-full-report"
                    type="number"
                    value={enterprisePricing.fullReport}
                    onChange={(e) => setEnterprisePricing({ ...enterprisePricing, fullReport: Number(e.target.value) })}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enterprise-team-analysis">团队分析价格 (元/次)</Label>
                  <Input
                    id="enterprise-team-analysis"
                    type="number"
                    value={enterprisePricing.teamAnalysis}
                    onChange={(e) =>
                      setEnterprisePricing({ ...enterprisePricing, teamAnalysis: Number(e.target.value) })
                    }
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enterprise-min-recharge">最低充值金额 (元)</Label>
                  <Input
                    id="enterprise-min-recharge"
                    type="number"
                    value={enterprisePricing.minRecharge}
                    onChange={(e) =>
                      setEnterprisePricing({ ...enterprisePricing, minRecharge: Number(e.target.value) })
                    }
                    min="100"
                    step="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enterprise-tests-per-recharge">每次充值测试次数</Label>
                  <Input
                    id="enterprise-tests-per-recharge"
                    type="number"
                    value={enterprisePricing.testsPerRecharge}
                    onChange={(e) =>
                      setEnterprisePricing({ ...enterprisePricing, testsPerRecharge: Number(e.target.value) })
                    }
                    min="1"
                  />
                  <p className="text-xs text-gray-500">
                    每充值 {enterprisePricing.minRecharge} 元可获得 {enterprisePricing.testsPerRecharge} 次测试
                  </p>
                </div>
              </div>

              <Button onClick={handleSaveEnterprisePricing}>保存企业版价格设置</Button>
            </div>
          </TabsContent>

          <TabsContent value="deepService">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deep-personal-service">个人深度服务 (元/次)</Label>
                  <Input
                    id="deep-personal-service"
                    type="number"
                    value={deepServicePricing.personalService}
                    onChange={(e) =>
                      setDeepServicePricing({ ...deepServicePricing, personalService: Number(e.target.value) })
                    }
                    min="1"
                  />
                  <p className="text-xs text-gray-500">默认价格为198元/次，提供深入浅出的内容输出和相关分析解读</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deep-team-service">团队深度服务 (元/人次)</Label>
                  <Input
                    id="deep-team-service"
                    type="number"
                    value={deepServicePricing.teamService}
                    onChange={(e) =>
                      setDeepServicePricing({ ...deepServicePricing, teamService: Number(e.target.value) })
                    }
                    min="1"
                  />
                  <p className="text-xs text-gray-500">默认价格为1980元/人次，采用与个人版类似的服务方式</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mt-4">
                <p className="text-sm text-blue-700">
                  注意：价格的分段机制以及企业版的相关内容已移至ADMIN后台进行管理和设置。
                </p>
              </div>

              <Button onClick={handleSaveDeepServicePricing}>保存深度服务价格设置</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
