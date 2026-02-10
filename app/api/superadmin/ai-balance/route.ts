/**
 * 超管 AI 余额查询 API
 * 
 * POST - 查询指定 AI 服务商的余额
 * body: { providerId: string } 或 { providerIds: string[] }
 * 
 * 支持的余额查询：
 * - OpenAI: /dashboard/billing/credit_grants 或 /v1/dashboard/billing/subscription
 * - DeepSeek: /user/balance
 * - Moonshot: /v1/users/me/balance
 * - 通义千问: 通过阿里云 API 查询
 * - 智谱: 通过 open.bigmodel.cn 查询
 * - Groq: 免费额度，返回使用情况
 * - Anthropic/Coze: 暂不支持余额查询
 */

import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// 配置文件路径（与 ai-config 共享）
const CONFIG_FILE = path.join(process.cwd(), "data", "ai-providers-config.json")

interface BalanceResult {
  providerId: string
  providerName: string
  balance: number | null       // 余额（元），null 表示不支持
  currency: string             // 货币单位
  used: number | null          // 已使用金额
  total: number | null         // 总额度
  status: "success" | "error" | "unsupported"
  message: string
  checkedAt: string            // 查询时间
}

// 读取服务商配置
function readConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return []
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"))
  } catch {
    return []
  }
}

// 更新配置中的余额信息
function updateBalanceInConfig(providerId: string, balance: number | null) {
  try {
    const configs = readConfig()
    const index = configs.findIndex((p: any) => p.id === providerId)
    if (index !== -1) {
      configs[index].lastBalance = balance
      configs[index].lastBalanceCheck = new Date().toISOString()
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(configs, null, 2), "utf-8")
    }
  } catch {
    // 忽略写入失败
  }
}

/**
 * POST - 查询余额
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const providerIds: string[] = body.providerIds || (body.providerId ? [body.providerId] : [])

    if (providerIds.length === 0) {
      return NextResponse.json({ success: false, error: "请提供 providerId 或 providerIds" }, { status: 400 })
    }

    const configs = readConfig()
    const results: BalanceResult[] = []

    for (const id of providerIds) {
      const config = configs.find((p: any) => p.id === id)
      if (!config) {
        results.push({
          providerId: id,
          providerName: id,
          balance: null,
          currency: "CNY",
          used: null,
          total: null,
          status: "error",
          message: "未找到该服务商配置",
          checkedAt: new Date().toISOString(),
        })
        continue
      }

      if (!config.apiKey) {
        results.push({
          providerId: id,
          providerName: config.name,
          balance: null,
          currency: "CNY",
          used: null,
          total: null,
          status: "error",
          message: "未配置 API Key",
          checkedAt: new Date().toISOString(),
        })
        continue
      }

      // 根据服务商类型调用对应的余额查询
      const result = await queryBalance(config)
      results.push(result)

      // 更新配置文件中的余额信息
      if (result.status === "success") {
        updateBalanceInConfig(id, result.balance)
      }
    }

    // 检查是否有余额低于告警阈值的服务商
    const alerts = results
      .filter((r) => r.status === "success" && r.balance !== null)
      .filter((r) => {
        const config = configs.find((p: any) => p.id === r.providerId)
        return config?.balanceAlertEnabled && config?.balanceAlertThreshold && r.balance! <= config.balanceAlertThreshold
      })
      .map((r) => ({
        providerId: r.providerId,
        providerName: r.providerName,
        balance: r.balance,
        threshold: configs.find((p: any) => p.id === r.providerId)?.balanceAlertThreshold,
      }))

    return NextResponse.json({
      success: true,
      data: results,
      alerts: alerts.length > 0 ? alerts : null,
      alertMessage: alerts.length > 0
        ? `${alerts.map((a) => `${a.providerName}余额¥${a.balance?.toFixed(2)}，低于阈值¥${a.threshold}`).join("；")}`
        : null,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "查询余额失败" }, { status: 500 })
  }
}

/**
 * 根据服务商类型查询余额
 */
async function queryBalance(config: any): Promise<BalanceResult> {
  const now = new Date().toISOString()
  const baseResult = {
    providerId: config.id,
    providerName: config.name,
    currency: "CNY",
    checkedAt: now,
  }

  try {
    switch (config.id) {
      case "openai":
        return await queryOpenAIBalance(config, baseResult)
      case "deepseek":
        return await queryDeepSeekBalance(config, baseResult)
      case "moonshot":
        return await queryMoonshotBalance(config, baseResult)
      case "qwen":
        return await queryQwenBalance(config, baseResult)
      case "zhipu":
        return await queryZhipuBalance(config, baseResult)
      case "groq":
        return {
          ...baseResult,
          balance: null,
          used: null,
          total: null,
          status: "unsupported",
          message: "Groq 为免费额度，暂不支持余额查询",
        }
      case "anthropic":
        return await queryAnthropicBalance(config, baseResult)
      case "coze":
        return {
          ...baseResult,
          balance: null,
          used: null,
          total: null,
          status: "unsupported",
          message: "Coze 暂不支持余额查询，请在 coze.cn 平台查看",
        }
      default:
        return {
          ...baseResult,
          balance: null,
          used: null,
          total: null,
          status: "unsupported",
          message: "该服务商暂不支持余额查询",
        }
    }
  } catch (error: any) {
    return {
      ...baseResult,
      balance: null,
      used: null,
      total: null,
      status: "error",
      message: `查询失败: ${error.message || "未知错误"}`,
    }
  }
}

/**
 * OpenAI 余额查询
 * 通过 /v1/dashboard/billing/subscription + /v1/dashboard/billing/usage 查询
 */
async function queryOpenAIBalance(config: any, base: any): Promise<BalanceResult> {
  try {
    // 查询订阅信息（获取总额度）
    const subRes = await fetch("https://api.openai.com/v1/dashboard/billing/subscription", {
      headers: { Authorization: `Bearer ${config.apiKey}` },
      signal: AbortSignal.timeout(10000),
    })

    if (!subRes.ok) {
      // 尝试新版 API
      const creditRes = await fetch("https://api.openai.com/v1/organization/costs?start_time=2024-01-01&end_time=2026-12-31", {
        headers: { Authorization: `Bearer ${config.apiKey}` },
        signal: AbortSignal.timeout(10000),
      })
      if (!creditRes.ok) {
        return {
          ...base,
          balance: null,
          used: null,
          total: null,
          currency: "USD",
          status: "error",
          message: `API 请求失败 (${subRes.status})，请检查 API Key 权限`,
        }
      }
    }

    const subData = await subRes.json()
    const totalLimit = subData.hard_limit_usd || subData.system_hard_limit_usd || 0

    // 查询本月使用量
    const now = new Date()
    const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`
    const endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

    const usageRes = await fetch(
      `https://api.openai.com/v1/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: { Authorization: `Bearer ${config.apiKey}` },
        signal: AbortSignal.timeout(10000),
      }
    )

    let used = 0
    if (usageRes.ok) {
      const usageData = await usageRes.json()
      used = (usageData.total_usage || 0) / 100 // 单位是美分
    }

    return {
      ...base,
      balance: Number((totalLimit - used).toFixed(2)),
      used: Number(used.toFixed(2)),
      total: totalLimit,
      currency: "USD",
      status: "success",
      message: `总额度 $${totalLimit}，已用 $${used.toFixed(2)}，剩余 $${(totalLimit - used).toFixed(2)}`,
    }
  } catch (error: any) {
    return {
      ...base,
      balance: null,
      used: null,
      total: null,
      currency: "USD",
      status: "error",
      message: `查询超时或网络错误: ${error.message}`,
    }
  }
}

/**
 * DeepSeek 余额查询
 * GET https://api.deepseek.com/user/balance
 */
async function queryDeepSeekBalance(config: any, base: any): Promise<BalanceResult> {
  const res = await fetch("https://api.deepseek.com/user/balance", {
    headers: { Authorization: `Bearer ${config.apiKey}` },
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) {
    return {
      ...base,
      balance: null,
      used: null,
      total: null,
      status: "error",
      message: `请求失败 (${res.status})`,
    }
  }

  const data = await res.json()
  // DeepSeek 返回格式: { balance_infos: [{ currency: "CNY", total_balance: "10.00", granted_balance: "...", topped_up_balance: "..." }] }
  if (data.balance_infos && data.balance_infos.length > 0) {
    const info = data.balance_infos[0]
    const total = parseFloat(info.total_balance || "0")
    return {
      ...base,
      balance: total,
      used: null,
      total: total,
      status: "success",
      message: `余额 ¥${total.toFixed(2)}`,
    }
  }

  return {
    ...base,
    balance: null,
    used: null,
    total: null,
    status: "error",
    message: "返回数据格式异常",
  }
}

/**
 * Moonshot (Kimi) 余额查询
 * GET https://api.moonshot.cn/v1/users/me/balance
 */
async function queryMoonshotBalance(config: any, base: any): Promise<BalanceResult> {
  const res = await fetch("https://api.moonshot.cn/v1/users/me/balance", {
    headers: { Authorization: `Bearer ${config.apiKey}` },
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) {
    return {
      ...base,
      balance: null,
      used: null,
      total: null,
      status: "error",
      message: `请求失败 (${res.status})`,
    }
  }

  const data = await res.json()
  // Moonshot 返回: { data: { available_balance: 10.00, voucher_balance: 0, cash_balance: 10.00 } }
  if (data.data) {
    const balance = data.data.available_balance || 0
    const cash = data.data.cash_balance || 0
    const voucher = data.data.voucher_balance || 0
    return {
      ...base,
      balance: balance,
      used: null,
      total: cash + voucher,
      status: "success",
      message: `可用余额 ¥${balance.toFixed(2)}（现金 ¥${cash.toFixed(2)} + 代金券 ¥${voucher.toFixed(2)}）`,
    }
  }

  return {
    ...base,
    balance: null,
    used: null,
    total: null,
    status: "error",
    message: "返回数据格式异常",
  }
}

/**
 * 通义千问余额查询 (阿里云 DashScope)
 * 通过简单请求验证 API Key 是否有效
 */
async function queryQwenBalance(config: any, base: any): Promise<BalanceResult> {
  // 阿里云 DashScope 没有直接的余额查询 API，通过 models 接口验证 Key 有效性
  const res = await fetch("https://dashscope.aliyuncs.com/api/v1/models", {
    headers: { Authorization: `Bearer ${config.apiKey}` },
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) {
    return {
      ...base,
      balance: null,
      used: null,
      total: null,
      status: "error",
      message: `API Key 验证失败 (${res.status})，请在阿里云控制台查看余额`,
    }
  }

  return {
    ...base,
    balance: null,
    used: null,
    total: null,
    status: "unsupported",
    message: "通义千问暂不支持余额查询，API Key 验证通过。请在阿里云控制台查看余额。",
  }
}

/**
 * 智谱 GLM 余额查询
 */
async function queryZhipuBalance(config: any, base: any): Promise<BalanceResult> {
  // 智谱暂无直接余额查询 API，通过模型列表验证 Key
  const res = await fetch("https://open.bigmodel.cn/api/paas/v4/models", {
    headers: { Authorization: `Bearer ${config.apiKey}` },
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) {
    return {
      ...base,
      balance: null,
      used: null,
      total: null,
      status: "error",
      message: `API Key 验证失败 (${res.status})`,
    }
  }

  return {
    ...base,
    balance: null,
    used: null,
    total: null,
    status: "unsupported",
    message: "智谱暂不支持余额查询，API Key 验证通过。请在 open.bigmodel.cn 查看余额。",
  }
}

/**
 * Anthropic 余额查询
 * 通过验证 API Key 是否有效
 */
async function queryAnthropicBalance(config: any, base: any): Promise<BalanceResult> {
  // Anthropic 没有余额查询 API，通过 models 接口验证
  const res = await fetch("https://api.anthropic.com/v1/models", {
    headers: {
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) {
    return {
      ...base,
      balance: null,
      used: null,
      total: null,
      currency: "USD",
      status: "error",
      message: `API Key 验证失败 (${res.status})`,
    }
  }

  return {
    ...base,
    balance: null,
    used: null,
    total: null,
    currency: "USD",
    status: "unsupported",
    message: "Anthropic 暂不支持余额查询，API Key 验证通过。请在 console.anthropic.com 查看余额。",
  }
}
