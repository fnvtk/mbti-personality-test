"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Edit, Trash2, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getDatabase, type User } from "@/lib/database"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// 导入雷达图组件
import { UserPersonalityChart } from "@/components/user-personality-chart"

// 导入导出组件
import { ExportUserData } from "@/components/export-user-data"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    nickname: "",
    phone: "",
    email: "",
    team: "",
  })
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    // 检查登录状态
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    if (!adminLoggedIn) {
      router.push("/admin/login")
      return
    }

    // 加载用户数据
    const userId = params.id
    const db = getDatabase()
    const userData = db.getUserById(userId)

    if (userData) {
      setUser(userData)
      setEditForm({
        name: userData.name || "",
        nickname: userData.nickname || "",
        phone: userData.phone || "",
        email: userData.email || "",
        team: userData.team || "",
      })
    }

    setIsLoading(false)
  }, [params.id, router])

  // 保存编辑
  const handleSaveEdit = () => {
    if (!user) return

    const db = getDatabase()
    const updatedUser = db.updateUser(user.id, {
      name: editForm.name,
      nickname: editForm.nickname,
      phone: editForm.phone,
      email: editForm.email,
      team: editForm.team,
    })

    if (updatedUser) {
      setUser(updatedUser)
    }

    setIsEditing(false)
  }

  // 删除用户
  const handleDeleteUser = () => {
    if (!user) return

    const db = getDatabase()
    db.deleteUser(user.id)
    router.push("/admin/users")
  }

  // 添加标签
  const handleAddTag = () => {
    if (!user || !newTag.trim()) return

    const db = getDatabase()
    const updatedTags = db.addUserTag(user.id, newTag.trim())

    if (updatedTags) {
      setUser({
        ...user,
        tags: updatedTags,
      })
    }

    setNewTag("")
  }

  // 移除标签
  const handleRemoveTag = (tag: string) => {
    if (!user) return

    const db = getDatabase()
    const updatedTags = db.removeUserTag(user.id, tag)

    if (updatedTags) {
      setUser({
        ...user,
        tags: updatedTags,
      })
    }
  }

  // 导出用户数据
  const handleExportUser = () => {
    if (!user) return

    const userData = JSON.stringify(user, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(userData)}`
    const exportFileDefaultName = `user_${user.id}_${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // 格式化日期
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  // 计算团队岗位匹配度
  const getTeamRoleMatch = (user: User, role: string): number => {
    // 这里可以根据用户的性格测试结果和岗位要求进行匹配度计算
    // 简单示例，可以根据实际情况进行调整
    let match = 50
    if (user.faceAnalysis?.mbti?.type) {
      if (role === "growth" && ["ENTJ", "ESTJ"].includes(user.faceAnalysis.mbti.type)) match += 15
      if (role === "userOps" && ["ISFJ", "ESFJ"].includes(user.faceAnalysis.mbti.type)) match += 15
      if (role === "contentOps" && ["INFP", "ENFP"].includes(user.faceAnalysis.mbti.type)) match += 15
      if (role === "productManager" && ["INTJ", "ENTP"].includes(user.faceAnalysis.mbti.type)) match += 15
      if (role === "developer" && ["ISTP", "INTP"].includes(user.faceAnalysis.mbti.type)) match += 15
      if (role === "designer" && ["ISFP", "ESFP"].includes(user.faceAnalysis.mbti.type)) match += 15
    }
    return Math.min(match, 95) // 匹配度最高95%
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>用户不存在</CardTitle>
            <CardDescription>找不到ID为 {params.id} 的用户</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/admin/users")}>返回用户列表</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.push("/admin/users")} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">用户详情</h1>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  取消
                </Button>
                <Button onClick={handleSaveEdit}>
                  <Save className="h-4 w-4 mr-2" />
                  保存
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleExportUser}>
                  <Download className="h-4 w-4 mr-2" />
                  导出
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  编辑
                </Button>
                <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
                <CardDescription>用户ID: {user.id}</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">姓名</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nickname">昵称</Label>
                      <Input
                        id="nickname"
                        value={editForm.nickname}
                        onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">手机号</Label>
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">邮箱</Label>
                      <Input
                        id="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="team">团队</Label>
                      <Input
                        id="team"
                        value={editForm.team}
                        onChange={(e) => setEditForm({ ...editForm, team: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">姓名:</span>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    {user.nickname && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">昵称:</span>
                        <span className="font-medium">{user.nickname}</span>
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">手机号:</span>
                        <span className="font-medium">{user.phone}</span>
                      </div>
                    )}
                    {user.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">邮箱:</span>
                        <span className="font-medium">{user.email}</span>
                      </div>
                    )}
                    {user.team && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">团队:</span>
                        <span className="font-medium">{user.team}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">创建时间:</span>
                      <span className="font-medium">{formatDate(user.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">更新时间:</span>
                      <span className="font-medium">{formatDate(user.updatedAt)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>标签管理</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {user.tags.length === 0 ? (
                      <span className="text-gray-500">暂无标签</span>
                    ) : (
                      user.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {tag}
                          <button
                            className="ml-1 text-gray-500 hover:text-red-500"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            ×
                          </button>
                        </Badge>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="添加新标签"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleAddTag}>添加</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>数据统计</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">照片数量:</span>
                    <span className="font-medium">{user.photos.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">测试结果:</span>
                    <span className="font-medium">{user.testResults.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">标签数量:</span>
                    <span className="font-medium">{user.tags.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <ExportUserData userId={user.id} />
          </div>

          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="analysis">
              <TabsList className="mb-4">
                <TabsTrigger value="analysis">分析结果</TabsTrigger>
                <TabsTrigger value="tests">测试记录</TabsTrigger>
                <TabsTrigger value="photos">照片记录</TabsTrigger>
                <TabsTrigger value="activity">活动历史</TabsTrigger>
              </TabsList>

              <TabsContent value="analysis">
                {user.faceAnalysis ? (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>MBTI分析</CardTitle>
                        <CardDescription>Myers-Briggs Type Indicator 性格类型指标</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">类型:</span>
                            <Badge variant="secondary">{user.faceAnalysis.mbti?.type || "未知"}</Badge>
                          </div>
                          <div>
                            <span className="font-medium">标题:</span>
                            <p className="text-sm mt-1">{user.faceAnalysis.mbti?.title || "未知"}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="border rounded-md p-3">
                              <span className="font-medium text-sm">能量来源:</span>
                              <p className="text-sm mt-1">{user.faceAnalysis.mbti?.dimensions?.energy || "未知"}</p>
                            </div>
                            <div className="border rounded-md p-3">
                              <span className="font-medium text-sm">信息处理:</span>
                              <p className="text-sm mt-1">
                                {user.faceAnalysis.mbti?.dimensions?.information || "未知"}
                              </p>
                            </div>
                            <div className="border rounded-md p-3">
                              <span className="font-medium text-sm">决策方式:</span>
                              <p className="text-sm mt-1">{user.faceAnalysis.mbti?.dimensions?.decisions || "未知"}</p>
                            </div>
                            <div className="border rounded-md p-3">
                              <span className="font-medium text-sm">生活方式:</span>
                              <p className="text-sm mt-1">{user.faceAnalysis.mbti?.dimensions?.lifestyle || "未知"}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <UserPersonalityChart
                      mbtiScores={{
                        E: user.faceAnalysis?.mbti?.scores?.E || 0,
                        I: user.faceAnalysis?.mbti?.scores?.I || 0,
                        S: user.faceAnalysis?.mbti?.scores?.S || 0,
                        N: user.faceAnalysis?.mbti?.scores?.N || 0,
                        T: user.faceAnalysis?.mbti?.scores?.T || 0,
                        F: user.faceAnalysis?.mbti?.scores?.F || 0,
                        J: user.faceAnalysis?.mbti?.scores?.J || 0,
                        P: user.faceAnalysis?.mbti?.scores?.P || 0,
                      }}
                      pdpScores={{
                        tiger: user.faceAnalysis?.pdp?.scores?.tiger || 0,
                        peacock: user.faceAnalysis?.pdp?.scores?.peacock || 0,
                        koala: user.faceAnalysis?.pdp?.scores?.koala || 0,
                        owl: user.faceAnalysis?.pdp?.scores?.owl || 0,
                        chameleon: user.faceAnalysis?.pdp?.scores?.chameleon || 0,
                      }}
                      discScores={{
                        D: user.faceAnalysis?.disc?.scores?.D || 0,
                        I: user.faceAnalysis?.disc?.scores?.I || 0,
                        S: user.faceAnalysis?.disc?.scores?.S || 0,
                        C: user.faceAnalysis?.disc?.scores?.C || 0,
                      }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>PDP分析</CardTitle>
                          <CardDescription>Personal Development Profile 个人发展剖析</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">主导型:</span>
                              <Badge>{user.faceAnalysis.pdp?.primary || "未知"}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">辅助型:</span>
                              <Badge variant="outline">{user.faceAnalysis.pdp?.secondary || "未知"}</Badge>
                            </div>
                            <div className="mt-4 border rounded-md p-3">
                              <span className="font-medium text-sm">特点描述:</span>
                              <p className="text-sm mt-1">{user.faceAnalysis.pdp?.description || "未知"}</p>
                            </div>
                            <div className="mt-2 border rounded-md p-3">
                              <span className="font-medium text-sm">工作风格:</span>
                              <p className="text-sm mt-1">{user.faceAnalysis.pdp?.workStyle || "未知"}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>DISC分析</CardTitle>
                          <CardDescription>行为风格评估</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">主要风格:</span>
                              <Badge>{user.faceAnalysis.disc?.primary || "未知"}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">次要风格:</span>
                              <Badge variant="outline">{user.faceAnalysis.disc?.secondary || "未知"}</Badge>
                            </div>
                            <div className="mt-4 border rounded-md p-3">
                              <span className="font-medium text-sm">行为特征:</span>
                              <p className="text-sm mt-1">{user.faceAnalysis.disc?.description || "未知"}</p>
                            </div>
                            <div className="mt-2 border rounded-md p-3">
                              <span className="font-medium text-sm">沟通风格:</span>
                              <p className="text-sm mt-1">{user.faceAnalysis.disc?.communication || "未知"}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>盖洛普优势</CardTitle>
                        <CardDescription>个人天赋优势分析</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {user.faceAnalysis.strengths && user.faceAnalysis.strengths.length > 0 ? (
                            <>
                              <div>
                                <span className="font-medium">主要优势:</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {user.faceAnalysis.strengths.map((strength: string, index: number) => (
                                    <Badge key={index} variant="outline">
                                      {strength}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {user.faceAnalysis.strengthDetails &&
                                  Object.entries(user.faceAnalysis.strengthDetails).map(
                                    ([key, value]: [string, any], index: number) => (
                                      <div key={index} className="border rounded-md p-3">
                                        <span className="font-medium text-sm">{key}:</span>
                                        <p className="text-sm mt-1">{value}</p>
                                      </div>
                                    ),
                                  )}
                              </div>
                            </>
                          ) : (
                            <p className="text-gray-500">暂无优势数据</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>团队岗位匹配度</CardTitle>
                        <CardDescription>基于性格测试的职业匹配分析</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="p-3 border rounded-lg">
                            <Badge className="mb-2">增长负责人</Badge>
                            <div className="text-sm text-gray-600">匹配度: {getTeamRoleMatch(user, "growth")}%</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${getTeamRoleMatch(user, "growth")}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <Badge className="mb-2">用户运营</Badge>
                            <div className="text-sm text-gray-600">匹配度: {getTeamRoleMatch(user, "userOps")}%</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${getTeamRoleMatch(user, "userOps")}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <Badge className="mb-2">内容运营</Badge>
                            <div className="text-sm text-gray-600">匹配度: {getTeamRoleMatch(user, "contentOps")}%</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${getTeamRoleMatch(user, "contentOps")}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <Badge className="mb-2">产品经理</Badge>
                            <div className="text-sm text-gray-600">
                              匹配度: {getTeamRoleMatch(user, "productManager")}%
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${getTeamRoleMatch(user, "productManager")}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <Badge className="mb-2">开发专员</Badge>
                            <div className="text-sm text-gray-600">匹配度: {getTeamRoleMatch(user, "developer")}%</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${getTeamRoleMatch(user, "developer")}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <Badge className="mb-2">设计师</Badge>
                            <div className="text-sm text-gray-600">
                              匹配度: {getTeamRoleMatch(user, "designer") || 75}%
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${getTeamRoleMatch(user, "designer") || 75}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-8">
                        <p className="text-gray-500">该用户暂无分析数据</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="tests">
                {user.testResults.length > 0 ? (
                  <div className="space-y-4">
                    {user.testResults.map((result, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle>
                              {result.testType === "mbti"
                                ? "MBTI测试"
                                : result.testType === "pdp"
                                  ? "PDP测试"
                                  : result.testType === "disc"
                                    ? "DISC测试"
                                    : result.testType === "face"
                                      ? "面相分析"
                                      : "未知测试"}
                            </CardTitle>
                            <Badge variant="outline">{formatDate(result.timestamp)}</Badge>
                          </div>
                          <CardDescription>测试ID: {result.id}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {result.testType === "mbti" && (
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">类型:</span>
                                  <Badge>{result.result.type}</Badge>
                                </div>
                                <div>
                                  <span className="font-medium">标题:</span>
                                  <p className="text-sm mt-1">{result.result.title}</p>
                                </div>
                                {result.result.description && (
                                  <div className="border rounded-md p-3 mt-2">
                                    <span className="font-medium text-sm">描述:</span>
                                    <p className="text-sm mt-1">{result.result.description}</p>
                                  </div>
                                )}
                                {result.result.scores && (
                                  <div className="mt-4">
                                    <span className="font-medium text-sm">维度得分:</span>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                      {Object.entries(result.result.scores).map(([key, value]: [string, any], i) => (
                                        <div key={i} className="border rounded-md p-2">
                                          <div className="text-xs font-medium">{key}</div>
                                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div
                                              className="bg-blue-600 h-2 rounded-full"
                                              style={{ width: `${value}%` }}
                                            ></div>
                                          </div>
                                          <div className="text-xs text-right mt-1">{value}%</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            {result.testType === "pdp" && (
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">主导型:</span>
                                  <Badge>{result.result.primary}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">辅助型:</span>
                                  <Badge variant="outline">{result.result.secondary}</Badge>
                                </div>
                                {result.result.description && (
                                  <div className="border rounded-md p-3 mt-2">
                                    <span className="font-medium text-sm">描述:</span>
                                    <p className="text-sm mt-1">{result.result.description}</p>
                                  </div>
                                )}
                                {result.result.scores && (
                                  <div className="mt-4">
                                    <span className="font-medium text-sm">类型得分:</span>
                                    <div className="grid grid-cols-1 gap-2 mt-2">
                                      {Object.entries(result.result.scores).map(([key, value]: [string, any], i) => (
                                        <div key={i} className="border rounded-md p-2">
                                          <div className="flex justify-between">
                                            <span className="text-xs font-medium">{key}</span>
                                            <span className="text-xs">{value}%</span>
                                          </div>
                                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div
                                              className="bg-blue-600 h-2 rounded-full"
                                              style={{ width: `${value}%` }}
                                            ></div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            {result.testType === "disc" && (
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">主要风格:</span>
                                  <Badge>{result.result.primary}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">次要风格:</span>
                                  <Badge variant="outline">{result.result.secondary}</Badge>
                                </div>
                                {result.result.description && (
                                  <div className="border rounded-md p-3 mt-2">
                                    <span className="font-medium text-sm">描述:</span>
                                    <p className="text-sm mt-1">{result.result.description}</p>
                                  </div>
                                )}
                                {result.result.scores && (
                                  <div className="mt-4">
                                    <span className="font-medium text-sm">维度得分:</span>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                      {Object.entries(result.result.scores).map(([key, value]: [string, any], i) => (
                                        <div key={i} className="border rounded-md p-2">
                                          <div className="text-xs font-medium">{key}</div>
                                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div
                                              className="bg-blue-600 h-2 rounded-full"
                                              style={{ width: `${value}%` }}
                                            ></div>
                                          </div>
                                          <div className="text-xs text-right mt-1">{value}%</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            {result.testType === "face" && (
                              <div className="space-y-4">
                                <div className="text-sm">面相分析完成</div>
                                {result.result.data && (
                                  <div className="mt-4 space-y-4">
                                    {result.result.data.mbti && (
                                      <div className="border rounded-md p-3">
                                        <div className="font-medium text-sm mb-2">MBTI分析:</div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <Badge variant="outline">类型</Badge>
                                          <span className="text-sm">{result.result.data.mbti.type}</span>
                                        </div>
                                        {result.result.data.mbti.title && (
                                          <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline">标题</Badge>
                                            <span className="text-sm">{result.result.data.mbti.title}</span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    {result.result.data.pdp && (
                                      <div className="border rounded-md p-3">
                                        <div className="font-medium text-sm mb-2">PDP分析:</div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <Badge variant="outline">主导型</Badge>
                                          <span className="text-sm">{result.result.data.pdp.primary}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline">辅助型</Badge>
                                          <span className="text-sm">{result.result.data.pdp.secondary}</span>
                                        </div>
                                      </div>
                                    )}
                                    {result.result.data.disc && (
                                      <div className="border rounded-md p-3">
                                        <div className="font-medium text-sm mb-2">DISC分析:</div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <Badge variant="outline">主要风格</Badge>
                                          <span className="text-sm">{result.result.data.disc.primary}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline">次要风格</Badge>
                                          <span className="text-sm">{result.result.data.disc.secondary}</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-8">
                        <p className="text-gray-500">该用户暂无测试记录</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="photos">
                {user.photos.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>用户照片</CardTitle>
                      <CardDescription>共 {user.photos.length} 张照片</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {user.photos.map((photo, index) => (
                          <div key={index} className="space-y-2">
                            <div className="relative aspect-square rounded-md overflow-hidden border">
                              <img
                                src={photo.photoUrl || "/placeholder.svg"}
                                alt={`Photo ${index + 1}`}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex flex-col space-y-1">
                              <Badge>
                                {photo.angle === "front" ? "正面" : photo.angle === "left45" ? "左侧45°" : "右侧45°"}
                              </Badge>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>拍摄时间:</span>
                                <span>{formatDate(photo.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-8">
                        <p className="text-gray-500">该用户暂无照片记录</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>用户活动历史</CardTitle>
                    <CardDescription>记录用户的测试和分析活动</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user.testResults.length > 0 || user.photos.length > 0 ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                          <div className="space-y-6 relative">
                            {[
                              ...user.testResults,
                              ...user.photos.map((photo) => ({
                                id: `photo_${photo.id}`,
                                userId: user.id,
                                type: "photo",
                                angle: photo.angle,
                                timestamp: photo.timestamp,
                              })),
                            ]
                              .sort((a, b) => b.timestamp - a.timestamp)
                              .map((item, index) => (
                                <div key={index} className="flex gap-4 relative">
                                  <div className="absolute left-3 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 z-10"></div>
                                  <div className="ml-6 flex-1 bg-gray-50 rounded-md p-3 border">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        {"testType" in item ? (
                                          <Badge>
                                            {item.testType === "mbti"
                                              ? "完成MBTI测试"
                                              : item.testType === "pdp"
                                                ? "完成PDP测试"
                                                : item.testType === "disc"
                                                  ? "完成DISC测试"
                                                  : item.testType === "face"
                                                    ? "完成面相分析"
                                                    : "未知活动"}
                                          </Badge>
                                        ) : (
                                          <Badge>
                                            上传
                                            {item.angle === "front"
                                              ? "正面"
                                              : item.angle === "left45"
                                                ? "左侧45°"
                                                : "右侧45°"}
                                            照片
                                          </Badge>
                                        )}
                                      </div>
                                      <span className="text-xs text-gray-500">{formatDate(item.timestamp)}</span>
                                    </div>
                                    {"testType" in item && item.testType === "mbti" && item.result?.type && (
                                      <div className="mt-2 text-sm">
                                        结果: <span className="font-medium">{item.result.type}</span> -{" "}
                                        {item.result.title}
                                      </div>
                                    )}
                                    {"testType" in item && item.testType === "pdp" && item.result?.primary && (
                                      <div className="mt-2 text-sm">
                                        结果: <span className="font-medium">{item.result.primary}</span> +{" "}
                                        {item.result.secondary}
                                      </div>
                                    )}
                                    {"testType" in item && item.testType === "disc" && item.result?.primary && (
                                      <div className="mt-2 text-sm">
                                        结果: <span className="font-medium">{item.result.primary}</span> +{" "}
                                        {item.result.secondary}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">该用户暂无活动记录</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* 删除用户确认对话框 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除用户</DialogTitle>
            <DialogDescription>
              您确定要删除用户 {user.name} (ID: {user.id}) 吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
