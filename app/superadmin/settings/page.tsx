"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import {
  Save, CheckCircle, Key, Bot, Shield, Bell, Database, Globe
} from "lucide-react"

export default function SettingsPage() {
  // API 配置
  const [apiConfig, setApiConfig] = useState({
    cozeAppId: "",
    cozeClientId: "",
    cozeApiKey: "",
    groqApiKey: "",
  })

  // 系统配置
  const [systemConfig, setSystemConfig] = useState({
    siteName: "神仙团队AI性格测试",
    siteDescription: "专业的AI性格测试平台",
    maintenanceMode: false,
    registrationOpen: true,
    maxTestsPerDay: 100,
    trialTestCount: 10,
  })

  // 超管凭据
  const [credentials, setCredentials] = useState({
    username: "admin",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // 通知配置
  const [notificationConfig, setNotificationConfig] = useState({
    emailNotification: true,
    lowBalanceAlert: true,
    lowBalanceThreshold: 1000,
    newEnterpriseNotify: true,
  })

  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  // 加载配置
  useEffect(() => {
    const savedApi = localStorage.getItem("superadmin_apiConfig")
    const savedSystem = localStorage.getItem("superadmin_systemConfig")
    const savedNotification = localStorage.getItem("superadmin_notificationConfig")
    if (savedApi) setApiConfig(JSON.parse(savedApi))
    if (savedSystem) setSystemConfig(JSON.parse(savedSystem))
    if (savedNotification) setNotificationConfig(JSON.parse(savedNotification))
  }, [])

  // 保存配置
  const handleSave = (section: string) => {
    switch (section) {
      case "api":
        localStorage.setItem("superadmin_apiConfig", JSON.stringify(apiConfig))
        break
      case "system":
        localStorage.setItem("superadmin_systemConfig", JSON.stringify(systemConfig))
        break
      case "notification":
        localStorage.setItem("superadmin_notificationConfig", JSON.stringify(notificationConfig))
        break
      case "credentials":
        if (credentials.newPassword !== credentials.confirmPassword) {
          alert("两次输入的密码不一致")
          return
        }
        // 实际项目中应调用 API 验证并更新
        localStorage.setItem("superadmin_credentials", JSON.stringify({
          username: credentials.username,
        }))
        setCredentials({ ...credentials, currentPassword: "", newPassword: "", confirmPassword: "" })
        break
    }
    setSaveSuccess(section)
    setTimeout(() => setSaveSuccess(null), 3000)
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
        <p className="text-sm text-gray-500 mt-1">管理系统配置、API密钥和管理员账户</p>
      </div>

      {/* 保存成功提示 */}
      {saveSuccess && (
        <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>设置已保存成功</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="api" className="space-y-4">
        <TabsList className="bg-gray-100/80 p-1">
          <TabsTrigger value="api" className="text-sm gap-1.5">
            <Key className="h-3.5 w-3.5" />API配置
          </TabsTrigger>
          <TabsTrigger value="system" className="text-sm gap-1.5">
            <Globe className="h-3.5 w-3.5" />系统配置
          </TabsTrigger>
          <TabsTrigger value="notification" className="text-sm gap-1.5">
            <Bell className="h-3.5 w-3.5" />通知设置
          </TabsTrigger>
          <TabsTrigger value="security" className="text-sm gap-1.5">
            <Shield className="h-3.5 w-3.5" />账户安全
          </TabsTrigger>
        </TabsList>

        {/* API 配置 */}
        <TabsContent value="api">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="h-4 w-4 text-indigo-500" />
                AI 服务 API 配置
              </CardTitle>
              <CardDescription>配置 Coze 和 Groq 的 API 密钥</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Coze App ID</Label>
                  <Input
                    value={apiConfig.cozeAppId}
                    onChange={(e) => setApiConfig({ ...apiConfig, cozeAppId: e.target.value })}
                    placeholder="输入 Coze App ID"
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Coze Client ID</Label>
                  <Input
                    value={apiConfig.cozeClientId}
                    onChange={(e) => setApiConfig({ ...apiConfig, cozeClientId: e.target.value })}
                    placeholder="输入 Coze Client ID"
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Coze API Key</Label>
                  <Input
                    type="password"
                    value={apiConfig.cozeApiKey}
                    onChange={(e) => setApiConfig({ ...apiConfig, cozeApiKey: e.target.value })}
                    placeholder="输入 Coze API Key"
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Groq API Key</Label>
                  <Input
                    type="password"
                    value={apiConfig.groqApiKey}
                    onChange={(e) => setApiConfig({ ...apiConfig, groqApiKey: e.target.value })}
                    placeholder="输入 Groq API Key"
                    className="h-9"
                  />
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-3 text-xs text-amber-700 border border-amber-100">
                API 密钥属于敏感信息，请妥善保管。修改后需重启服务才能生效。
              </div>

              <Button onClick={() => handleSave("api")} className="bg-indigo-600 hover:bg-indigo-700">
                <Save className="h-4 w-4 mr-1.5" />保存 API 配置
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 系统配置 */}
        <TabsContent value="system">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-500" />
                系统基础配置
              </CardTitle>
              <CardDescription>管理网站名称、维护模式等基础设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">网站名称</Label>
                  <Input
                    value={systemConfig.siteName}
                    onChange={(e) => setSystemConfig({ ...systemConfig, siteName: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">网站描述</Label>
                  <Input
                    value={systemConfig.siteDescription}
                    onChange={(e) => setSystemConfig({ ...systemConfig, siteDescription: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">每日最大测试数</Label>
                  <Input
                    type="number"
                    value={systemConfig.maxTestsPerDay}
                    onChange={(e) => setSystemConfig({ ...systemConfig, maxTestsPerDay: Number(e.target.value) })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">企业试用测试次数</Label>
                  <Input
                    type="number"
                    value={systemConfig.trialTestCount}
                    onChange={(e) => setSystemConfig({ ...systemConfig, trialTestCount: Number(e.target.value) })}
                    className="h-9"
                  />
                </div>
              </div>

              {/* 开关项 */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">维护模式</p>
                    <p className="text-xs text-gray-500">开启后前台将显示维护页面</p>
                  </div>
                  <Switch
                    checked={systemConfig.maintenanceMode}
                    onCheckedChange={(checked) => setSystemConfig({ ...systemConfig, maintenanceMode: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">开放注册</p>
                    <p className="text-xs text-gray-500">允许新用户注册账户</p>
                  </div>
                  <Switch
                    checked={systemConfig.registrationOpen}
                    onCheckedChange={(checked) => setSystemConfig({ ...systemConfig, registrationOpen: checked })}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("system")} className="bg-indigo-600 hover:bg-indigo-700">
                <Save className="h-4 w-4 mr-1.5" />保存系统配置
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 通知设置 */}
        <TabsContent value="notification">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-indigo-500" />
                通知与告警设置
              </CardTitle>
              <CardDescription>管理系统通知和企业告警规则</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">邮件通知</p>
                    <p className="text-xs text-gray-500">发送重要事件邮件通知</p>
                  </div>
                  <Switch
                    checked={notificationConfig.emailNotification}
                    onCheckedChange={(checked) => setNotificationConfig({ ...notificationConfig, emailNotification: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">余额不足告警</p>
                    <p className="text-xs text-gray-500">企业余额低于阈值时提醒</p>
                  </div>
                  <Switch
                    checked={notificationConfig.lowBalanceAlert}
                    onCheckedChange={(checked) => setNotificationConfig({ ...notificationConfig, lowBalanceAlert: checked })}
                  />
                </div>

                {notificationConfig.lowBalanceAlert && (
                  <div className="ml-4 space-y-2">
                    <Label className="text-sm">余额告警阈值（元）</Label>
                    <Input
                      type="number"
                      value={notificationConfig.lowBalanceThreshold}
                      onChange={(e) => setNotificationConfig({ ...notificationConfig, lowBalanceThreshold: Number(e.target.value) })}
                      min="100"
                      step="100"
                      className="h-9 max-w-xs"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">新企业入驻通知</p>
                    <p className="text-xs text-gray-500">有新企业入驻时发送通知</p>
                  </div>
                  <Switch
                    checked={notificationConfig.newEnterpriseNotify}
                    onCheckedChange={(checked) => setNotificationConfig({ ...notificationConfig, newEnterpriseNotify: checked })}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("notification")} className="bg-indigo-600 hover:bg-indigo-700">
                <Save className="h-4 w-4 mr-1.5" />保存通知设置
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 账户安全 */}
        <TabsContent value="security">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-indigo-500" />
                超管账户安全
              </CardTitle>
              <CardDescription>修改超级管理员用户名和密码</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">用户名</Label>
                <Input
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="h-9 max-w-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">当前密码</Label>
                <Input
                  type="password"
                  value={credentials.currentPassword}
                  onChange={(e) => setCredentials({ ...credentials, currentPassword: e.target.value })}
                  placeholder="输入当前密码"
                  className="h-9 max-w-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">新密码</Label>
                <Input
                  type="password"
                  value={credentials.newPassword}
                  onChange={(e) => setCredentials({ ...credentials, newPassword: e.target.value })}
                  placeholder="输入新密码"
                  className="h-9 max-w-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">确认新密码</Label>
                <Input
                  type="password"
                  value={credentials.confirmPassword}
                  onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
                  placeholder="再次输入新密码"
                  className="h-9 max-w-sm"
                />
              </div>

              <Button onClick={() => handleSave("credentials")} className="bg-indigo-600 hover:bg-indigo-700">
                <Save className="h-4 w-4 mr-1.5" />更新账户信息
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
