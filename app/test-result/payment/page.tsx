"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, CreditCard, Smartphone } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TestResultPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resultId = searchParams.get("resultId")
  const testType = searchParams.get("type") || "mbti"

  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [paymentMethod, setPaymentMethod] = useState<"wechat" | "alipay">("wechat")
  const [errorMessage, setErrorMessage] = useState("")

  // 处理支付
  const handlePayment = async () => {
    if (!resultId) {
      setErrorMessage("缺少测试结果ID")
      return
    }

    setPaymentStatus("processing")
    setErrorMessage("")

    try {
      // 在实际应用中，这里应该调用支付API
      // const response = await fetch('/api/payment', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     amount: 19.8,
      //     paymentMethod,
      //     resultId,
      //     productType: 'report',
      //   }),
      // });
      // const data = await response.json();
      // if (data.success) {
      //   setPaymentStatus('success');
      // } else {
      //   setPaymentStatus('error');
      //   setErrorMessage(data.message || '支付失败');
      // }

      // 模拟支付成功
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setPaymentStatus("success")

      // 支付成功后，延迟跳转到报告页面
      setTimeout(() => {
        router.push(`/test-result/${resultId}`)
      }, 2000)
    } catch (error) {
      console.error("支付错误:", error)
      setPaymentStatus("error")
      setErrorMessage("支付处理失败，请稍后重试")
    }
  }

  // 获取测试类型名称
  const getTestTypeName = (type: string) => {
    switch (type) {
      case "mbti":
        return "MBTI性格测试"
      case "pdp":
        return "PDP行为偏好分析"
      case "disc":
        return "DISC沟通风格分析"
      case "face":
        return "AI面相分析"
      default:
        return "性格测试"
    }
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-gray-50">
      <div className="p-4 bg-white shadow-sm flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium ml-2">查看完整报告</h1>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>解锁完整测试报告</CardTitle>
            <CardDescription>支付后查看详细的{getTestTypeName(testType)}报告</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <h3 className="font-medium text-purple-800 mb-2">您将获得</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2"></div>
                    <span className="text-sm text-purple-700">详细的性格特质分析和解读</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2"></div>
                    <span className="text-sm text-purple-700">个人优势和潜在盲区提示</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2"></div>
                    <span className="text-sm text-purple-700">职业发展方向推荐</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2"></div>
                    <span className="text-sm text-purple-700">人际关系和沟通建议</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{getTestTypeName(testType)}完整报告</div>
                  <div className="text-sm text-gray-500">一次性付费，永久查看</div>
                </div>
                <div className="text-xl font-bold text-purple-600">¥19.8</div>
              </div>

              {paymentStatus === "error" && (
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage || "支付失败，请重试"}</AlertDescription>
                </Alert>
              )}

              {paymentStatus === "success" && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>支付成功！正在跳转到报告页面...</AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="wechat" onValueChange={(value) => setPaymentMethod(value as "wechat" | "alipay")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="wechat" className="flex items-center">
                    <Smartphone className="h-4 w-4 mr-2" />
                    微信支付
                  </TabsTrigger>
                  <TabsTrigger value="alipay" className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    支付宝
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="wechat" className="mt-4">
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                      {paymentStatus === "processing" ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                      ) : (
                        <div className="text-center text-gray-500">微信支付二维码</div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">请使用微信扫描二维码完成支付</p>
                  </div>
                </TabsContent>
                <TabsContent value="alipay" className="mt-4">
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                      {paymentStatus === "processing" ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                      ) : (
                        <div className="text-center text-gray-500">支付宝二维码</div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">请使用支付宝扫描二维码完成支付</p>
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                className="w-full"
                onClick={handlePayment}
                disabled={paymentStatus === "processing" || paymentStatus === "success"}
              >
                {paymentStatus === "processing"
                  ? "处理中..."
                  : paymentStatus === "success"
                    ? "支付成功"
                    : "立即支付 ¥19.8"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>支付即表示您同意我们的</p>
          <div className="mt-1">
            <Button variant="link" className="p-0 h-auto text-sm">
              服务条款
            </Button>
            <span className="mx-1">和</span>
            <Button variant="link" className="p-0 h-auto text-sm">
              隐私政策
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
