"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, Upload, Search, FileText, User, 
  CheckCircle, Clock, ChevronRight, Target 
} from "lucide-react"
import { cn } from "@/lib/utils"

// 模拟候选人数据
const mockCandidates = [
  { 
    id: 1, 
    name: "陈小明", 
    position: "产品经理", 
    mbti: "ENTJ", 
    match: 92, 
    status: "面试中",
    uploadTime: "2026-01-25"
  },
  { 
    id: 2, 
    name: "李小红", 
    position: "UI设计师", 
    mbti: "ISFP", 
    match: 88, 
    status: "待面试",
    uploadTime: "2026-01-26"
  },
  { 
    id: 3, 
    name: "王大华", 
    position: "前端开发", 
    mbti: "-", 
    match: 0, 
    status: "待测试",
    uploadTime: "2026-01-27"
  },
]

export default function RecruiterPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  
  const filteredCandidates = mockCandidates.filter(c => 
    c.name.includes(searchTerm) || c.position.includes(searchTerm)
  )

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-enterprise-gradient">
      <header className="glass-nav sticky top-0 z-40 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-[17px] font-semibold">招聘人才匹配</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4">
        {/* 上传简历卡片 */}
        <Card className="glass-card overflow-hidden">
          <div className="gradient-enterprise p-6 text-white text-center">
            <Upload className="w-10 h-10 mx-auto mb-3 opacity-90" />
            <h3 className="font-semibold mb-2">上传候选人简历</h3>
            <p className="text-sm opacity-80 mb-4">
              支持 PDF、Word 格式，AI 自动分析
            </p>
            <Button 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Upload className="w-4 h-4 mr-2" />
              选择文件
            </Button>
          </div>
        </Card>

        {/* 搜索栏 */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索候选人..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass-card border-0"
          />
        </div>

        {/* 候选人列表 */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              候选人列表
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                    {candidate.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{candidate.name}</p>
                    <p className="text-xs text-gray-500">{candidate.position}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {candidate.match > 0 ? (
                    <div className="text-right">
                      <p className={cn(
                        "text-sm font-medium",
                        candidate.match >= 90 ? "text-green-600" : 
                        candidate.match >= 80 ? "text-blue-600" : "text-amber-600"
                      )}>
                        {candidate.match}%匹配
                      </p>
                      <p className="text-xs text-gray-400">{candidate.mbti}</p>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">待测试</span>
                  )}
                  <span className={cn(
                    "px-2 py-0.5 text-xs font-medium rounded-full",
                    candidate.status === "面试中" && "bg-green-100 text-green-700",
                    candidate.status === "待面试" && "bg-blue-100 text-blue-700",
                    candidate.status === "待测试" && "bg-gray-100 text-gray-500"
                  )}>
                    {candidate.status}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
            
            {filteredCandidates.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <User className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>暂无候选人</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 使用指南 */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <h4 className="font-medium text-sm mb-3">使用指南</h4>
            <div className="space-y-2">
              {[
                { icon: Upload, text: "上传候选人简历" },
                { icon: FileText, text: "系统自动提取信息" },
                { icon: Target, text: "发送测试链接" },
                { icon: CheckCircle, text: "查看匹配报告" },
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                    <step.icon className="w-3 h-3 text-purple-600" />
                  </div>
                  <span>{step.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
