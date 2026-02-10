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
          <h1 className="text-xl font-bold text-gray-900">数据库管理</h1>
          <p className="text-sm text-gray-500">管理MongoDB数据库连接和数据</p>
        </div>
        <Button variant="outline" size="sm" onClick={checkStatus}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> 刷新
        </Button>
      </div>

      {/* 连接状态 */}
      <Card>
        <CardHeader><CardTitle className="text-sm">连接状态</CardTitle></CardHeader>
        <CardContent>
          {dbStatus ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {dbStatus.connected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className={dbStatus.connected ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {dbStatus.connected ? "已连接" : "未连接"}
                </span>
              </div>
              {dbStatus.connected && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500">类型</p>
                    <p className="font-bold">{dbStatus.type}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500">主机</p>
                    <p className="font-bold">{dbStatus.host}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500">数据库</p>
                    <p className="font-bold">{dbStatus.database}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500">认证</p>
                    <p className="font-bold">admin (Docker)</p>
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
          <Card>
            <CardContent className="p-4 text-center">
              <Database className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{dbStatus.users}</p>
              <p className="text-xs text-gray-500">用户总数</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Database className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{dbStatus.tests}</p>
              <p className="text-xs text-gray-500">测试结果</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Database className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{dbStatus.orders}</p>
              <p className="text-xs text-gray-500">订单数</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 连接配置 */}
      <Card>
        <CardHeader><CardTitle className="text-sm">连接配置</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-700">
            MONGODB_URI=mongodb://admin:admin123@localhost:27017/mbti_test?authSource=admin
          </div>
          <p className="text-gray-400 text-xs">配置文件: .env.local</p>
        </CardContent>
      </Card>
    </div>
  )
}
