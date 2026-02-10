"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2, Users, DollarSign, Link, Gift } from "lucide-react"

export default function AdminDistributionPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">分销管理</h1>
        <p className="text-sm text-gray-500">管理分销渠道和佣金体系</p>
      </div>

      {/* 分润体系 */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Share2 className="h-4 w-4 text-purple-600" />
            分润体系设计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 分润流程图 */}
            <div className="bg-gradient-to-r from-purple-50 to-rose-50 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 text-sm mb-4">
                <span className="bg-white px-3 py-1 rounded-full shadow-sm font-medium">用户付费 ¥198</span>
                <span className="text-gray-400">→</span>
                <span className="bg-white px-3 py-1 rounded-full shadow-sm font-medium">自动分润</span>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-lg font-bold text-green-600">30%</p>
                  <p className="text-xs text-gray-600">一级推广</p>
                  <p className="text-[10px] text-gray-400">¥59.4/单</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-lg font-bold text-blue-600">10%</p>
                  <p className="text-xs text-gray-600">二级推广</p>
                  <p className="text-[10px] text-gray-400">¥19.8/单</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                    <Gift className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="text-lg font-bold text-purple-600">60%</p>
                  <p className="text-xs text-gray-600">平台收入</p>
                  <p className="text-[10px] text-gray-400">¥118.8/单</p>
                </div>
              </div>
            </div>

            {/* 分销规则 */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">分销规则</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex gap-2 items-start">
                  <span className="w-5 h-5 rounded bg-green-100 text-green-600 flex items-center justify-center text-xs flex-shrink-0">1</span>
                  <p>用户分享专属链接/海报，好友通过链接购买测试，推广者获得 <strong>30%</strong> 佣金</p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="w-5 h-5 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs flex-shrink-0">2</span>
                  <p>好友再次分享，原推广者获得 <strong>10%</strong> 二级佣金</p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="w-5 h-5 rounded bg-amber-100 text-amber-600 flex items-center justify-center text-xs flex-shrink-0">3</span>
                  <p>企业渠道合作：按企业订单总额的 <strong>15%</strong> 发放渠道佣金</p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="w-5 h-5 rounded bg-red-100 text-red-600 flex items-center justify-center text-xs flex-shrink-0">4</span>
                  <p>佣金满 <strong>100元</strong> 可提现，T+1 到账微信零钱</p>
                </div>
              </div>
            </div>

            {/* 分销数据 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold">0</p>
                <p className="text-xs text-gray-500">分销员数量</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold">¥0</p>
                <p className="text-xs text-gray-500">累计分出佣金</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
