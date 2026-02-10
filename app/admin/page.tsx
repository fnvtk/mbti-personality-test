"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Check, Eye, EyeOff, RotateCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// 默认AI人脸分析提示词
const DEFAULT_AI_PROMPT = `将他视为一个模拟的人，使用曾国藩《冰鉴》（骨形包含：颧骨、驿马骨、将军骨、日角骨、月角骨、龙宫骨、伏犀骨、龙角骨）、《周易》《燕翼子·相人》《骈拇子·卜相》的知识，进行面相五官（额头、眼睛、耳朵、鼻子、嘴巴、下巴、骨形）分析。

用MBTI测试、PDP测试、DISC测试、盖洛普测试，这个面相的会偏向属于什么类别：
- MBTI性格（16种类型）
- PDP性格（老虎、孔雀、无尾熊、猫头鹰、变色龙），以主性格+辅助性格分，比如老虎+孔雀
- DISC性格（力量D、活跃I、和平S、完美C），以主性格+辅助性格分
- 盖洛普的前三大优势

要求：
1、用每本书的知识互相验证
2、描述详细清晰，用全力深入分析，不要模棱两可
3、直接给是什么性格的答案，不要展示分析的过程
4、用中文分析`

export default function AdminSettingsPage() {
  const [groqApiKey, setGroqApiKey] = useState("")
  const [geminiApiKey, setGeminiApiKey] = useState("")
  const [isSaved, setIsSaved] = useState(false)
  const [promptSaved, setPromptSaved] = useState(false)
  const [adminUsername, setAdminUsername] = useState("admin")
  const [adminPassword, setAdminPassword] = useState("k123456")
  const [showPassword, setShowPassword] = useState(false)
  const [credentialsSaved, setCredentialsSaved] = useState(false)
  const [aiPrompt, setAiPrompt] = useState(DEFAULT_AI_PROMPT)

  // 加载已保存的设置
  useEffect(() => {
    const savedGroqKey = localStorage.getItem("groqApiKey") || ""
    const savedGeminiKey = localStorage.getItem("geminiApiKey") || ""
    const savedUsername = localStorage.getItem("adminUsername") || "admin"
    const savedPassword = localStorage.getItem("adminPassword") || "k123456"
    const savedPrompt = localStorage.getItem("aiFacePrompt") || DEFAULT_AI_PROMPT

    setGroqApiKey(savedGroqKey)
    setGeminiApiKey(savedGeminiKey)
    setAdminUsername(savedUsername)
    setAdminPassword(savedPassword)
    setAiPrompt(savedPrompt)
  }, [])

  // 保存API设置
  const saveSettings = () => {
    localStorage.setItem("groqApiKey", groqApiKey)
    localStorage.setItem("geminiApiKey", geminiApiKey)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  // 保存AI提示词
  const savePrompt = () => {
    localStorage.setItem("aiFacePrompt", aiPrompt)
    setPromptSaved(true)
    setTimeout(() => setPromptSaved(false), 2000)
  }

  // 重置提示词为默认
  const resetPrompt = () => {
    setAiPrompt(DEFAULT_AI_PROMPT)
    localStorage.setItem("aiFacePrompt", DEFAULT_AI_PROMPT)
  }

  // 保存管理员凭据
  const saveCredentials = () => {
    localStorage.setItem("adminUsername", adminUsername)
    localStorage.setItem("adminPassword", adminPassword)
    setCredentialsSaved(true)
    setTimeout(() => setCredentialsSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
        <p className="text-gray-500 mt-1">配置AI服务、提示词和管理员账号</p>
      </div>

      <Tabs defaultValue="ai-prompt" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="ai-prompt">AI提示词</TabsTrigger>
          <TabsTrigger value="api-settings">AI服务配置</TabsTrigger>
          <TabsTrigger value="account">账号设置</TabsTrigger>
        </TabsList>

        {/* AI提示词管理 */}
        <TabsContent value="ai-prompt">
          <Card>
            <CardHeader>
              <CardTitle>AI人脸分析提示词</CardTitle>
              <CardDescription>
                用于AI人脸性格分析的核心提示词，基于《冰鉴》《周易》等面相学理论。
                修改后将直接影响AI分析结果。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {promptSaved && (
                <Alert className="bg-green-50 border-green-200 mb-4">
                  <AlertDescription className="text-green-700">提示词已保存</AlertDescription>
                </Alert>
              )}

              <Textarea 
                className="min-h-[400px] font-mono text-sm leading-relaxed" 
                value={aiPrompt} 
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="输入AI分析提示词..."
              />
              
              <div className="flex items-center gap-3">
                <Button onClick={savePrompt} className="flex items-center">
                  {promptSaved ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  {promptSaved ? "已保存" : "保存提示词"}
                </Button>
                <Button variant="outline" onClick={resetPrompt} className="flex items-center">
                  <RotateCw className="h-4 w-4 mr-2" />
                  恢复默认
                </Button>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700 font-medium mb-1">提示词说明</p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• 提示词基于曾国藩《冰鉴》骨形分析 + 《周易》面相学</li>
                  <li>• 分析维度：MBTI / PDP / DISC / 盖洛普优势</li>
                  <li>• 面相五官：额头、眼睛、耳朵、鼻子、嘴巴、下巴、骨形</li>
                  <li>• 修改后点击"保存提示词"即刻生效</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI服务配置 */}
        <TabsContent value="api-settings">
          <Card>
            <CardHeader>
              <CardTitle>AI服务配置</CardTitle>
              <CardDescription>配置AI分析引擎的API密钥</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isSaved && (
                <Alert className="bg-green-50 border-green-200 mb-4">
                  <AlertDescription className="text-green-700">设置已保存</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="groqKey">Groq API Key（当前使用）</Label>
                <Input
                  id="groqKey"
                  value={groqApiKey}
                  onChange={(e) => setGroqApiKey(e.target.value)}
                  placeholder="输入Groq API密钥"
                  type="password"
                />
                <p className="text-xs text-gray-500">免费，速度快。在 console.groq.com 获取</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="geminiKey">Gemini API Key（推荐升级）</Label>
                <Input
                  id="geminiKey"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="输入Gemini API密钥"
                  type="password"
                />
                <p className="text-xs text-gray-500">支持图像分析，效果更好。在 aistudio.google.com 获取</p>
              </div>

              <Button onClick={saveSettings} className="flex items-center">
                {isSaved ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                {isSaved ? "已保存" : "保存设置"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 账号设置 */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>管理员账号设置</CardTitle>
              <CardDescription>修改管理员登录用户名和密码</CardDescription>
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
                <div className="relative">
                  <Input
                    id="adminPassword"
                    type={showPassword ? "text" : "password"}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="输入管理员密码"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">默认用户名: admin，默认密码: k123456</p>
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
  )
}
