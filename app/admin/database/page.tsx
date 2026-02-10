"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Settings, LogOut, Home, RefreshCw, Upload, Download, Database, Check, AlertCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface DatabaseStatus {
  isConnected: boolean
  config: {
    host: string
    port: number
    user: string
    database: string
  } | null
  logs?: string[]
  lastSyncTime?: number
}

export default function DatabaseSettingsPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 数据库连接状态
  const [dbStatus, setDbStatus] = useState<DatabaseStatus>({
    isConnected: false,
    config: null,
  })

  // 数据库连接表单
  const [dbHost, setDbHost] = useState<string>("")
  const [dbPort, setDbPort] = useState<string>("3306")
  const [dbUser, setDbUser] = useState<string>("")
  const [dbPassword, setDbPassword] = useState<string>("")
  const [dbName, setDbName] = useState<string>("")

  // 同步设置
  const [autoSync, setAutoSync] = useState<boolean>(false)
  const [syncInterval, setSyncInterval] = useState<string>("5")

  // 操作状态
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null)
  const [syncLogs, setSyncLogs] = useState<string[]>([])

  // 检查登录状态
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    if (!adminLoggedIn) {
      router.push("/admin/login")
    } else {
      setIsLoggedIn(true)
      loadDatabaseStatus()
    }
  }, [router])

  // 定期刷新数据库状态和日志
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(() => {
        loadDatabaseStatus()
      }, 10000) // 每10秒刷新一次

      return () => clearInterval(interval)
    }
  }, [isLoggedIn])

  // 加载数据库状态
  const loadDatabaseStatus = async () => {
    try {
      const response = await fetch("/api/database/status")
      const data = await response.json()

      if (data.success) {
        setDbStatus({
          isConnected: data.isConnected,
          config: data.config,
          logs: data.logs,
          lastSyncTime: data.lastSyncTime,
        })

        // 如果已连接，填充表单
        if (data.isConnected && data.config) {
          setDbHost(data.config.host)
          setDbPort(data.config.port.toString())
          setDbUser(data.config.user)
          setDbName(data.config.database)
        }

        // 更新日志
        if (data.logs && data.logs.length > 0) {
          setSyncLogs(data.logs)
        }
      } else {
        console.error("加载数据库状态失败:", data.message)
      }
    } catch (error) {
      console.error("加载数据库状态错误:", error)
    }
  }

  // 加载同步日志
  const loadSyncLogs = async () => {
    try {
      const response = await fetch("/api/database/logs")
      const data = await response.json()

      if (data.success && data.logs) {
        setSyncLogs(data.logs)
      }
    } catch (error) {
      console.error("加载同步日志错误:", error)
    }
  }

  // 连接数据库
  const connectDatabase = async () => {
    if (!dbHost || !dbUser || !dbPassword || !dbName) {
      setSyncResult({
        success: false,
        message: "请填写所有必要的数据库连接信息",
      })
      return
    }

    setIsConnecting(true)
    setSyncResult(null)

    try {
      const response = await fetch("/api/database/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host: dbHost,
          port: Number.parseInt(dbPort),
          user: dbUser,
          password: dbPassword,
          database: dbName,
        }),
      })

      const data = await response.json()

      setSyncResult({
        success: data.success,
        message: data.message,
      })

      if (data.success) {
        // 更新状态
        setDbStatus({
          isConnected: true,
          config: data.config,
          logs: dbStatus.logs,
          lastSyncTime: dbStatus.lastSyncTime,
        })

        // 刷新日志
        loadSyncLogs()
      }
    } catch (error) {
      setSyncResult({
        success: false,
        message: `连接数据库时出错: ${error.message}`,
      })
    } finally {
      setIsConnecting(false)
    }
  }

  // 同步数据到MySQL
  const syncToMySQL = async () => {
    if (!dbStatus.isConnected) {
      setSyncResult({
        success: false,
        message: "请先连接数据库",
      })
      return
    }

    setIsSyncing(true)
    setSyncResult(null)

    try {
      const response = await fetch("/api/database/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          direction: "to",
        }),
      })

      const data = await response.json()

      setSyncResult({
        success: data.success,
        message: data.message,
      })

      // 刷新日志
      loadSyncLogs()
    } catch (error) {
      setSyncResult({
        success: false,
        message: `同步数据时出错: ${error.message}`,
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // 从MySQL导入数据
  const importFromMySQL = async () => {
    if (!dbStatus.isConnected) {
      setSyncResult({
        success: false,
        message: "请先连接数据库",
      })
      return
    }

    setIsSyncing(true)
    setSyncResult(null)

    try {
      const response = await fetch("/api/database/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          direction: "from",
        }),
      })

      const data = await response.json()

      setSyncResult({
        success: data.success,
        message: data.message,
      })

      // 刷新日志
      loadSyncLogs()
    } catch (error) {
      setSyncResult({
        success: false,
        message: `导入数据时出错: ${error.message}`,
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // 设置自动同步
  const toggleAutoSync = async () => {
    if (!dbStatus.isConnected) {
      setSyncResult({
        success: false,
        message: "请先连接数据库",
      })
      return
    }

    const newAutoSync = !autoSync
    setAutoSync(newAutoSync)

    try {
      const response = await fetch("/api/database/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          autoSync: newAutoSync,
          interval: Number.parseInt(syncInterval),
        }),
      })

      const data = await response.json()

      setSyncResult({
        success: data.success,
        message: data.message,
      })

      // 刷新日志
      loadSyncLogs()
    } catch (error) {
      setSyncResult({
        success: false,
        message: `设置自动同步时出错: ${error.message}`,
      })
      setAutoSync(!newAutoSync) // 恢复状态
    }
  }

  // 格式化时间
  const formatTime = (timestamp: number) => {
    if (!timestamp) return "从未同步"
    return new Date(timestamp).toLocaleString()
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
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">神仙团队AI性格测试 - 管理后台</h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            退出登录
          </Button>
        </div>
      </header>

      {/* 侧边栏和主内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
        {/* 侧边导航 */}
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
                  onClick={() => router.push("/admin/database")}
                >
                  <Database className="h-4 w-4 mr-2" />
                  数据库设置
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin")}>
                  <Settings className="h-4 w-4 mr-2" />
                  API设置
                </Button>
              </nav>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">数据库状态</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>连接状态:</span>
                  <span className={`font-medium ${dbStatus.isConnected ? "text-green-500" : "text-gray-500"}`}>
                    {dbStatus.isConnected ? "已连接" : "未连接"}
                  </span>
                </div>
                {dbStatus.isConnected && dbStatus.config && (
                  <>
                    <div className="flex justify-between">
                      <span>数据库:</span>
                      <span className="font-medium">{dbStatus.config.database}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>主机:</span>
                      <span className="font-medium">
                        {dbStatus.config.host}:{dbStatus.config.port}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>用户:</span>
                      <span className="font-medium">{dbStatus.config.user}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>自动同步:</span>
                      <span className="font-medium">{autoSync ? "已启用" : "已禁用"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>上次同步:</span>
                      <span className="font-medium">{formatTime(dbStatus.lastSyncTime || 0)}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主内容 */}
        <div className="flex-1 space-y-6">
          {syncResult && (
            <Alert variant={syncResult.success ? "default" : "destructive"}>
              <AlertTitle>{syncResult.success ? "成功" : "错误"}</AlertTitle>
              <AlertDescription>{syncResult.message}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="connection">
            <TabsList className="mb-4">
              <TabsTrigger value="connection">数据库连接</TabsTrigger>
              <TabsTrigger value="sync">数据同步</TabsTrigger>
              <TabsTrigger value="logs">同步日志</TabsTrigger>
            </TabsList>

            <TabsContent value="connection">
              <Card>
                <CardHeader>
                  <CardTitle>MySQL数据库连接设置</CardTitle>
                  <CardDescription>配置MySQL数据库连接，用于数据同步和备份</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="db-host">数据库主机</Label>
                    <Input
                      id="db-host"
                      value={dbHost}
                      onChange={(e) => setDbHost(e.target.value)}
                      placeholder="例如: localhost 或 db.example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="db-port">端口</Label>
                    <Input
                      id="db-port"
                      value={dbPort}
                      onChange={(e) => setDbPort(e.target.value)}
                      placeholder="默认: 3306"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="db-user">用户名</Label>
                    <Input
                      id="db-user"
                      value={dbUser}
                      onChange={(e) => setDbUser(e.target.value)}
                      placeholder="数据库用户名"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="db-password">密码</Label>
                    <Input
                      id="db-password"
                      type="password"
                      value={dbPassword}
                      onChange={(e) => setDbPassword(e.target.value)}
                      placeholder="数据库密码"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="db-name">数据库名</Label>
                    <Input
                      id="db-name"
                      value={dbName}
                      onChange={(e) => setDbName(e.target.value)}
                      placeholder="数据库名称"
                    />
                  </div>

                  <Button onClick={connectDatabase} disabled={isConnecting} className="flex items-center">
                    {isConnecting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        连接中...
                      </>
                    ) : dbStatus.isConnected ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        已连接
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4 mr-2" />
                        连接数据库
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sync">
              <Card>
                <CardHeader>
                  <CardTitle>数据同步</CardTitle>
                  <CardDescription>将本地数据同步到MySQL数据库或从MySQL数据库导入数据</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!dbStatus.isConnected ? (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                        <p className="text-yellow-800">请先在"数据库连接"选项卡中配置并连接数据库</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">自动同步设置</h3>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="auto-sync">启用自动同步</Label>
                            <p className="text-sm text-gray-500">定期自动将本地数据同步到MySQL数据库</p>
                          </div>
                          <Switch id="auto-sync" checked={autoSync} onCheckedChange={toggleAutoSync} />
                        </div>

                        {autoSync && (
                          <div className="space-y-2">
                            <Label htmlFor="sync-interval">同步间隔（分钟）</Label>
                            <Select value={syncInterval} onValueChange={setSyncInterval}>
                              <SelectTrigger id="sync-interval">
                                <SelectValue placeholder="选择同步间隔" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1分钟</SelectItem>
                                <SelectItem value="5">5分钟</SelectItem>
                                <SelectItem value="15">15分钟</SelectItem>
                                <SelectItem value="30">30分钟</SelectItem>
                                <SelectItem value="60">1小时</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      <div className="border-t pt-6 space-y-4">
                        <h3 className="text-lg font-medium">手动同步</h3>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            将本地数据同步到MySQL数据库。此操作不会删除数据库中的现有数据。
                          </p>
                          <Button onClick={syncToMySQL} disabled={isSyncing} className="w-full">
                            {isSyncing ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                同步中...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                同步到MySQL
                              </>
                            )}
                          </Button>
                        </div>

                        <div className="space-y-2 mt-4">
                          <p className="text-sm text-gray-600">
                            从MySQL数据库导入数据。此操作会合并数据，不会删除本地数据。
                          </p>
                          <Button onClick={importFromMySQL} disabled={isSyncing} className="w-full">
                            {isSyncing ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                导入中...
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                从MySQL导入
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle>同步日志</CardTitle>
                  <CardDescription>查看数据库操作和同步的日志记录</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    readOnly
                    className="font-mono text-xs h-96"
                    placeholder="暂无同步日志"
                    value={syncLogs.join("\n")}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
