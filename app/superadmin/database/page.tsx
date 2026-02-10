"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, RefreshCw, CheckCircle, XCircle } from "lucide-react"

export default function SuperAdminDatabasePage() {
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { checkStatus() }, [])

  async function checkStatus() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      if (data.code === 200) {
        setDbStatus({
          connected: true,
          type: 'MongoDB',
          host: 'localhost:27017',
          database: 'mbti_test',
          users: data.data.users.total,
          tests: data.data.tests.total,
          orders: data.data.orders.total
        })
      }
    } catch (error) {
      setDbStatus({ connected: false, error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">数据库管理</h1>
          <p className="text-sm text-gray-400">管理MongoDB数据库连接和数据</p>
        </div>
        <Button variant="outline" size="sm" onClick={checkStatus} className="border-gray-600 text-gray-300">
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> 刷新
        </Button>
      </div>

      {/* 连接状态 */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader><CardTitle className="text-sm text-gray-200">连接状态</CardTitle></CardHeader>
        <CardContent>
          {dbStatus ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {dbStatus.connected ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
                <span className={dbStatus.connected ? "text-green-400" : "text-red-400"}>
                  {dbStatus.connected ? "已连接" : "未连接"}
                </span>
              </div>
              {dbStatus.connected && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-gray-400">类型</p>
                    <p className="font-bold text-white">{dbStatus.type}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-gray-400">主机</p>
                    <p className="font-bold text-white">{dbStatus.host}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-gray-400">数据库</p>
                    <p className="font-bold text-white">{dbStatus.database}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-gray-400">认证</p>
                    <p className="font-bold text-white">admin (Docker)</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400">检查中...</p>
          )}
        </CardContent>
      </Card>

      {/* 数据统计 */}
      {dbStatus?.connected && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <Database className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{dbStatus.users}</p>
              <p className="text-xs text-gray-400">用户总数</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <Database className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{dbStatus.tests}</p>
              <p className="text-xs text-gray-400">测试结果</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <Database className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{dbStatus.orders}</p>
              <p className="text-xs text-gray-400">订单数</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 连接配置 */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader><CardTitle className="text-sm text-gray-200">连接配置</CardTitle></CardHeader>
        <CardContent className="text-sm text-gray-300 space-y-2 font-mono">
          <p>MONGODB_URI=mongodb://admin:admin123@localhost:27017/mbti_test?authSource=admin</p>
          <p className="text-gray-500 text-xs">配置文件: .env.local</p>
        </CardContent>
      </Card>
    </div>
  )
}
