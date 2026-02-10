"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import {
  FileText, Upload, Download, CheckCircle, AlertCircle, Search,
  RefreshCw, ChevronDown, ChevronUp, Brain, Sparkles, Target,
  Info, XCircle, Eye, EyeOff
} from "lucide-react"

// 题目类型
interface Question {
  id: number
  question: string
  options: { value: string; text: string }[]
  dimension?: string
}

// 验证结果
interface Validation {
  valid: boolean
  errors: string[]
  warnings: string[]
}

// 测试类型配置
const TEST_TYPES = {
  mbti: {
    label: "MBTI",
    icon: Brain,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "16型人格测试 · 4维度",
    dimensions: ["EI", "SN", "TF", "JP"],
  },
  disc: {
    label: "DISC",
    icon: Target,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "4维行为风格测试",
    dimensions: ["D", "I", "S", "C"],
  },
  pdp: {
    label: "PDP",
    icon: Sparkles,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    description: "5种动物性格测试",
    dimensions: ["Tiger", "Peacock", "Koala", "Owl", "Chameleon"],
  },
}

type TestType = keyof typeof TEST_TYPES

export default function QuestionsManagePage() {
  const [activeTab, setActiveTab] = useState<TestType>("mbti")
  const [questionsData, setQuestionsData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
  const [showOptions, setShowOptions] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 导入状态
  const [importResult, setImportResult] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null)

  // 加载题库数据
  const loadQuestions = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/questions?type=all")
      const json = await res.json()
      if (json.code === 200) {
        setQuestionsData(json.data)
      }
    } catch (error) {
      console.error("加载题库失败:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuestions()
  }, [])

  // 获取当前类型数据
  const currentData = questionsData[activeTab]
  const questions: Question[] = currentData?.questions || []
  const validation: Validation = currentData?.validation || { valid: true, errors: [], warnings: [] }
  const config = TEST_TYPES[activeTab]

  // 搜索过滤
  const filteredQuestions = questions.filter((q) => {
    if (!searchTerm) return true
    return (
      q.question.includes(searchTerm) ||
      q.id.toString().includes(searchTerm) ||
      q.dimension?.includes(searchTerm.toUpperCase()) ||
      q.options?.some((o) => o.text.includes(searchTerm))
    )
  })

  // 导出 JSON
  const handleExport = () => {
    if (!questions.length) return
    const blob = new Blob([JSON.stringify(questions, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${activeTab}-questions-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 导入 JSON
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string
        const importedQuestions = JSON.parse(content)

        if (!Array.isArray(importedQuestions)) {
          setImportResult({ type: "error", message: "导入文件格式错误：需要 JSON 数组格式" })
          return
        }

        // 先验证
        const validateRes = await fetch("/api/admin/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ testType: activeTab, questions: importedQuestions, action: "validate" }),
        })
        const validateJson = await validateRes.json()

        if (!validateJson.data?.validation?.valid) {
          const errors = validateJson.data?.validation?.errors || []
          setImportResult({
            type: "error",
            message: `验证失败（${errors.length}个错误）: ${errors.slice(0, 3).join("; ")}${errors.length > 3 ? "..." : ""}`
          })
          return
        }

        // 确认导入
        if (!confirm(`确认导入 ${importedQuestions.length} 道${config.label}题目？原有题目将被替换。`)) {
          return
        }

        // 执行导入
        const importRes = await fetch("/api/admin/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ testType: activeTab, questions: importedQuestions, action: "import" }),
        })
        const importJson = await importRes.json()

        if (importJson.code === 200) {
          setImportResult({ type: "success", message: importJson.message })
          await loadQuestions()
        } else {
          setImportResult({ type: "error", message: importJson.message })
        }
      } catch (error: any) {
        setImportResult({ type: "error", message: "导入失败: " + error.message })
      }
    }
    reader.readAsText(file)

    // 清空 input 以便重复选择同一文件
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // 验证当前题库
  const handleValidate = async () => {
    try {
      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testType: activeTab, questions, action: "validate" }),
      })
      const json = await res.json()
      const v = json.data?.validation

      if (v?.valid && v?.warnings?.length === 0) {
        setImportResult({ type: "success", message: `${config.label} 题库验证通过，共 ${questions.length} 题` })
      } else if (v?.valid) {
        setImportResult({ type: "warning", message: `验证通过但有 ${v.warnings.length} 个警告: ${v.warnings.slice(0, 2).join("; ")}` })
      } else {
        setImportResult({ type: "error", message: `验证失败: ${v?.errors?.slice(0, 3).join("; ")}` })
      }
    } catch {
      setImportResult({ type: "error", message: "验证请求失败" })
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">题库管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理 MBTI、DISC、PDP 三套测试题库的导入、导出和验证</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadQuestions} disabled={loading}>
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          刷新
        </Button>
      </div>

      {/* 提示信息 */}
      {importResult && (
        <Alert className={
          importResult.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
          importResult.type === "warning" ? "bg-amber-50 border-amber-200 text-amber-800" :
          "bg-red-50 border-red-200 text-red-800"
        }>
          {importResult.type === "success" ? <CheckCircle className="h-4 w-4" /> :
           importResult.type === "warning" ? <AlertCircle className="h-4 w-4" /> :
           <XCircle className="h-4 w-4" />}
          <AlertDescription>{importResult.message}</AlertDescription>
        </Alert>
      )}

      {/* 题库概览卡片 */}
      <div className="grid grid-cols-3 gap-4">
        {(Object.keys(TEST_TYPES) as TestType[]).map((type) => {
          const tc = TEST_TYPES[type]
          const data = questionsData[type]
          const isActive = activeTab === type
          return (
            <Card
              key={type}
              className={`cursor-pointer transition-all border ${isActive ? "border-purple-300 ring-1 ring-purple-200 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
              onClick={() => { setActiveTab(type); setSearchTerm(""); setImportResult(null) }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${tc.bgColor} flex items-center justify-center`}>
                    <tc.icon className={`h-5 w-5 ${tc.color}`} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{tc.label}</p>
                    <p className="text-xs text-gray-400">{tc.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">{data?.count || 0}</span>
                    <span className="text-sm text-gray-400 ml-1">题</span>
                  </div>
                  {data?.validation && (
                    <Badge variant={data.validation.valid ? "default" : "destructive"} className="text-[10px]">
                      {data.validation.valid ? "已验证" : `${data.validation.errors.length}错误`}
                    </Badge>
                  )}
                </div>
                {/* MBTI 维度统计 */}
                {type === "mbti" && data?.dimensionStats && (
                  <div className="flex gap-1 mt-2">
                    {["EI", "SN", "TF", "JP"].map((dim) => (
                      <Badge key={dim} variant="outline" className="text-[10px] px-1.5">
                        {dim}: {data.dimensionStats[dim] || 0}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 操作区域 */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <config.icon className={`h-4 w-4 ${config.color}`} />
                {config.label} 题库管理
              </CardTitle>
              <CardDescription>
                共 {questions.length} 题
                {currentData?.lastModified && ` · 最后更新: ${new Date(currentData.lastModified).toLocaleString("zh-CN")}`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {/* 导入按钮 */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="text-xs">
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                导入JSON
              </Button>
              {/* 导出按钮 */}
              <Button variant="outline" size="sm" onClick={handleExport} disabled={!questions.length} className="text-xs">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                导出JSON
              </Button>
              {/* 验证按钮 */}
              <Button variant="outline" size="sm" onClick={handleValidate} disabled={!questions.length} className="text-xs">
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                验证题库
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* 验证结果摘要 */}
          {validation && !validation.valid && (
            <div className="bg-red-50 rounded-lg p-3 mb-4 text-sm">
              <p className="font-medium text-red-700 flex items-center gap-1">
                <XCircle className="h-4 w-4" />
                验证未通过 · {validation.errors.length} 个错误
              </p>
              <ul className="mt-1 text-xs text-red-600 space-y-0.5">
                {validation.errors.slice(0, 5).map((e, i) => <li key={i}>· {e}</li>)}
                {validation.errors.length > 5 && <li>...还有 {validation.errors.length - 5} 个错误</li>}
              </ul>
            </div>
          )}
          {validation?.warnings?.length > 0 && (
            <div className="bg-amber-50 rounded-lg p-3 mb-4 text-sm">
              <p className="font-medium text-amber-700 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {validation.warnings.length} 个警告
              </p>
              <ul className="mt-1 text-xs text-amber-600 space-y-0.5">
                {validation.warnings.map((w, i) => <li key={i}>· {w}</li>)}
              </ul>
            </div>
          )}

          {/* 搜索栏 */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索题目内容、ID、维度..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOptions(!showOptions)}
              className="text-xs text-gray-500"
            >
              {showOptions ? <EyeOff className="h-3.5 w-3.5 mr-1" /> : <Eye className="h-3.5 w-3.5 mr-1" />}
              {showOptions ? "收起选项" : "展开选项"}
            </Button>
          </div>

          {/* 题目列表 */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  {searchTerm ? "没有匹配的题目" : "暂无题目数据"}
                </div>
              ) : (
                filteredQuestions.map((q, index) => (
                  <div
                    key={q.id}
                    className="border rounded-lg p-3 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {/* 序号 */}
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                        {q.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* 题目文本 */}
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-900">{q.question}</p>
                          {q.dimension && (
                            <Badge variant="outline" className="text-[10px] px-1.5 flex-shrink-0">
                              {q.dimension}
                            </Badge>
                          )}
                        </div>
                        {/* 选项 */}
                        {showOptions && q.options && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {q.options.map((opt, optIdx) => (
                              <span
                                key={optIdx}
                                className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-gray-100 text-gray-600"
                              >
                                <span className="font-medium text-gray-800 mr-1">{opt.value}</span>
                                {opt.text.length > 30 ? opt.text.substring(0, 30) + "..." : opt.text}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 底部统计 */}
          {!loading && filteredQuestions.length > 0 && (
            <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-gray-400">
              <span>
                显示 {filteredQuestions.length} / {questions.length} 题
                {searchTerm && " (已筛选)"}
              </span>
              <span>
                文件大小: {currentData?.fileSize ? `${(currentData.fileSize / 1024).toFixed(1)}KB` : "-"}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GitHub 题库参考 */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            题库参考资源
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-xs font-medium text-purple-700">MBTI 标准 93 题</p>
              <p className="text-[10px] text-purple-500 mt-1">GitHub: saogegood/MyMBTI</p>
              <p className="text-[10px] text-purple-500">GitHub: vsme/mbti (Next.js版)</p>
              <p className="text-[10px] text-purple-400 mt-1">当前: {questionsData.mbti?.count || 0}题 / 标准93题</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs font-medium text-blue-700">DISC 标准题库</p>
              <p className="text-[10px] text-blue-500 mt-1">Thomas International 28题版</p>
              <p className="text-[10px] text-blue-500">经典版 24题 / 扩展版 40题</p>
              <p className="text-[10px] text-blue-400 mt-1">当前: {questionsData.disc?.count || 0}题（页面内嵌40题）</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <p className="text-xs font-medium text-emerald-700">PDP 标准题库</p>
              <p className="text-[10px] text-emerald-500 mt-1">PDP Professional DynaMetric 30题</p>
              <p className="text-[10px] text-emerald-500">5种动物特质评估</p>
              <p className="text-[10px] text-emerald-400 mt-1">当前: {questionsData.pdp?.count || 0}题（页面内嵌30题）</p>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-3">
            提示：导入格式为 JSON 数组，每题包含 id、question、options 字段。MBTI 还需包含 dimension 字段（EI/SN/TF/JP）。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
