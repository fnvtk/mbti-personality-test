"use client"

/**
 * 超级管理后台 - AI 服务商配置管理
 * 
 * 功能：
 * 1. 配置各 AI 服务商的 API Key、端点、模型等参数
 * 2. 实时查询各服务商余额
 * 3. 余额告警阈值设置和通知
 * 4. 一键启用/禁用服务商
 * 
 * 支持的 AI 服务商：
 * - OpenAI (GPT-4o/GPT-4/GPT-3.5)
 * - Anthropic (Claude)
 * - DeepSeek
 * - Moonshot (Kimi)
 * - Groq (免费)
 * - Coze (扣子)
 * - 通义千问 (Qwen)
 * - 智谱 (GLM)
 */

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Bot, Save, CheckCircle, AlertTriangle, RefreshCw, Eye, EyeOff,
  DollarSign, Zap, Settings2, Trash2, Plus, Wallet, Bell,
  ExternalLink, Copy, Check, ChevronDown, ChevronUp
} from "lucide-react"

// AI 服务商配置类型
interface AIProvider {
  id: string
  name: string
  enabled: boolean
  apiKey: string
  apiEndpoint?: string
  organizationId?: string
  model?: string
  maxTokens?: number
  balanceAlertThreshold?: number
  balanceAlertEnabled?: boolean
  lastBalanceCheck?: string
  lastBalance?: number
  notes?: string
  _hasKey?: boolean
}

// 余额查询结果类型
interface BalanceResult {
  providerId: string
  providerName: string
  balance: number | null
  currency: string
  used: number | null
  total: number | null
  status: "success" | "error" | "unsupported"
  message: string
  checkedAt: string
}

// 各服务商的图标颜色和品牌配置
const PROVIDER_BRANDS: Record<string, { color: string; bg: string; icon: string; docUrl: string }> = {
  openai: { color: "text-emerald-600", bg: "bg-emerald-50", icon: "🤖", docUrl: "https://platform.openai.com/api-keys" },
  anthropic: { color: "text-orange-600", bg: "bg-orange-50", icon: "🧠", docUrl: "https://console.anthropic.com/settings/keys" },
  deepseek: { color: "text-blue-600", bg: "bg-blue-50", icon: "🔍", docUrl: "https://platform.deepseek.com/api_keys" },
  moonshot: { color: "text-purple-600", bg: "bg-purple-50", icon: "🌙", docUrl: "https://platform.moonshot.cn/console/api-keys" },
  groq: { color: "text-red-600", bg: "bg-red-50", icon: "⚡", docUrl: "https://console.groq.com/keys" },
  coze: { color: "text-indigo-600", bg: "bg-indigo-50", icon: "🎯", docUrl: "https://www.coze.cn/open/api" },
  qwen: { color: "text-sky-600", bg: "bg-sky-50", icon: "☁️", docUrl: "https://dashscope.console.aliyun.com/apiKey" },
  zhipu: { color: "text-teal-600", bg: "bg-teal-50", icon: "💎", docUrl: "https://open.bigmodel.cn/usercenter/apikeys" },
}

export default function AIConfigPage() {
  // 状态管理
  const [providers, setProviders] = useState<AIProvider[]>([])
  const [balances, setBalances] = useState<Record<string, BalanceResult>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [checkingBalance, setCheckingBalance] = useState<Record<string, boolean>>({})
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [editingProvider, setEditingProvider] = useState<AIProvider | null>(null)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})
  const [alerts, setAlerts] = useState<any[]>([])
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // 加载配置
  const loadConfig = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/superadmin/ai-config")
      const data = await res.json()
      if (data.success) {
        setProviders(data.data)
      }
    } catch (error) {
      console.error("加载AI配置失败:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  // 保存单个服务商配置
  const saveProvider = async (provider: AIProvider) => {
    setSaving(true)
    try {
      const res = await fetch("/api/superadmin/ai-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      })
      const data = await res.json()
      if (data.success) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
        await loadConfig() // 重新加载
      }
    } catch (error) {
      console.error("保存配置失败:", error)
    } finally {
      setSaving(false)
    }
  }

  // 查询单个服务商余额
  const checkBalance = async (providerId: string) => {
    setCheckingBalance((prev) => ({ ...prev, [providerId]: true }))
    try {
      const res = await fetch("/api/superadmin/ai-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId }),
      })
      const data = await res.json()
      if (data.success && data.data.length > 0) {
        setBalances((prev) => ({ ...prev, [providerId]: data.data[0] }))
        if (data.alerts) {
          setAlerts(data.alerts)
        }
      }
    } catch (error) {
      console.error("查询余额失败:", error)
    } finally {
      setCheckingBalance((prev) => ({ ...prev, [providerId]: false }))
    }
  }

  // 查询所有已启用服务商的余额
  const checkAllBalances = async () => {
    const enabledIds = providers.filter((p) => p.enabled && p._hasKey).map((p) => p.id)
    if (enabledIds.length === 0) return

    const checkingState: Record<string, boolean> = {}
    enabledIds.forEach((id) => (checkingState[id] = true))
    setCheckingBalance(checkingState)

    try {
      const res = await fetch("/api/superadmin/ai-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerIds: enabledIds }),
      })
      const data = await res.json()
      if (data.success) {
        const newBalances: Record<string, BalanceResult> = {}
        data.data.forEach((result: BalanceResult) => {
          newBalances[result.providerId] = result
        })
        setBalances((prev) => ({ ...prev, ...newBalances }))
        if (data.alerts) {
          setAlerts(data.alerts)
        }
      }
    } catch (error) {
      console.error("批量查询余额失败:", error)
    } finally {
      setCheckingBalance({})
    }
  }

  // 切换服务商启用/禁用
  const toggleProvider = async (providerId: string, enabled: boolean) => {
    const provider = providers.find((p) => p.id === providerId)
    if (!provider) return
    const updated = { ...provider, enabled }
    setProviders((prev) => prev.map((p) => (p.id === providerId ? updated : p)))
    await saveProvider(updated)
  }

  // 更新服务商配置字段
  const updateProviderField = (providerId: string, field: string, value: any) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, [field]: value } : p))
    )
  }

  // 复制 API Key
  const copyApiKey = (providerId: string, key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(providerId)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // 切换展开/收起
  const toggleExpand = (providerId: string) => {
    setExpandedCards((prev) => ({ ...prev, [providerId]: !prev[providerId] }))
  }

  // 获取服务商品牌配置
  const getBrand = (providerId: string) => {
    return PROVIDER_BRANDS[providerId] || { color: "text-gray-600", bg: "bg-gray-50", icon: "🔧", docUrl: "#" }
  }

  // 渲染余额状态标签
  const renderBalanceBadge = (providerId: string) => {
    const result = balances[providerId]
    if (!result) return null

    if (result.status === "success" && result.balance !== null) {
      const isLow = providers.find((p) => p.id === providerId)?.balanceAlertThreshold
        ? result.balance <= (providers.find((p) => p.id === providerId)?.balanceAlertThreshold || 0)
        : false
      return (
        <Badge variant={isLow ? "destructive" : "secondary"} className="text-xs">
          <Wallet className="h-3 w-3 mr-1" />
          {result.currency === "USD" ? "$" : "¥"}{result.balance?.toFixed(2)}
        </Badge>
      )
    }

    if (result.status === "unsupported") {
      return (
        <Badge variant="outline" className="text-xs text-gray-500">
          不支持查询
        </Badge>
      )
    }

    if (result.status === "error") {
      return (
        <Badge variant="destructive" className="text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />查询失败
        </Badge>
      )
    }

    return null
  }

  // 骨架屏加载状态
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80 mt-2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60 mt-3" />
                <Skeleton className="h-10 w-full mt-4" />
                <Skeleton className="h-10 w-full mt-3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // 统计数据
  const enabledCount = providers.filter((p) => p.enabled).length
  const configuredCount = providers.filter((p) => p._hasKey).length
  const lowBalanceCount = Object.values(balances).filter(
    (b) => b.status === "success" && b.balance !== null && b.balance <= (providers.find((p) => p.id === b.providerId)?.balanceAlertThreshold || 0)
  ).length

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI 服务商配置</h1>
          <p className="text-sm text-gray-500 mt-1">
            管理 AI 服务商的 API 密钥、模型参数和余额监控
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={checkAllBalances}
            disabled={Object.values(checkingBalance).some(Boolean)}
            className="text-sm"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${Object.values(checkingBalance).some(Boolean) ? "animate-spin" : ""}`} />
            查询全部余额
          </Button>
        </div>
      </div>

      {/* 余额告警通知 */}
      {alerts.length > 0 && (
        <Alert className="bg-red-50 border-red-200 text-red-800">
          <Bell className="h-4 w-4" />
          <AlertDescription>
            <span className="font-medium">余额告警：</span>
            {alerts.map((a: any, i: number) => (
              <span key={i}>
                {a.providerName} 余额 ¥{a.balance?.toFixed(2)}（阈值 ¥{a.threshold}）
                {i < alerts.length - 1 ? "；" : ""}
              </span>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* 保存成功提示 */}
      {saveSuccess && (
        <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>配置已保存成功</AlertDescription>
        </Alert>
      )}

      {/* 统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Bot className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">服务商总数</p>
                <p className="text-xl font-bold text-gray-900">{providers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Zap className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">已启用</p>
                <p className="text-xl font-bold text-gray-900">{enabledCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Settings2 className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">已配置密钥</p>
                <p className="text-xl font-bold text-gray-900">{configuredCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${lowBalanceCount > 0 ? "bg-red-50" : "bg-gray-50"} flex items-center justify-center`}>
                <AlertTriangle className={`h-5 w-5 ${lowBalanceCount > 0 ? "text-red-600" : "text-gray-400"}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">余额告警</p>
                <p className={`text-xl font-bold ${lowBalanceCount > 0 ? "text-red-600" : "text-gray-900"}`}>
                  {lowBalanceCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 服务商列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {providers.map((provider) => {
          const brand = getBrand(provider.id)
          const isExpanded = expandedCards[provider.id]
          const balance = balances[provider.id]
          const isChecking = checkingBalance[provider.id]

          return (
            <Card
              key={provider.id}
              className={`border-0 shadow-sm transition-all ${provider.enabled ? "ring-1 ring-indigo-100" : "opacity-75"}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${brand.bg} flex items-center justify-center text-lg`}>
                      {brand.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        {provider.name}
                        {provider.enabled && (
                          <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-700">
                            已启用
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {provider.model && `模型: ${provider.model}`}
                        {provider.notes && ` · ${provider.notes}`}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderBalanceBadge(provider.id)}
                    <Switch
                      checked={provider.enabled}
                      onCheckedChange={(checked) => toggleProvider(provider.id, checked)}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                {/* API Key 配置区域 */}
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">API Key</Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showKeys[provider.id] ? "text" : "password"}
                        value={provider.apiKey}
                        onChange={(e) => updateProviderField(provider.id, "apiKey", e.target.value)}
                        placeholder={`输入 ${provider.name} API Key`}
                        className="h-9 pr-20 text-sm font-mono"
                      />
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setShowKeys((prev) => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                        >
                          {showKeys[provider.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        {provider.apiKey && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyApiKey(provider.id, provider.apiKey)}
                          >
                            {copiedKey === provider.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 操作按钮组 */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    size="sm"
                    onClick={() => saveProvider(provider)}
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-700 text-xs h-8"
                  >
                    <Save className="h-3 w-3 mr-1" />保存
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => checkBalance(provider.id)}
                    disabled={isChecking || !provider._hasKey}
                    className="text-xs h-8"
                  >
                    <RefreshCw className={`h-3 w-3 mr-1 ${isChecking ? "animate-spin" : ""}`} />
                    {isChecking ? "查询中..." : "查询余额"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(provider.id)}
                    className="text-xs h-8 text-gray-500"
                  >
                    {isExpanded ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                    {isExpanded ? "收起" : "更多配置"}
                  </Button>
                  <a href={brand.docUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="text-xs h-8 text-gray-400">
                      <ExternalLink className="h-3 w-3 mr-1" />文档
                    </Button>
                  </a>
                </div>

                {/* 余额查询结果 */}
                {balance && (
                  <div className={`rounded-lg p-3 text-xs ${
                    balance.status === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                    balance.status === "error" ? "bg-red-50 text-red-700 border border-red-100" :
                    "bg-gray-50 text-gray-600 border border-gray-100"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span>{balance.message}</span>
                      <span className="text-[10px] text-gray-400">
                        {balance.checkedAt ? new Date(balance.checkedAt).toLocaleString("zh-CN") : ""}
                      </span>
                    </div>
                  </div>
                )}

                {/* 展开的高级配置 */}
                {isExpanded && (
                  <div className="space-y-3 pt-2 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-gray-500">API 端点</Label>
                        <Input
                          value={provider.apiEndpoint || ""}
                          onChange={(e) => updateProviderField(provider.id, "apiEndpoint", e.target.value)}
                          placeholder="https://api.example.com/v1"
                          className="h-8 text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-gray-500">默认模型</Label>
                        <Input
                          value={provider.model || ""}
                          onChange={(e) => updateProviderField(provider.id, "model", e.target.value)}
                          placeholder="模型名称"
                          className="h-8 text-xs"
                        />
                      </div>
                      {provider.id === "openai" && (
                        <div className="space-y-1.5">
                          <Label className="text-xs text-gray-500">Organization ID</Label>
                          <Input
                            value={provider.organizationId || ""}
                            onChange={(e) => updateProviderField(provider.id, "organizationId", e.target.value)}
                            placeholder="org-xxx"
                            className="h-8 text-xs font-mono"
                          />
                        </div>
                      )}
                      <div className="space-y-1.5">
                        <Label className="text-xs text-gray-500">Max Tokens</Label>
                        <Input
                          type="number"
                          value={provider.maxTokens || 4096}
                          onChange={(e) => updateProviderField(provider.id, "maxTokens", Number(e.target.value))}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>

                    {/* 余额告警配置 */}
                    <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-700">余额告警</p>
                          <p className="text-[10px] text-gray-400">余额低于阈值时发送通知</p>
                        </div>
                        <Switch
                          checked={provider.balanceAlertEnabled || false}
                          onCheckedChange={(checked) => updateProviderField(provider.id, "balanceAlertEnabled", checked)}
                        />
                      </div>
                      {provider.balanceAlertEnabled && (
                        <div className="space-y-1.5">
                          <Label className="text-xs text-gray-500">告警阈值（元）</Label>
                          <Input
                            type="number"
                            value={provider.balanceAlertThreshold || 10}
                            onChange={(e) => updateProviderField(provider.id, "balanceAlertThreshold", Number(e.target.value))}
                            min="1"
                            step="1"
                            className="h-8 text-xs max-w-[200px]"
                          />
                        </div>
                      )}
                    </div>

                    {/* 备注 */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-500">备注</Label>
                      <Input
                        value={provider.notes || ""}
                        onChange={(e) => updateProviderField(provider.id, "notes", e.target.value)}
                        placeholder="选填，用于记录说明"
                        className="h-8 text-xs"
                      />
                    </div>

                    {/* 保存展开区的配置 */}
                    <Button
                      size="sm"
                      onClick={() => saveProvider(provider)}
                      disabled={saving}
                      className="bg-indigo-600 hover:bg-indigo-700 text-xs h-8"
                    >
                      <Save className="h-3 w-3 mr-1" />保存全部配置
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 底部说明 */}
      <Card className="border-0 shadow-sm bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 space-y-1">
              <p className="font-medium">安全提示</p>
              <ul className="list-disc list-inside space-y-0.5 text-amber-700">
                <li>API 密钥存储在服务端，已做脱敏处理，保存后显示为部分隐藏</li>
                <li>修改 API Key 后需点击"保存"按钮才会生效</li>
                <li>余额查询结果仅供参考，以各平台控制台为准</li>
                <li>Groq 为免费额度服务商，无需配置余额告警</li>
                <li>部分服务商（Anthropic/Coze/通义千问/智谱）暂不支持余额查询，仅验证 API Key 有效性</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
