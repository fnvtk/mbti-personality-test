"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Copy, Check, Home, Users, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminPage() {
  const router = useRouter()
  const [apiKey, setApiKey] = useState("")
  const [appId, setAppId] = useState("")
  const [clientId, setClientId] = useState("")
  const [isSaved, setIsSaved] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [adminUsername, setAdminUsername] = useState("admin")
  const [adminPassword, setAdminPassword] = useState("88888888")
  const [credentialsSaved, setCredentialsSaved] = useState(false)

  // 检查登录状态
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    if (!adminLoggedIn) {
      router.push("/admin/login")
    } else {
      setIsLoggedIn(true)
    }
  }, [router])

  // 加载已保存的设置
  useEffect(() => {
    if (isLoggedIn) {
      const savedApiKey = localStorage.getItem("cozeApiKey") || ""
      const savedAppId = localStorage.getItem("cozeAppId") || ""
      const savedClientId = localStorage.getItem("cozeClientId") || ""
      const savedUsername = localStorage.getItem("adminUsername") || "admin"
      const savedPassword = localStorage.getItem("adminPassword") || "88888888"

      setApiKey(savedApiKey)
      setAppId(savedAppId)
      setClientId(savedClientId)
      setAdminUsername(savedUsername)
      setAdminPassword(savedPassword)
    }
  }, [isLoggedIn])

  // 扣子(coze.cn)的提示词
  const cozePrompt = `请你扮演一位专业的人才测评师，通过分析用户上传的三张不同角度（正面、左侧45度、右侧45度）的面部照片，结合《冰鉴》、《相术》等古代相面术以及现代心理学、行为科学等理论，对用户进行全面的性格分析。

分析内容应包括：
1. MBTI性格类型判断及详细解释
2. PDP行为偏好分析（老虎、孔雀、无尾熊、猫头鹰、变色龙）
3. DISC沟通风格评估
4. 面相特点与性格特质的关联分析
5. 职业倾向与优势领域建议
6. 人际关系与团队协作风格分析

请确保分析结果专业、客观、全面，并以易于理解的方式呈现。避免使用过于专业的术语，注重实用性建议。分析应基于照片中可观察到的面部特征，如面型、眼睛、鼻子、嘴巴、下巴等，结合各种理论进行综合判断。

最终输出格式应包含以下部分：
- 总体性格概述（200字左右）
- MBTI类型（包括四维度详解）
- PDP主导型与辅助型分析
- DISC沟通风格分析
- 优势能力与潜力领域
- 职业发展建议
- 人际关系与团队协作建议

请以专业、温和的语气进行分析，避免过度批判或过度赞美，保持客观中立的立场。`

  // 保存API设置
  const saveSettings = () => {
    localStorage.setItem("cozeApiKey", apiKey)
    localStorage.setItem("cozeAppId", appId)
    localStorage.setItem("cozeClientId", clientId)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  // 保存管理员凭据
  const saveCredentials = () => {
    localStorage.setItem("adminUsername", adminUsername)
    localStorage.setItem("adminPassword", adminPassword)
    setCredentialsSaved(true)
    setTimeout(() => setCredentialsSaved(false), 2000)
  }

  // 复制提示词
  const copyPrompt = () => {
    navigator.clipboard.writeText(cozePrompt)
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2000)
  }

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    router.push("/admin/login")
  }

  if (!isLoggedIn) {
    return null // 等待重定向
  }

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen p-4 md:p-8 bg-gray-100">
      <header className="bg-white shadow-sm mb-6 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">管理后台</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            退出登录
          </Button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        {/* 侧边导航 - 移除数据库设置选项 */}
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push("/admin/dashboard")}
                >
                  <Home className="h-4 w-4 mr-2" />
                  仪表板
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/users")}>
                  <Users className="h-4 w-4 mr-2" />
                  用户数据
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start bg-gray-100"
                  onClick={() => router.push("/admin")}
                >
                  <Save className="h-4 w-4 mr-2" />
                  API设置
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* 主内容 */}
        <div className="flex-1 space-y-6">
          <Tabs defaultValue="settings">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="settings">API设置</TabsTrigger>
              <TabsTrigger value="prompt">提示词参考</TabsTrigger>
              <TabsTrigger value="account">账号设置</TabsTrigger>
            </TabsList>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>扣子(Coze)API设置</CardTitle>
                  <CardDescription>配置与扣子(Coze.cn)的连接信息，用于照片分析功能</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isSaved && (
                    <Alert className="bg-green-50 border-green-200 mb-4">
                      <AlertDescription className="text-green-700">设置已保存</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="appId">应用ID (App ID)</Label>
                    <Input
                      id="appId"
                      value={appId}
                      onChange={(e) => setAppId(e.target.value)}
                      placeholder="输入扣子(Coze)的应用ID"
                    />
                    <p className="text-xs text-gray-500">例如: 1151859692941</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientId">客户端ID (Client ID)</Label>
                    <Input
                      id="clientId"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="输入扣子(Coze)的客户端ID"
                    />
                    <p className="text-xs text-gray-500">例如: 535227304978582177762740044195.app.coze</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API密钥 (API Key)</Label>
                    <Input
                      id="apiKey"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="输入扣子(Coze)的API密钥"
                    />
                    <p className="text-xs text-gray-500">在扣子平台的"授权"页面获取API密钥</p>
                  </div>

                  <Button onClick={saveSettings} className="flex items-center">
                    {isSaved ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {isSaved ? "已保存" : "保存设置"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prompt">
              <Card>
                <CardHeader>
                  <CardTitle>提示词参考</CardTitle>
                  <CardDescription>用于扣子(Coze)机器人的提示词，可以复制并粘贴到Coze平台</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea className="min-h-[400px] font-mono text-sm" value={cozePrompt} readOnly />
                  <Button onClick={copyPrompt} className="flex items-center">
                    {promptCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {promptCopied ? "已复制" : "复制提示词"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>管理员账号设置</CardTitle>
                  <CardDescription>修改管理员账号和密码</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {credentialsSaved && (
                    <Alert className="bg-green-50 border-green-200 mb-4">
                      <AlertDescription className="text-green-700">账号设置已保存</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="adminUsername">管理员用户名</Label>
                    <Input
                      id="adminUsername"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="输入管理员用户名"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">管理员密码</Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="输入管理员密码"
                    />
                    <p className="text-xs text-gray-500">默认用户名: admin，默认密码: 88888888</p>
                  </div>
                  <Button onClick={saveCredentials} className="flex items-center">
                    {credentialsSaved ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {credentialsSaved ? "已保存" : "保存凭据"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
