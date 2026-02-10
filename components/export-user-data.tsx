"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react"
import { getDatabase, type User } from "@/lib/database"

interface ExportUserDataProps {
  userId?: string // 如果提供，则只导出特定用户的数据
}

export function ExportUserData({ userId }: ExportUserDataProps) {
  const [exportOptions, setExportOptions] = useState({
    includeBasicInfo: true,
    includeTestResults: true,
    includePhotos: false,
    includeAnalysis: true,
  })
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "txt">("json")
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = () => {
    setIsExporting(true)

    try {
      const db = getDatabase()
      let userData: User | User[]

      if (userId) {
        // 导出特定用户数据
        const user = db.getUserById(userId)
        if (!user) {
          throw new Error(`找不到ID为 ${userId} 的用户`)
        }
        userData = user
      } else {
        // 导出所有用户数据
        userData = db.getUsers()
      }

      // 根据选项过滤数据
      const processedData = processDataForExport(userData, exportOptions)

      // 根据格式导出
      switch (exportFormat) {
        case "json":
          exportAsJson(processedData)
          break
        case "csv":
          exportAsCsv(processedData)
          break
        case "txt":
          exportAsTxt(processedData)
          break
      }
    } catch (error) {
      console.error("导出数据失败:", error)
      alert(`导出失败: ${error.message}`)
    } finally {
      setIsExporting(false)
    }
  }

  // 处理导出数据
  const processDataForExport = (data: User | User[], options: typeof exportOptions) => {
    const processUser = (user: User) => {
      const result: any = {}

      if (options.includeBasicInfo) {
        result.id = user.id
        result.name = user.name
        result.nickname = user.nickname
        result.phone = user.phone
        result.email = user.email
        result.team = user.team
        result.tags = user.tags
        result.createdAt = user.createdAt
        result.updatedAt = user.updatedAt
      }

      if (options.includeTestResults) {
        result.testResults = user.testResults
      }

      if (options.includePhotos) {
        result.photos = user.photos
      }

      if (options.includeAnalysis) {
        result.faceAnalysis = user.faceAnalysis
        result.suitablePositions = user.suitablePositions
      }

      return result
    }

    if (Array.isArray(data)) {
      return data.map(processUser)
    } else {
      return processUser(data)
    }
  }

  // 导出为JSON
  const exportAsJson = (data: any) => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const filename = userId
      ? `user_${userId}_${formatDate(new Date())}.json`
      : `all_users_${formatDate(new Date())}.json`

    downloadFile(url, filename)
  }

  // 导出为CSV
  const exportAsCsv = (data: any) => {
    let csvContent = ""

    if (Array.isArray(data)) {
      // 多用户导出
      if (data.length === 0) return

      // 获取表头
      const headers = Object.keys(data[0])
      csvContent += headers.join(",") + "\n"

      // 添加数据行
      data.forEach((user) => {
        const row = headers.map((header) => {
          const value = user[header]
          if (typeof value === "object") {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`
          }
          return `"${value}"`
        })
        csvContent += row.join(",") + "\n"
      })
    } else {
      // 单用户导出
      const headers = Object.keys(data)
      csvContent += headers.join(",") + "\n"

      const row = headers.map((header) => {
        const value = data[header]
        if (typeof value === "object") {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`
        }
        return `"${value}"`
      })
      csvContent += row.join(",") + "\n"
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const filename = userId ? `user_${userId}_${formatDate(new Date())}.csv` : `all_users_${formatDate(new Date())}.csv`

    downloadFile(url, filename)
  }

  // 导出为TXT
  const exportAsTxt = (data: any) => {
    let txtContent = ""

    if (Array.isArray(data)) {
      // 多用户导出
      data.forEach((user, index) => {
        txtContent += `用户 #${index + 1}\n`
        txtContent += "------------------------\n"

        Object.entries(user).forEach(([key, value]) => {
          if (typeof value === "object") {
            txtContent += `${key}: ${JSON.stringify(value, null, 2)}\n`
          } else {
            txtContent += `${key}: ${value}\n`
          }
        })

        txtContent += "\n\n"
      })
    } else {
      // 单用户导出
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === "object") {
          txtContent += `${key}: ${JSON.stringify(value, null, 2)}\n`
        } else {
          txtContent += `${key}: ${value}\n`
        }
      })
    }

    const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const filename = userId ? `user_${userId}_${formatDate(new Date())}.txt` : `all_users_${formatDate(new Date())}.txt`

    downloadFile(url, filename)
  }

  // 下载文件
  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 格式化日期为 YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>导出用户数据</CardTitle>
        <CardDescription>{userId ? "导出当前用户的详细数据" : "导出所有用户的数据"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>导出选项</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-basic-info"
                checked={exportOptions.includeBasicInfo}
                onCheckedChange={(checked) =>
                  setExportOptions({ ...exportOptions, includeBasicInfo: checked === true })
                }
              />
              <Label htmlFor="include-basic-info">基本信息</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-test-results"
                checked={exportOptions.includeTestResults}
                onCheckedChange={(checked) =>
                  setExportOptions({ ...exportOptions, includeTestResults: checked === true })
                }
              />
              <Label htmlFor="include-test-results">测试结果</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-photos"
                checked={exportOptions.includePhotos}
                onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includePhotos: checked === true })}
              />
              <Label htmlFor="include-photos">照片数据</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-analysis"
                checked={exportOptions.includeAnalysis}
                onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeAnalysis: checked === true })}
              />
              <Label htmlFor="include-analysis">分析结果</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>导出格式</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div
              className={`flex items-center p-3 border rounded-md cursor-pointer ${
                exportFormat === "json" ? "border-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => setExportFormat("json")}
            >
              <FileJson className="h-5 w-5 mr-2 text-blue-500" />
              <span>JSON格式</span>
            </div>
            <div
              className={`flex items-center p-3 border rounded-md cursor-pointer ${
                exportFormat === "csv" ? "border-green-500 bg-green-50" : ""
              }`}
              onClick={() => setExportFormat("csv")}
            >
              <FileSpreadsheet className="h-5 w-5 mr-2 text-green-500" />
              <span>CSV格式</span>
            </div>
            <div
              className={`flex items-center p-3 border rounded-md cursor-pointer ${
                exportFormat === "txt" ? "border-orange-500 bg-orange-50" : ""
              }`}
              onClick={() => setExportFormat("txt")}
            >
              <FileText className="h-5 w-5 mr-2 text-orange-500" />
              <span>文本格式</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleExport} disabled={isExporting} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "导出中..." : "导出数据"}
        </Button>
      </CardFooter>
    </Card>
  )
}
