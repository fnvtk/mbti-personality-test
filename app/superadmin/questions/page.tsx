"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText, Upload, Download, CheckCircle, AlertCircle, Search,
  RefreshCw, Brain, Sparkles, Target, XCircle, Eye, EyeOff,
  Shield, Lock, Settings2, Database, GitBranch
} from "lucide-react"

// 题目类型
interface Question {
  id: number
  question: string
  options: { value: string; text: string }[]
  dimension?: string
}

interface Validation {
  valid: boolean
  errors: string[]
  warnings: string[]
}

const TEST_TYPES = {
  mbti: { label: "MBTI", icon: Brain, color: "text-purple-600", bgColor: "bg-purple-50", description: "16型人格 · 4维度" },
  disc: { label: "DISC", icon: Target, color: "text-blue-600", bgColor: "bg-blue-50", description: "4维行为风格" },
  pdp: { label: "PDP", icon: Sparkles, color: "text-emerald-600", bgColor: "bg-emerald-50", description: "5种动物性格" },
}

type TestType = keyof typeof TEST_TYPES

export default function SuperAdminQuestionsPage() {
  const [questionsData, setQuestionsData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState<TestType>("mbti")
  const [searchTerm, setSearchTerm] = useState("")
  const [showOptions, setShowOptions] = useState(true)
  const [importResult, setImportResult] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 加载题库
  const loadQuestions = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/questions?type=all")
      const json = await res.json()
      if (json.code === 200) setQuestionsData(json.data)
    } catch (error) {
      console.error("加载题库失败:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadQuestions() }, [])

  const currentData = questionsData[activeType]
  const questions: Question[] = currentData?.questions || []
  const validation: Validation = currentData?.validation || { valid: true, errors: [], warnings: [] }
  const config = TEST_TYPES[activeType]

  // 搜索
  const filteredQuestions = questions.filter((q) => {
    if (!searchTerm) return true
    return q.question.includes(searchTerm) || q.id.toString().includes(searchTerm) || q.dimension?.includes(searchTerm.toUpperCase())
  })

  // 导出
  const handleExport = () => {
    if (!questions.length) return
    const blob = new Blob([JSON.stringify(questions, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${activeType}-questions-superadmin-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 导入
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string
        const importedQuestions = JSON.parse(content)

        if (!Array.isArray(importedQuestions)) {
          setImportResult({ type: "error", message: "格式错误：需要 JSON 数组" })
          return
        }

        // 验证
        const validateRes = await fetch("/api/admin/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ testType: activeType, questions: importedQuestions, action: "validate" }),
        })
        const validateJson = await validateRes.json()

        if (!validateJson.data?.validation?.valid) {
          const errors = validateJson.data?.validation?.errors || []
          setImportResult({ type: "error", message: `验证失败: ${errors.slice(0, 3).join("; ")}` })
          return
        }

        if (!confirm(`【超管操作】确认导入 ${importedQuestions.length} 道 ${config.label} 题目到系统主题库？原题库将被备份。`)) return

        const importRes = await fetch("/api/admin/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ testType: activeType, questions: importedQuestions, action: "import" }),
        })
        const importJson = await importRes.json()

        if (importJson.code === 200) {
          setImportResult({ type: "success", message: `[超管] ${importJson.message}` })
          await loadQuestions()
        } else {
          setImportResult({ type: "error", message: importJson.message })
        }
      } catch (error: any) {
        setImportResult({ type: "error", message: "导入失败: " + error.message })
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // 验证
  const handleValidate = async () => {
    try {
      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testType: activeType, questions, action: "validate" }),
      })
      const json = await res.json()
      const v = json.data?.validation

      if (v?.valid && v?.warnings?.length === 0) {
        setImportResult({ type: "success", message: `${config.label} 题库验证通过 ✓ 共 ${questions.length} 题` })
      } else if (v?.valid) {
        setImportResult({ type: "warning", message: `通过但有警告: ${v.warnings.slice(0, 2).join("; ")}` })
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
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            题库管理（超管）
          </h1>
          <p className="text-sm text-gray-500 mt-1">超级管理员专用 · 系统级题库管理与版本控制</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadQuestions} disabled={loading}>
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />刷新
        </Button>
      </div>

      {/* 超管权限提示 */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-start gap-2">
        <Lock className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-indigo-700">
          <strong>超管级操作说明：</strong>此处的题库修改将直接影响系统主题库，所有企业和用户的测试都基于此题库。
          导入操作会自动备份原文件。普通管理员的题库管理仅供查看和导出。
        </div>
      </div>

      {/* 提示 */}
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

      {/* 题库总览 */}
      <div className="grid grid-cols-3 gap-4">
        {(Object.keys(TEST_TYPES) as TestType[]).map((type) => {
          const tc = TEST_TYPES[type]
          const data = questionsData[type]
          const isActive = activeType === type
          return (
            <Card
              key={type}
              className={`cursor-pointer transition-all border ${isActive ? "border-indigo-300 ring-1 ring-indigo-200 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
              onClick={() => { setActiveType(type); setSearchTerm(""); setImportResult(null) }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-xl ${tc.bgColor} flex items-center justify-center`}>
                    <tc.icon className={`h-4 w-4 ${tc.color}`} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{tc.label}</p>
                    <p className="text-[10px] text-gray-400">{tc.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">{data?.count || 0}<span className="text-sm font-normal text-gray-400 ml-0.5">题</span></span>
                  {data?.validation && (
                    <Badge variant={data.validation.valid ? "default" : "destructive"} className="text-[10px]">
                      {data.validation.valid ? "✓ 正常" : `${data.validation.errors.length}错误`}
                    </Badge>
                  )}
                </div>
                {type === "mbti" && data?.dimensionStats && (
                  <div className="flex gap-1 mt-1.5">
                    {["EI", "SN", "TF", "JP"].map((d) => (
                      <Badge key={d} variant="outline" className="text-[9px] px-1">{d}:{data.dimensionStats[d] || 0}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 题库操作区 */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <config.icon className={`h-4 w-4 ${config.color}`} />
                {config.label} 系统主题库
              </CardTitle>
              <CardDescription>
                {questions.length} 题
                {currentData?.lastModified && ` · 更新: ${new Date(currentData.lastModified).toLocaleString("zh-CN")}`}
                {currentData?.fileSize && ` · ${(currentData.fileSize / 1024).toFixed(1)}KB`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportFile} className="hidden" />
              <Button size="sm" onClick={() => fileInputRef.current?.click()} className="text-xs bg-indigo-600 hover:bg-indigo-700">
                <Upload className="h-3.5 w-3.5 mr-1.5" />导入（覆盖）
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={!questions.length} className="text-xs">
                <Download className="h-3.5 w-3.5 mr-1.5" />导出
              </Button>
              <Button variant="outline" size="sm" onClick={handleValidate} disabled={!questions.length} className="text-xs">
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />验证
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* 验证摘要 */}
          {validation && !validation.valid && (
            <div className="bg-red-50 rounded-lg p-3 mb-4 text-sm">
              <p className="font-medium text-red-700"><XCircle className="h-4 w-4 inline mr-1" />{validation.errors.length} 个错误</p>
              <ul className="mt-1 text-xs text-red-600 space-y-0.5">
                {validation.errors.slice(0, 5).map((e, i) => <li key={i}>· {e}</li>)}
              </ul>
            </div>
          )}

          {/* 搜索 */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="搜索题目..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 h-9" />
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowOptions(!showOptions)} className="text-xs text-gray-500">
              {showOptions ? <EyeOff className="h-3.5 w-3.5 mr-1" /> : <Eye className="h-3.5 w-3.5 mr-1" />}
              选项
            </Button>
          </div>

          {/* 题目列表 */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-12 text-gray-400">{searchTerm ? "没有匹配的题目" : "暂无题目"}</div>
              ) : (
                filteredQuestions.map((q) => (
                  <div key={q.id} className="border rounded-lg p-3 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">{q.id}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-900">{q.question}</p>
                          {q.dimension && <Badge variant="outline" className="text-[10px] px-1.5">{q.dimension}</Badge>}
                        </div>
                        {showOptions && q.options && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {q.options.map((opt, i) => (
                              <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-gray-100 text-gray-600">
                                <span className="font-medium text-gray-800 mr-1">{opt.value}</span>
                                {opt.text.length > 25 ? opt.text.substring(0, 25) + "..." : opt.text}
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

          {!loading && filteredQuestions.length > 0 && (
            <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-gray-400">
              <span>显示 {filteredQuestions.length}/{questions.length} 题 {searchTerm && "(已筛选)"}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 版本和参考 */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-gray-500" />
            题库版本与参考
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-700">MBTI 题库</p>
              <p className="text-gray-500 mt-1">当前: {questionsData.mbti?.count || 0}题 (90题版)</p>
              <p className="text-gray-400">标准版: 93题 4维度</p>
              <p className="text-gray-400">GitHub: vsme/mbti, saogegood/MyMBTI</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-700">DISC 题库</p>
              <p className="text-gray-500 mt-1">当前: {questionsData.disc?.count || 0}题</p>
              <p className="text-gray-400">⚠️ 页面内嵌40题与数据文件不一致</p>
              <p className="text-gray-400">建议统一为数据文件版本</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-700">PDP 题库</p>
              <p className="text-gray-500 mt-1">当前: {questionsData.pdp?.count || 0}题</p>
              <p className="text-gray-400">⚠️ 页面内嵌30题与数据文件不一致</p>
              <p className="text-gray-400">建议统一为数据文件版本</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-indigo-50 rounded-lg text-xs text-indigo-700">
            <strong>导入格式：</strong>JSON 数组，每题含 id(number)、question(string)、options([{"{"}value,text{"}"}])。
            MBTI 额外需要 dimension 字段（EI/SN/TF/JP）。导入前会自动验证并备份原文件。
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
