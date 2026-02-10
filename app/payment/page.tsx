"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, CreditCard, QrCode } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [plan, setPlan] = useState("")
  const [price, setPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("wechat")

  useEffect(() => {
    const planParam = searchParams.get("plan")
    const priceParam = searchParams.get("price")

    if (planParam) {
      setPlan(planParam)
    }

    if (priceParam) {
      setPrice(Number(priceParam))
    }
  }, [searchParams])

  const handlePayment = async () => {
    setLoading(true)

    try {
      // 模拟支付处理
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 支付成功
      toast({
        title: "支付成功",
        description: "您已成功购买服务，即将跳转到个人中心",
      })

      // 模拟支付完成后跳转
      setTimeout(() => {
        router.push("/profile")
      }, 1500)
    } catch (error) {
      toast({
        title: "支付失败",
        description: "请稍后重试或选择其他支付方式",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      <div className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">确认支付</h1>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Card className="p-4 mb-6">
          <h2 className="font-medium mb-2">订单信息</h2>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">服务名称</span>
            <span>{plan === "personal" ? "个人深度洞察版" : plan === "startup" ? "团队启动版" : "未知服务"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">支付金额</span>
            <span className="text-lg font-bold text-purple-600">¥{price.toFixed(2)}</span>
          </div>
        </Card>

        <div className="mb-6">
          <h2 className="font-medium mb-4">选择支付方式</h2>
          <Tabs defaultValue="wechat" value={paymentMethod} onValueChange={setPaymentMethod}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="wechat" className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-1"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.5,4C5.36,4 2,6.69 2,10C2,11.89 3.08,13.56 4.78,14.66L4,17L6.5,15.5C7.39,15.81 8.37,16 9.41,16C9.15,15.37 9,14.7 9,14C9,10.69 12.13,8 16,8C16.19,8 16.38,8 16.56,8.03C15.54,5.69 12.78,4 9.5,4M6.5,6.5A1,1 0 0,1 7.5,7.5A1,1 0 0,1 6.5,8.5A1,1 0 0,1 5.5,7.5A1,1 0 0,1 6.5,6.5M11.5,6.5A1,1 0 0,1 12.5,7.5A1,1 0 0,1 11.5,8.5A1,1 0 0,1 10.5,7.5A1,1 0 0,1 11.5,6.5M16,9C13.24,9 11,11.24 11,14C11,16.76 13.24,19 16,19C16.67,19 17.31,18.85 17.88,18.59L20,20L19.5,18.5C20.79,17.63 22,15.93 22,14C22,11.24 19.76,9 16,9M14,11.5A1,1 0 0,1 15,12.5A1,1 0 0,1 14,13.5A1,1 0 0,1 13,12.5A1,1 0 0,1 14,11.5M18,11.5A1,1 0 0,1 19,12.5A1,1 0 0,1 18,13.5A1,1 0 0,1 17,12.5A1,1 0 0,1 18,11.5Z" />
                </svg>
                微信支付
              </TabsTrigger>
              <TabsTrigger value="alipay" className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-1"
                  viewBox="0 0 1024 1024"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1023.795 853.64v-306.416H575.548V472.96h448.247V166.545c0-45.946-37.148-83.094-83.094-83.094H83.094C37.148 83.451 0 120.6 0 166.545v690.784c0 45.945 37.148 83.094 83.094 83.094h857.607c45.946 0 83.094-37.149 83.094-83.094v-3.689h0.001zM403.085 300.394a68.051 68.051 0 0 1 68.051-68.052 68.051 68.051 0 0 1 68.052 68.052 68.051 68.051 0 0 1-68.052 68.051 68.051 68.051 0 0 1-68.051-68.051z m0 0" />
                  <path d="M1023.795 583.241c-0.005-0.213-0.013-0.426-0.013-0.639C1004.65 493.522 865.058 424.1 704.121 424.1c-166.224 0-309.024 73.53-304.376 162.941 4.648 89.414 156.151 150.724 318.985 142.317C759.057 727.14 863.619 785.2 972.619 848.856c19.112-54.468 31.663-105.677 31.663-155.32 0-37.075-7.035-72.841-19.992-106.096 39.667-3.231 39.523-3.739 39.505-4.199z m-620.731 26.695c-142.438 0-257.869-28.605-257.869-63.92s115.431-63.92 257.869-63.92 257.869 28.605 257.869 63.92-115.431 63.92-257.869 63.92z m0 0" />
                </svg>
                支付宝
              </TabsTrigger>
              <TabsTrigger value="card" className="flex items-center justify-center">
                <CreditCard className="w-5 h-5 mr-1" />
                银行卡
              </TabsTrigger>
            </TabsList>

            <TabsContent value="wechat" className="mt-4">
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <QrCode className="w-48 h-48 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-2">请使用微信扫一扫</p>
                <p className="text-sm text-gray-500">扫描二维码完成支付</p>
              </div>
            </TabsContent>

            <TabsContent value="alipay" className="mt-4">
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <QrCode className="w-48 h-48 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-2">请使用支付宝扫一扫</p>
                <p className="text-sm text-gray-500">扫描二维码完成支付</p>
              </div>
            </TabsContent>

            <TabsContent value="card" className="mt-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">卡号</label>
                  <input
                    type="text"
                    placeholder="请输入银行卡号"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">有效期</label>
                    <input type="text" placeholder="MM/YY" className="w-full p-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input type="text" placeholder="CVV" className="w-full p-2 border border-gray-300 rounded-md" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">持卡人姓名</label>
                  <input
                    type="text"
                    placeholder="请输入持卡人姓名"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handlePayment} disabled={loading}>
          {loading ? "处理中..." : `确认支付 ¥${price.toFixed(2)}`}
        </Button>

        <p className="text-xs text-gray-500 text-center mt-4">点击"确认支付"，表示您同意我们的服务条款和隐私政策</p>
      </div>
    </div>
  )
}
