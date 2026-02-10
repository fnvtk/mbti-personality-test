"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, Download, Eye, Edit, Trash2, X, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

// MongoDB用户数据接口
interface MongoUser {
  _id: string
  username: string
  email?: string
  phone?: string
  avatar?: string
  mbtiType?: string
  discType?: string
  pdpType?: string
  role: string
  status: string
  isEnterprise?: boolean
  region?: string
  industry?: string
  gender?: string
  salary?: string
  bio?: string
  gallupTop3?: string[]
  testHistory?: string[]
  createdAt?: string
  updatedAt?: string
  lastLoginAt?: string
}

interface UsersResponse {
  code: number
  data: {
    users: MongoUser[]
    total: number
    page: number
    limit: number
    pages: number
  }
  message?: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<MongoUser[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const pageSize = 20

  const [newUser, setNewUser] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    role: "user",
  })

  // 从API加载用户数据（读MongoDB）
  const loadUsers = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
      })
      if (search) params.set("search", search)
      if (roleFilter) params.set("role", roleFilter)
      if (statusFilter) params.set("status", statusFilter)

      const res = await fetch(`/api/admin/users?${params.toString()}`)
      const json: UsersResponse = await res.json()

      if (json.code === 200 && json.data) {
        setUsers(json.data.users)
        setTotal(json.data.total)
        setCurrentPage(json.data.page)
        setTotalPages(json.data.pages)
      } else {
        console.error("加载用户失败:", json.message)
        setUsers([])
      }
    } catch (error) {
      console.error("加载用户列表失败:", error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [roleFilter, statusFilter])

  useEffect(() => {
    loadUsers(1, searchTerm)
  }, [roleFilter, statusFilter])

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers(1, searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // 导出CSV
  const exportData = () => {
    const csvContent = [
      ["用户ID", "姓名", "手机号", "邮箱", "MBTI", "PDP", "DISC", "性别", "地区", "行业", "角色", "状态", "创建时间"],
      ...users.map((user) => [
        user._id,
        user.username || "",
        user.phone || "",
        user.email || "",
        user.mbtiType || "",
        user.pdpType || "",
        user.discType || "",
        user.gender || "",
        user.region || "",
        user.industry || "",
        user.role || "",
        user.status || "",
        user.createdAt ? new Date(user.createdAt).toLocaleString("zh-CN") : "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `用户数据_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 创建用户（调用API写入MongoDB）
  const handleCreateUser = async () => {
    if (!newUser.username.trim()) {
      alert("请输入用户名")
      return
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUser.username,
          phone: newUser.phone || undefined,
          email: newUser.email || undefined,
          password: newUser.password || "123456",
          role: newUser.role,
          status: "active",
        }),
      })

      const json = await res.json()
      if (json.code === 200) {
        setShowCreateDialog(false)
        setNewUser({ username: "", phone: "", email: "", password: "", role: "user" })
        await loadUsers(currentPage, searchTerm)
        alert("用户创建成功")
      } else {
        alert("创建用户失败: " + (json.message || "未知错误"))
      }
    } catch (error) {
      console.error("创建用户失败:", error)
      alert("创建用户失败")
    }
  }

  // 删除用户（调用API从MongoDB删除）
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("确定要删除这个用户吗？此操作无法撤销。")) {
      return
    }

    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
      })

      const json = await res.json()
      if (json.code === 200) {
        await loadUsers(currentPage, searchTerm)
        alert("用户删除成功")
      } else {
        alert("删除用户失败: " + (json.message || "未知错误"))
      }
    } catch (error) {
      console.error("删除用户失败:", error)
      alert("删除用户失败")
    }
  }

  // 显示测试结果标签
  const getTestResultBadges = (user: MongoUser) => {
    const results = []

    if (user.mbtiType) {
      results.push(
        <span key="mbti" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
          MBTI: {user.mbtiType}
        </span>
      )
    }
    if (user.pdpType) {
      results.push(
        <span key="pdp" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
          PDP: {user.pdpType}
        </span>
      )
    }
    if (user.discType) {
      results.push(
        <span key="disc" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
          DISC: {user.discType}
        </span>
      )
    }

    return results.length > 0 ? (
      <div className="flex flex-wrap gap-1">{results}</div>
    ) : (
      <span className="text-gray-400 text-sm">暂无测试</span>
    )
  }

  // 状态标签颜色
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      banned: "bg-red-100 text-red-800",
    }
    const labels: Record<string, string> = {
      active: "正常",
      inactive: "未激活",
      banned: "已封禁",
    }
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}>
        {labels[status] || status}
      </span>
    )
  }

  // 角色标签
  const getRoleBadge = (role: string) => {
    const labels: Record<string, string> = {
      user: "普通用户",
      admin: "管理员",
      enterprise_admin: "企业管理员",
      superadmin: "超级管理员",
    }
    return labels[role] || role
  }

  if (loading && users.length === 0) {
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面头部 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">用户数据管理</h1>
              <p className="text-sm text-gray-500 mt-1">
                共 <span className="font-medium text-purple-600">{total}</span> 个用户 · 查看和管理所有用户的测试数据
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setShowCreateDialog(true)} className="bg-purple-600 hover:bg-purple-700">
                <UserPlus className="h-4 w-4 mr-2" />
                新建用户
              </Button>
              <Button
                onClick={exportData}
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                导出数据
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索用户名、邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              className={`border-gray-300 bg-transparent ${showFilterPanel ? "bg-purple-50 border-purple-300" : ""}`}
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </Button>
          </div>

          {/* 筛选面板 */}
          {showFilterPanel && (
            <div className="flex gap-4 mt-4 pt-4 border-t">
              <div>
                <label className="block text-xs text-gray-500 mb-1">角色</label>
                <select
                  className="border rounded px-3 py-1.5 text-sm"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="">全部角色</option>
                  <option value="user">普通用户</option>
                  <option value="admin">管理员</option>
                  <option value="superadmin">超级管理员</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">状态</label>
                <select
                  className="border rounded px-3 py-1.5 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">全部状态</option>
                  <option value="active">正常</option>
                  <option value="inactive">未激活</option>
                  <option value="banned">已封禁</option>
                </select>
              </div>
              {(roleFilter || statusFilter) && (
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setRoleFilter(""); setStatusFilter("") }}
                    className="text-gray-500"
                  >
                    清除筛选
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 用户列表表格 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用户信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    联系方式
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    测试结果
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    地区/行业
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      {searchTerm ? "没有找到匹配的用户" : "暂无用户数据"}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium text-sm">
                            {(user.username || "?")[0]}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.username || "未设置"}</div>
                            <div className="text-xs text-gray-400">
                              {getRoleBadge(user.role)} {user.gender ? `· ${user.gender}` : ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">{user.phone || "未设置"}</div>
                          <div className="text-gray-500 text-xs">{user.email || "未设置"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getTestResultBadges(user)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">{user.region || "-"}</div>
                          <div className="text-gray-500 text-xs truncate max-w-[150px]">{user.industry || "-"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleString("zh-CN", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "未知"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/users/${user._id}`)}
                            className="text-gray-600 hover:text-gray-900 h-8 w-8 p-0"
                            title="查看详情"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/users/${user._id}/edit`)}
                            className="text-gray-600 hover:text-gray-900 h-8 w-8 p-0"
                            title="编辑"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-900 h-8 w-8 p-0"
                            title="删除"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
              <div className="text-sm text-gray-500">
                第 {currentPage} / {totalPages} 页，共 {total} 条
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => loadUsers(currentPage - 1, searchTerm)}
                  className="bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                  上一页
                </Button>
                {/* 页码按钮 */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => loadUsers(pageNum, searchTerm)}
                      className={pageNum === currentPage ? "bg-purple-600 hover:bg-purple-700" : "bg-transparent"}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => loadUsers(currentPage + 1, searchTerm)}
                  className="bg-transparent"
                >
                  下一页
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 创建用户对话框 */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">创建新用户</h2>
                <p className="text-sm text-gray-500 mt-1">添加新用户到数据库</p>
              </div>
              <button
                onClick={() => setShowCreateDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  用户名 <span className="text-red-500">*</span>
                </label>
                <Input
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="请输入用户名"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                <Input
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="请输入手机号"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <Input
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="请输入邮箱"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="默认 123456"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="user">普通用户</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                取消
              </Button>
              <Button onClick={handleCreateUser} className="bg-purple-600 hover:bg-purple-700">
                创建
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
