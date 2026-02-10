"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"

// 用户编辑页 - 通过API读写MongoDB
export default function UserEditPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    username: '', phone: '', email: '', gender: '',
    region: '', industry: '', bio: '',
    mbtiType: '', pdpType: '', discType: '',
    role: 'user', status: 'active'
  })

  useEffect(() => { fetchUser() }, [userId])

  async function fetchUser() {
    try {
      const res = await fetch(`/api/admin/users/${userId}`)
      const data = await res.json()
      if (data.code === 200 && data.data.user) {
        const u = data.data.user
        setForm({
          username: u.username || '',
          phone: u.phone || '',
          email: u.email || '',
          gender: u.gender || '',
          region: u.region || '',
          industry: u.industry || '',
          bio: u.bio || '',
          mbtiType: u.mbtiType || '',
          pdpType: u.pdpType || '',
          discType: u.discType || '',
          role: u.role || 'user',
          status: u.status || 'active'
        })
      }
    } catch (error) {
      console.error('加载用户失败:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.code === 200) {
        alert('保存成功')
        router.push(`/admin/users/${userId}`)
      } else {
        alert('保存失败: ' + (data.message || ''))
      }
    } catch (error) {
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
    </div>
  )

  const Field = ({ label, field, type = "text" }: { label: string, field: keyof typeof form, type?: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Input
        type={type}
        value={form[field]}
        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
      />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">编辑用户</h1>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">基本信息</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Field label="姓名" field="username" />
          <Field label="手机号" field="phone" />
          <Field label="邮箱" field="email" />
          <Field label="性别" field="gender" />
          <Field label="地区" field="region" />
          <Field label="行业" field="industry" />
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">简介</label>
            <textarea
              className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px]"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">测试结果</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <Field label="MBTI类型" field="mbtiType" />
          <Field label="PDP类型" field="pdpType" />
          <Field label="DISC类型" field="discType" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">权限设置</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
            <select className="w-full border rounded-md px-3 py-2 text-sm" value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="user">普通用户</option>
              <option value="admin">管理员</option>
              <option value="superadmin">超级管理员</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
            <select className="w-full border rounded-md px-3 py-2 text-sm" value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">正常</option>
              <option value="inactive">未激活</option>
              <option value="banned">已封禁</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>取消</Button>
        <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
          <Save className="h-4 w-4 mr-1" />
          {saving ? '保存中...' : '保存'}
        </Button>
      </div>
    </div>
  )
}
