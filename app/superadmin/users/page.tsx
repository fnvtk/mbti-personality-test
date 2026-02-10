"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search, Users, Building2, Eye, Download, ChevronLeft, ChevronRight,
  Filter, UserCircle, BarChart3
} from "lucide-react"

// 用户数据接口
interface UserData {
  _id: string
  username: string
  phone?: string
  email?: string
  mbtiType?: string
  discType?: string
  pdpType?: string
  role: string
  status: string
  enterpriseId?: string
  enterpriseName?: string
  createdAt?: string
}

// 企业用户池
interface EnterprisePool {
  id: string
  name: string
  userCount: number
  activeCount: number
  testedCount: number
}

// 模拟企业用户池数据
const mockEnterprisePools: EnterprisePool[] = [
  { id: "all", name: "全部用户", userCount: 1586, activeCount: 890, testedCount: 720 },
  { id: "personal", name: "个人用户（无企业）", userCount: 860, activeCount: 450, testedCount: 320 },
  { id: "ent-001", name: "科技创新有限公司", userCount: 86, activeCount: 62, testedCount: 54 },
  { id: "ent-002", name: "未来教育集团", userCount: 234, activeCount: 180, testedCount: 168 },
  { id: "ent-003", name: "健康医疗科技", userCount: 120, activeCount: 88, testedCount: 72 },
  { id: "ent-004", name: "智能制造集团", userCount: 156, activeCount: 68, testedCount: 56 },
  { id: "ent-005", name: "数字营销公司", userCount: 130, activeCount: 42, testedCount: 50 },
]

// 模拟用户数据
const generateMockUsers = (pool: string): UserData[] => {
  const baseUsers: UserData[] = [
    { _id: "u001", username: "张三", phone: "138****1001", email: "zhang@test.com", mbtiType: "INTJ", discType: "D", pdpType: "老虎", role: "user", status: "active", enterpriseId: "ent-001", enterpriseName: "科技创新有限公司", createdAt: "2026-01-15" },
    { _id: "u002", username: "李四", phone: "139****2002", email: "li@test.com", mbtiType: "ENFP", pdpType: "孔雀", role: "user", status: "active", enterpriseId: "ent-002", enterpriseName: "未来教育集团", createdAt: "2026-01-20" },
    { _id: "u003", username: "王五", phone: "137****3003", mbtiType: "ISTJ", discType: "S", role: "user", status: "active", enterpriseId: "ent-001", enterpriseName: "科技创新有限公司", createdAt: "2026-01-22" },
    { _id: "u004", username: "赵六", phone: "136****4004", email: "zhao@test.com", mbtiType: "ENTP", pdpType: "猫头鹰", role: "user", status: "active", enterpriseId: "ent-003", enterpriseName: "健康医疗科技", createdAt: "2026-02-01" },
    { _id: "u005", username: "钱七", phone: "135****5005", discType: "I", role: "user", status: "inactive", createdAt: "2025-12-10" },
    { _id: "u006", username: "孙八", phone: "134****6006", email: "sun@test.com", mbtiType: "INFJ", pdpType: "无尾熊", role: "user", status: "active", enterpriseId: "ent-002", enterpriseName: "未来教育集团", createdAt: "2026-02-03" },
    { _id: "u007", username: "周九", phone: "133****7007", mbtiType: "ESTJ", discType: "C", pdpType: "老虎", role: "enterprise_admin", status: "active", enterpriseId: "ent-001", enterpriseName: "科技创新有限公司", createdAt: "2025-11-20" },
    { _id: "u008", username: "吴十", phone: "132****8008", mbtiType: "ISFP", role: "user", status: "active", createdAt: "2026-02-05" },
    { _id: "u009", username: "郑一", phone: "131****9009", email: "zheng@test.com", pdpType: "变色龙", role: "user", status: "active", enterpriseId: "ent-004", enterpriseName: "智能制造集团", createdAt: "2026-02-07" },
    { _id: "u010", username: "陈二", phone: "130****0010", mbtiType: "ESFJ", discType: "S", role: "user", status: "active", enterpriseId: "ent-005", enterpriseName: "数字营销公司", createdAt: "2026-02-08" },
  ]

  if (pool === "all") return baseUsers
  if (pool === "personal") return baseUsers.filter((u) => !u.enterpriseId)
  return baseUsers.filter((u) => u.enterpriseId === pool)
}

export default function SuperAdminUsersPage() {
  const router = useRouter()
  const [selectedPool, setSelectedPool] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(false)

  // MBTI类型统计
  const mbtiStats = users.reduce((acc, u) => {
    if (u.mbtiType) {
      acc[u.mbtiType] = (acc[u.mbtiType] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  // 加载用户数据
  useEffect(() => {
    setLoading(true)
    // 模拟 API 延迟
    setTimeout(() => {
      setUsers(generateMockUsers(selectedPool))
      setLoading(false)
    }, 300)
  }, [selectedPool])

  // 搜索过滤
  const filteredUsers = users.filter((u) => {
    if (!searchTerm) return true
    return u.username.includes(searchTerm) ||
      u.phone?.includes(searchTerm) ||
      u.email?.includes(searchTerm) ||
      u.mbtiType?.includes(searchTerm.toUpperCase())
  })

  // 测试结果标签
  const getTestBadges = (user: UserData) => {
    const badges = []
    if (user.mbtiType) badges.push(<Badge key="mbti" variant="secondary" className="text-[10px] bg-purple-50 text-purple-700 border-0">{user.mbtiType}</Badge>)
    if (user.pdpType) badges.push(<Badge key="pdp" variant="secondary" className="text-[10px] bg-blue-50 text-blue-700 border-0">{user.pdpType}</Badge>)
    if (user.discType) badges.push(<Badge key="disc" variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-700 border-0">{user.discType}</Badge>)
    return badges.length > 0 ? <div className="flex flex-wrap gap-1">{badges}</div> : <span className="text-xs text-gray-400">暂无测试</span>
  }

  // 当前选中的池子信息
  const currentPool = mockEnterprisePools.find((p) => p.id === selectedPool)

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">用户数据</h1>
          <p className="text-sm text-gray-500 mt-1">按企业用户池分类查看和管理用户数据</p>
        </div>
        <Button variant="outline" size="sm" className="text-xs">
          <Download className="h-3.5 w-3.5 mr-1.5" />
          导出数据
        </Button>
      </div>

      {/* 企业用户池选择器 */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {mockEnterprisePools.map((pool) => (
          <Card
            key={pool.id}
            className={`border cursor-pointer transition-all min-w-[180px] flex-shrink-0 ${
              selectedPool === pool.id
                ? "border-indigo-300 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-200"
                : "border-gray-200 hover:border-gray-300 shadow-sm"
            }`}
            onClick={() => setSelectedPool(pool.id)}
          >
            <CardContent className="p-3.5">
              <div className="flex items-center gap-2 mb-2">
                {pool.id === "all" ? (
                  <Users className="h-4 w-4 text-gray-500" />
                ) : pool.id === "personal" ? (
                  <UserCircle className="h-4 w-4 text-gray-500" />
                ) : (
                  <Building2 className="h-4 w-4 text-indigo-500" />
                )}
                <span className={`text-xs font-medium truncate ${selectedPool === pool.id ? "text-indigo-700" : "text-gray-700"}`}>
                  {pool.name}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-gray-900">{pool.userCount}</span>
                <span className="text-xs text-gray-400">人</span>
              </div>
              <div className="flex gap-3 mt-1">
                <span className="text-[10px] text-emerald-600">{pool.activeCount}活跃</span>
                <span className="text-[10px] text-purple-600">{pool.testedCount}已测试</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 当前池子统计 + MBTI分布 */}
      {currentPool && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500">池内用户总数</p>
              <p className="text-xl font-bold mt-1">{currentPool.userCount}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500">活跃用户</p>
              <p className="text-xl font-bold mt-1">{currentPool.activeCount}
                <span className="text-sm font-normal text-gray-400 ml-1">
                  ({((currentPool.activeCount / currentPool.userCount) * 100).toFixed(0)}%)
                </span>
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500">已完成测试</p>
              <p className="text-xl font-bold mt-1">{currentPool.testedCount}
                <span className="text-sm font-normal text-gray-400 ml-1">
                  ({((currentPool.testedCount / currentPool.userCount) * 100).toFixed(0)}%)
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MBTI 类型分布（当有数据时） */}
      {Object.keys(mbtiStats).length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              MBTI 类型分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(mbtiStats).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                <div key={type} className="bg-purple-50 rounded-lg px-3 py-1.5 text-center">
                  <span className="text-sm font-bold text-purple-700">{type}</span>
                  <span className="text-xs text-purple-500 ml-1.5">{count}人</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 搜索栏 */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索用户名、手机号、邮箱、MBTI类型..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* 用户列表 */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">用户信息</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">联系方式</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">测试结果</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">所属企业</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">状态</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">注册时间</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
                    <p className="text-sm text-gray-400 mt-2">加载中...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                    {searchTerm ? "没有匹配的用户" : "该用户池暂无用户数据"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm flex-shrink-0">
                          {user.username[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.username}</p>
                          <p className="text-[10px] text-gray-400">
                            {user.role === "enterprise_admin" ? "企业管理员" : "普通用户"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-gray-900">{user.phone || "-"}</p>
                      <p className="text-xs text-gray-400">{user.email || "-"}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      {getTestBadges(user)}
                    </td>
                    <td className="px-5 py-3.5">
                      {user.enterpriseName ? (
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                          <span className="text-xs text-gray-700">{user.enterpriseName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">个人用户</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        variant={user.status === "active" ? "default" : "outline"}
                        className={`text-[10px] ${user.status === "active" ? "bg-emerald-100 text-emerald-700 border-0" : ""}`}
                      >
                        {user.status === "active" ? "正常" : "未激活"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-gray-500">{user.createdAt || "-"}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => router.push(`/admin/users/${user._id}`)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />查看
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 底部统计 */}
        <div className="px-5 py-3 bg-gray-50/80 border-t flex items-center justify-between">
          <p className="text-xs text-gray-500">
            显示 {filteredUsers.length} 条 · {selectedPool === "all" ? "全部用户" : currentPool?.name}
          </p>
        </div>
      </Card>
    </div>
  )
}
