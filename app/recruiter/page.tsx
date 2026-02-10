"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter, User, Download } from "lucide-react"
import Image from "next/image"

export default function RecruiterPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const candidates = [
    {
      id: 1,
      name: "张三",
      position: "产品经理",
      personality: "ENTJ",
      match: 95,
      photo: "/placeholder.svg?height=48&width=48",
    },
    {
      id: 2,
      name: "李四",
      position: "UI设计师",
      personality: "INFP",
      match: 82,
      photo: "/placeholder.svg?height=48&width=48",
    },
    {
      id: 3,
      name: "王五",
      position: "前端开发",
      personality: "INTJ",
      match: 78,
      photo: "/placeholder.svg?height=48&width=48",
    },
    {
      id: 4,
      name: "赵六",
      position: "市场专员",
      personality: "ESFJ",
      match: 65,
      photo: "/placeholder.svg?height=48&width=48",
    },
  ]

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.includes(searchQuery) ||
      candidate.position.includes(searchQuery) ||
      candidate.personality.includes(searchQuery),
  )

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      <div className="p-4 flex items-center justify-between bg-white border-b">
        <h1 className="text-lg font-medium">招聘管理</h1>
        <Button variant="ghost" size="icon" onClick={() => router.push("/recruiter/settings")}>
          <User className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 bg-white">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="搜索候选人..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {filteredCandidates.map((candidate) => (
          <Card
            key={candidate.id}
            className="p-4 cursor-pointer hover:border-purple-200"
            onClick={() => router.push(`/recruiter/candidate/${candidate.id}`)}
          >
            <div className="flex items-center">
              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image src={candidate.photo || "/placeholder.svg"} alt={candidate.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{candidate.name}</h3>
                  <span
                    className={`text-sm font-medium ${
                      candidate.match >= 90
                        ? "text-green-500"
                        : candidate.match >= 80
                          ? "text-blue-500"
                          : candidate.match >= 70
                            ? "text-yellow-500"
                            : "text-gray-500"
                    }`}
                  >
                    匹配度 {candidate.match}%
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">{candidate.position}</span>
                  <span className="text-sm bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                    {candidate.personality}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="p-4 border-t bg-white">
        <Button className="w-full bg-purple-600 hover:bg-purple-700">
          <Download className="h-4 w-4 mr-2" />
          导出候选人报告
        </Button>
      </div>
    </div>
  )
}
