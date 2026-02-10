"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, Download, Eye, Edit, Trash2, X, Filter } from "lucide-react"
import { getDatabase, type User as DatabaseUser } from "@/lib/database"
import { useRouter } from "next/navigation"

interface User extends DatabaseUser {
  createdAt?: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    nickname: "",
    phone: "",
    email: "",
    team: "",
  })

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const db = getDatabase()
      const allUsers = db.getUsers()

      const usersWithFormattedDate = allUsers.map((user) => ({
        ...user,
        createdAt: new Date(user.createdAt).toISOString(),
      }))

      setUsers(usersWithFormattedDate)
    } catch (error) {
      console.error("Error loading users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.includes(searchTerm) ||
          user.id?.includes(searchTerm),
      )
    }

    setFilteredUsers(filtered)
  }

  const exportData = () => {
    const csvContent = [
      ["用户ID", "姓名", "手机号", "邮箱", "MBTI", "PDP", "DISC", "照片数", "创建时间"],
      ...filteredUsers.map((user) => {
        const mbti = user.testResults?.find((t) => t.testType === "mbti")
        const pdp = user.testResults?.find((t) => t.testType === "pdp")
        const disc = user.testResults?.find((t) => t.testType === "disc")

        return [
          user.id,
          user.name || "",
          user.phone || "",
          user.email || "",
          mbti ? JSON.stringify(mbti.result) : "",
          pdp ? JSON.stringify(pdp.result) : "",
          disc ? JSON.stringify(disc.result) : "",
          (user.photos?.length || 0).toString(),
          user.createdAt || "",
        ]
      }),
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

  const handleCreateUser = async () => {
    if (!newUser.name.trim()) {
      alert("请输入姓名")
      return
    }

    try {
      const db = getDatabase()
      const now = Date.now()
      const userId = `${now}${Math.floor(Math.random() * 10000)}`

      const user = db.createUser({
        id: userId,
        name: newUser.name,
        nickname: newUser.nickname,
        phone: newUser.phone,
        email: newUser.email,
        team: newUser.team,
      })

      console.log("[v0] 用户创建成功:", user)

      setShowCreateDialog(false)
      setNewUser({ name: "", nickname: "", phone: "", email: "", team: "" })
      await loadUsers()
      alert("用户创建成功")
    } catch (error) {
      console.error("Error creating user:", error)
      alert("创建用户失败")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("确定要删除这个用户吗？此操作无法撤销。")) {
      return
    }

    try {
      const db = getDatabase()
      const success = db.deleteUser(userId)

      if (success) {
        await loadUsers()
        alert("用户删除成功")
      } else {
        alert("删除用户失败")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("删除用户失败")
    }
  }

  const getTestResultBadges = (user: User) => {
    const results = []
    const mbti = user.testResults?.find((t) => t.testType === "mbti")
    const pdp = user.testResults?.find((t) => t.testType === "pdp")
    const disc = user.testResults?.find((t) => t.testType === "disc")

    if (mbti) {
      results.push(
        <div key="mbti" className="text-sm text-gray-900">
          MBTI: {mbti.result?.type || "ENTJ"}
        </div>,
      )
    }
    if (pdp) {
      results.push(
        <div key="pdp" className="text-sm text-gray-900">
          PDP: {pdp.result?.primary || "老虎"} + {pdp.result?.secondary || "孔雀"}
        </div>,
      )
    }
    if (disc) {
      results.push(
        <div key="disc" className="text-sm text-gray-900">
          DISC: {disc.result?.primary || "D型"}(支配型) + {disc.result?.secondary || "I型"}(影响型)
        </div>,
      )
    }

    return results.length > 0 ? results : <span className="text-gray-400 text-sm">暂无测试</span>
  }

  const getPhotoStatus = (user: User) => {
    const photoCount = user.photos?.length || 0
    if (photoCount === 0) {
      return <span className="text-gray-400 text-sm">暂无照片</span>
    }
    return <span className="text-sm">已完成</span>
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面头部 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">用户数据管理</h1>
              <p className="text-sm text-gray-500 mt-1">查看和管理所有用户的测试数据</p>
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
                placeholder="搜索用户、团队或标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="border-gray-300 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </Button>
          </div>
        </div>

        {/* 用户列表表格 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">照片</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? "没有找到匹配的用户" : "暂无用户数据"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.name || "未设置"}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900">{user.phone || "未设置"}</div>
                        <div className="text-gray-500">{user.email || "未设置"}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {getTestResultBadges(user)}
                        {user.testResults && user.testResults.length > 0 && (
                          <div className="text-xs text-gray-500">共 {user.testResults.length} 项测试</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{getPhotoStatus(user)}</div>
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
                              second: "2-digit",
                            })
                          : "未知"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/users/${user.id}`)}
                          className="text-gray-600 hover:text-gray-900"
                          title="查看详情"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                          className="text-gray-600 hover:text-gray-900"
                          title="编辑"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
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
      </div>

      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">创建新用户</h2>
                <p className="text-sm text-gray-500 mt-1">添加新用户基本信息</p>
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
                  姓名 <span className="text-red-500">*</span>
                </label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="请输入姓名"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
                <Input
                  value={newUser.nickname}
                  onChange={(e) => setNewUser({ ...newUser, nickname: e.target.value })}
                  placeholder="请输入昵称"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">团队</label>
                <Input
                  value={newUser.team}
                  onChange={(e) => setNewUser({ ...newUser, team: e.target.value })}
                  placeholder="请输入团队"
                  className="w-full"
                />
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
