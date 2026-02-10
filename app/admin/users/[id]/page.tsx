"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"

// 用户详情页 - 通过API读取MongoDB数据
export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const [user, setUser] = useState<any>(null)
  const [testHistory, setTestHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [userId])

  async function fetchUser() {
    try {
      const res = await fetch(`/api/admin/users/${userId}`)
      const data = await res.json()
      if (data.code === 200) {
        setUser(data.data.user)
        setTestHistory(data.data.testHistory || [])
      }
    } catch (error) {
      console.error('获取用户详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('确定要删除这个用户吗？')) return
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.code === 200) {
        alert('删除成功')
        router.push('/admin/users')
      }
    } catch (error) {
      alert('删除失败')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
    </div>
  )

  if (!user) return (
    <div className="text-center py-12">
      <p className="text-gray-500">用户不存在</p>
      <Button variant="link" onClick={() => router.push('/admin/users')}>返回用户列表</Button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 顶部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin/users')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{user.username || '未命名'}</h1>
            <p className="text-sm text-gray-500">{user.role === 'superadmin' ? '超级管理员' : user.role === 'admin' ? '管理员' : '普通用户'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/admin/users/${userId}/edit`)}>
            <Edit className="h-4 w-4 mr-1" /> 编辑
          </Button>
          <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" /> 删除
          </Button>
        </div>
      </div>

      {/* 基本信息 */}
      <Card>
        <CardHeader><CardTitle className="text-sm">基本信息</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">姓名</p>
              <p className="font-medium">{user.username || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">性别</p>
              <p className="font-medium">{user.gender || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">手机号</p>
              <p className="font-medium">{user.phone || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">邮箱</p>
              <p className="font-medium">{user.email || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">地区</p>
              <p className="font-medium">{user.region || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">行业</p>
              <p className="font-medium">{user.industry || '-'}</p>
            </div>
            {user.bio && (
              <div className="col-span-2">
                <p className="text-gray-500">简介</p>
                <p className="font-medium">{user.bio}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 测试结果 */}
      <Card>
        <CardHeader><CardTitle className="text-sm">性格测试结果</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">MBTI</p>
              <p className="text-2xl font-bold text-purple-600">{user.mbtiType || '-'}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">PDP</p>
              <p className="text-lg font-bold text-blue-600">{user.pdpType || '-'}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">DISC</p>
              <p className="text-lg font-bold text-green-600">{user.discType || '-'}</p>
            </div>
          </div>
          {user.gallupTop3 && user.gallupTop3.length > 0 && (
            <div className="mt-4 bg-amber-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">盖洛普Top3优势</p>
              <div className="flex gap-2">
                {user.gallupTop3.map((g: string, i: number) => (
                  <span key={i} className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">{g}</span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 测试历史 */}
      <Card>
        <CardHeader><CardTitle className="text-sm">测试历史 ({testHistory.length}条)</CardTitle></CardHeader>
        <CardContent>
          {testHistory.length === 0 ? (
            <p className="text-gray-400 text-center py-6">暂无测试记录</p>
          ) : (
            <div className="space-y-2">
              {testHistory.map((test: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{test.mbtiType || test.testType || 'MBTI测试'}</p>
                    <p className="text-xs text-gray-500">
                      置信度: {test.confidence || 0}% · 用时: {Math.round((test.testDuration || 0) / 60)}分钟
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {test.createdAt ? new Date(test.createdAt).toLocaleString('zh-CN') : '-'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
