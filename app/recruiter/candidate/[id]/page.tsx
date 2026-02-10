"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Download, Mail, Phone, ThumbsUp, ThumbsDown } from "lucide-react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CandidateDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const candidateId = params.id

  // Mock candidate data
  const candidate = {
    id: candidateId,
    name: "张三",
    position: "产品经理",
    photo: "/placeholder.svg?height=100&width=100",
    email: "zhangsan@example.com",
    phone: "13800138000",
    personality: "ENTJ",
    match: 95,
    strengths: ["领导能力", "战略思维", "决策能力", "目标导向"],
    weaknesses: ["可能过于直接", "不够耐心", "可能忽视他人感受"],
    resumeHighlights: [
      "北京大学工商管理硕士",
      "5年产品管理经验",
      "主导过3个大型产品从0到1的过程",
      "擅长用户研究和数据分析",
    ],
    photoAnalysis: {
      expression: "自信、专注",
      communication: "直接、坦率",
      leadership: "果断、有说服力",
    },
  }

  const jobFitAnalysis = {
    overall: 95,
    leadership: 90,
    teamwork: 85,
    communication: 88,
    problemSolving: 92,
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      <div className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">候选人详情</h1>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Candidate Profile */}
          <Card className="p-6">
            <div className="flex items-start">
              <div className="relative w-20 h-20 rounded-full overflow-hidden mr-4">
                <Image src={candidate.photo || "/placeholder.svg"} alt={candidate.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{candidate.name}</h2>
                  <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    匹配度 {candidate.match}%
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{candidate.position}</p>

                <div className="flex items-center mt-3 text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{candidate.email}</span>
                </div>

                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{candidate.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <div className="flex-1 text-center p-2 bg-purple-100 rounded-lg">
                <div className="text-sm text-gray-600">性格类型</div>
                <div className="font-bold text-purple-700">{candidate.personality}</div>
              </div>
              <div className="flex-1 text-center p-2 bg-blue-100 rounded-lg">
                <div className="text-sm text-gray-600">领导风格</div>
                <div className="font-bold text-blue-700">战略型</div>
              </div>
              <div className="flex-1 text-center p-2 bg-green-100 rounded-lg">
                <div className="text-sm text-gray-600">沟通风格</div>
                <div className="font-bold text-green-700">直接型</div>
              </div>
            </div>
          </Card>

          {/* Tabs for different analyses */}
          <Tabs defaultValue="personality">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="personality">性格分析</TabsTrigger>
              <TabsTrigger value="resume">简历分析</TabsTrigger>
              <TabsTrigger value="jobfit">岗位匹配</TabsTrigger>
            </TabsList>

            <TabsContent value="personality">
              <Card className="p-6 mb-4">
                <h3 className="font-bold mb-4">性格优势</h3>
                <div className="space-y-2">
                  {candidate.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center">
                      <ThumbsUp className="h-4 w-4 text-green-500 mr-2" />
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 mb-4">
                <h3 className="font-bold mb-4">需要注意</h3>
                <div className="space-y-2">
                  {candidate.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-center">
                      <ThumbsDown className="h-4 w-4 text-red-500 mr-2" />
                      <span>{weakness}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-4">照片分析</h3>
                <div className="space-y-3">
                  {Object.entries(candidate.photoAnalysis).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="resume">
              <Card className="p-6">
                <h3 className="font-bold mb-4">简历要点</h3>
                <div className="space-y-2">
                  {candidate.resumeHighlights.map((highlight, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="jobfit">
              <Card className="p-6">
                <h3 className="font-bold mb-4">岗位匹配度分析</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>总体匹配度</span>
                      <span className="font-medium">{jobFitAnalysis.overall}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${jobFitAnalysis.overall}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>领导能力</span>
                      <span className="font-medium">{jobFitAnalysis.leadership}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${jobFitAnalysis.leadership}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>团队协作</span>
                      <span className="font-medium">{jobFitAnalysis.teamwork}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${jobFitAnalysis.teamwork}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>沟通能力</span>
                      <span className="font-medium">{jobFitAnalysis.communication}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${jobFitAnalysis.communication}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>问题解决</span>
                      <span className="font-medium">{jobFitAnalysis.problemSolving}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${jobFitAnalysis.problemSolving}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="p-4 border-t flex space-x-4">
        <Button variant="outline" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          导出报告
        </Button>
        <Button className="flex-1 bg-purple-600 hover:bg-purple-700">安排面试</Button>
      </div>
    </div>
  )
}
