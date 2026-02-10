"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { getDatabase, type User } from "@/lib/database"

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    phone: "",
    email: "",
    team: "",
  })

  useEffect(() => {
    loadUser()
  }, [params.id])

  const loadUser = async () => {
    try {
      setLoading(true)
      const db = getDatabase()
      const userData = db.getUserById(params.id)

      if (!userData) {
        alert("用户不存在")
        router.push("/admin/users")
        return
      }

      setUser(userData)
      setFormData({
        name: userData.name || "",
        nickname: userData.nickname || "",
        phone: userData.phone || "",
        email: userData.email || "",
        team: userData.team || "",
      })
    } catch (error) {
      console.error("Error loading user:", error)
      alert("加载用户信息失败")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("请输入姓名")
      return
    }

    try {
      setSaving(true)
      const db = getDatabase()
      const updatedUser = db.updateUser(params.id, {
        name: formData.name,
        nickname: formData.nickname,
        phone: formData.phone,
        email: formData.email,
        team: formData.team,
      })

      if (updatedUser) {
        alert("保存成功")
        router.push(`/admin/users/${params.id}`)
      } else {
        alert("保存失败")
      }
    } catch (error) {
      console.error("Error saving user:", error)
      alert("保存失败")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push(`/admin/users/${params.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 页面头部 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleCancel} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">编辑用户</h1>
                <p className="text-sm text-gray-500 mt-1">修改用户基本信息</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                取消
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
                {saving ? "保存中..." : "保存"}
              </Button>
            </div>
          </div>

          {/* 基本信息表单 */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
              <div className="text-sm text-gray-500 mb-4">用户ID: {user.id}</div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入姓名"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">昵称</label>
                  <Input
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    placeholder="请输入昵称"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">手机号</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="请输入手机号"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="请输入邮箱"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">团队</label>
                  <Input
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    placeholder="请输入团队"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* 创建和更新时间 */}
            <div className="pt-6 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">创建时间：</span>
                  <span className="text-gray-900">
                    {new Date(user.createdAt).toLocaleString("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">更新时间：</span>
                  <span className="text-gray-900">
                    {new Date(user.updatedAt).toLocaleString("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
