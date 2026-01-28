"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Eye, Users, Camera, FileText, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface User {
  id: string
  name: string
  phone: string
  mbti: string
  testCount: number
  lastActive: string
  status: "completed" | "in_progress" | "not_started"
}

// 模拟用户数据
const mockUsers: User[] = [
  { id: "1", name: "张三", phone: "138****1234", mbti: "INTJ", testCount: 3, lastActive: "2026-01-28", status: "completed" },
  { id: "2", name: "李四", phone: "139****5678", mbti: "ENFP", testCount: 2, lastActive: "2026-01-27", status: "completed" },
  { id: "3", name: "王五", phone: "136****9012", mbti: "-", testCount: 1, lastActive: "2026-01-26", status: "in_progress" },
  { id: "4", name: "赵六", phone: "137****3456", mbti: "-", testCount: 0, lastActive: "2026-01-25", status: "not_started" },
  { id: "5", name: "钱七", phone: "135****7890", mbti: "ISTJ", testCount: 4, lastActive: "2026-01-28", status: "completed" },
  { id: "6", name: "孙八", phone: "158****1111", mbti: "ESFP", testCount: 2, lastActive: "2026-01-27", status: "completed" },
  { id: "7", name: "周九", phone: "159****2222", mbti: "-", testCount: 1, lastActive: "2026-01-26", status: "in_progress" },
  { id: "8", name: "吴十", phone: "188****3333", mbti: "INFJ", testCount: 3, lastActive: "2026-01-25", status: "completed" },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [loading, setLoading] = useState(false)

  // 统计数据
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === "completed").length,
    totalTests: users.reduce((sum, u) => sum + u.testCount, 0),
    inProgress: users.filter(u => u.status === "in_progress").length,
  }

  // 筛选用户
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.includes(searchTerm) || user.phone.includes(searchTerm)
    const matchesFilter = selectedFilter === "all" ||
      (selectedFilter === "completed" && user.status === "completed") ||
      (selectedFilter === "in_progress" && user.status === "in_progress") ||
      (selectedFilter === "not_started" && user.status === "not_started")
    return matchesSearch && matchesFilter
  })

  // 导出数据
  const exportUsers = () => {
    const csvContent = [
      ["姓名", "电话", "MBTI类型", "测试次数", "最后活跃", "状态"],
      ...filteredUsers.map(user => [
        user.name,
        user.phone,
        user.mbti,
        user.testCount.toString(),
        user.lastActive,
        user.status === "completed" ? "已完成" : user.status === "in_progress" ? "进行中" : "未开始"
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `用户数据_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  // 刷新数据
  const refreshData = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
          <p className="text-gray-500 mt-1">查看和管理所有用户数据</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            刷新
          </Button>
          <Button onClick={exportUsers}>
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成测试</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">测试总数</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">进行中</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和过滤 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索用户姓名或电话..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          {[
            { key: "all", label: "全部" },
            { key: "completed", label: "已完成" },
            { key: "in_progress", label: "进行中" },
            { key: "not_started", label: "未开始" },
          ].map((filter) => (
            <Button
              key={filter.key}
              variant={selectedFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.key)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 用户表格 */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户信息</TableHead>
                <TableHead>联系方式</TableHead>
                <TableHead>MBTI类型</TableHead>
                <TableHead>测试次数</TableHead>
                <TableHead>最后活跃</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    没有找到匹配的用户
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "font-medium",
                        user.mbti !== "-" ? "text-purple-600" : "text-gray-400"
                      )}>
                        {user.mbti}
                      </span>
                    </TableCell>
                    <TableCell>{user.testCount}</TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        user.status === "completed" && "bg-green-100 text-green-700",
                        user.status === "in_progress" && "bg-amber-100 text-amber-700",
                        user.status === "not_started" && "bg-gray-100 text-gray-500"
                      )}>
                        {user.status === "completed" ? "已完成" :
                         user.status === "in_progress" ? "进行中" : "未开始"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
