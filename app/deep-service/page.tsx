"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, Star, Users, BrainCircuit, Briefcase } from "lucide-react"

export default function DeepServicePage() {
  const router = useRouter()

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-white">
      {/* 头部 */}
      <div className="px-4 py-3 flex items-center border-b">
        <button className="mr-2" onClick={() => router.back()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-lg font-medium flex-1 text-center">深度服务</h1>
      </div>

      {/* 主要内容 */}
      <div className="p-4 space-y-6">
        {/* 顶部横幅 */}
        <div className="relative w-full h-40 rounded-xl overflow-hidden">
          <Image src="/professional-career-consulting.png" alt="深度服务" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-transparent flex items-center p-6">
            <div className="text-white">
              <h2 className="text-xl font-bold mb-1">专业深度服务</h2>
              <p className="text-sm opacity-90">由资深心理学家和职业顾问提供一对一服务</p>
            </div>
          </div>
        </div>

        {/* 服务卡片 */}
        <div className="space-y-4">
          <Card className="overflow-hidden border-purple-100">
            <CardHeader className="bg-purple-50 pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">个人深度服务</CardTitle>
                  <CardDescription>个人性格特质深入解读与分析</CardDescription>
                </div>
                <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                  个人版
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>深入浅出的内容输出</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>MBTI/PDP/DISC测试结果专业解读</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>个人优势与潜力全面分析</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>职业发展方向建议</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t pt-4">
              <div className="text-xl font-bold text-purple-600">¥198/次</div>
              <Button size="sm" className="rounded-full" onClick={() => router.push("/payment?service=personal")}>
                立即预约
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden border-blue-100">
            <CardHeader className="bg-blue-50 pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">团队深度服务</CardTitle>
                  <CardDescription>团队成员性格分析与团队协作优化</CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                  团队版
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>团队成员个性化分析</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>团队协作模式优化建议</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>团队角色分配与优化</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>团队建设活动设计与指导</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t pt-4">
              <div className="text-xl font-bold text-blue-600">¥1980/人次</div>
              <Button size="sm" className="rounded-full" onClick={() => router.push("/payment?service=team")}>
                立即预约
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* 专家团队 */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">我们的专家团队</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <BrainCircuit className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-medium text-sm">心理学专家</h3>
              <div className="flex mt-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <Star className="h-3 w-3 text-yellow-500" />
                <Star className="h-3 w-3 text-yellow-500" />
                <Star className="h-3 w-3 text-yellow-500" />
                <Star className="h-3 w-3 text-yellow-500" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-medium text-sm">职业顾问</h3>
              <div className="flex mt-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <Star className="h-3 w-3 text-yellow-500" />
                <Star className="h-3 w-3 text-yellow-500" />
                <Star className="h-3 w-3 text-yellow-500" />
                <Star className="h-3 w-3 text-yellow-500" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-medium text-sm">人力资源专家</h3>
              <div className="flex mt-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <Star className="h-3 w-3 text-yellow-500" />
                <Star className="h-3 w-3 text-yellow-500" />
                <Star className="h-3 w-3 text-yellow-500" />
                <Star className="h-3 w-3 text-yellow-500" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-medium text-sm">团队建设专家</h3>
              <div className="flex mt-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <Star className="h-3 w-3 text-yellow-500" />
                <Star className="h-3 w-3 text-yellow-500" />
                <Star className="h-3 w-3 text-yellow-500" />
                <Star className="h-3 w-3 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        {/* 企业服务入口 */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-2">需要企业级服务？</h3>
              <p className="text-sm text-gray-600 mb-4">
                我们提供企业定制化服务，包括团队性格分析、人才匹配、团队建设等全方位解决方案。
              </p>
              <Button variant="outline" className="w-full" onClick={() => router.push("/enterprise-apply")}>
                了解企业服务
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
