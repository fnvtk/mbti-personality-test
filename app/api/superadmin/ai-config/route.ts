/**
 * 超管 AI 服务商配置 API
 * 
 * GET  - 获取所有 AI 服务商配置
 * POST - 保存/更新 AI 服务商配置
 * 
 * 数据存储在服务端 JSON 文件中，避免 localStorage 安全风险
 */

import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// AI 服务商配置文件路径
const CONFIG_FILE = path.join(process.cwd(), "data", "ai-providers-config.json")

// AI 服务商类型定义
export interface AIProviderConfig {
  id: string                    // 唯一标识（如 openai、anthropic）
  name: string                  // 显示名称（如 OpenAI GPT）
  enabled: boolean              // 是否启用
  apiKey: string                // API 密钥
  apiEndpoint?: string          // 自定义 API 端点（可选）
  organizationId?: string       // 组织 ID（OpenAI 专用）
  model?: string                // 默认模型
  maxTokens?: number            // 最大 Token 数
  balanceAlertThreshold?: number // 余额告警阈值（元）
  balanceAlertEnabled?: boolean  // 是否开启余额告警
  lastBalanceCheck?: string     // 上次余额查询时间
  lastBalance?: number          // 上次查询的余额
  notes?: string                // 备注
}

// 默认 AI 服务商列表
const DEFAULT_PROVIDERS: AIProviderConfig[] = [
  {
    id: "openai",
    name: "OpenAI (GPT)",
    enabled: false,
    apiKey: "",
    apiEndpoint: "https://api.openai.com/v1",
    model: "gpt-4o",
    maxTokens: 4096,
    balanceAlertThreshold: 10,
    balanceAlertEnabled: true,
  },
  {
    id: "anthropic",
    name: "Anthropic (Claude)",
    enabled: false,
    apiKey: "",
    apiEndpoint: "https://api.anthropic.com/v1",
    model: "claude-sonnet-4-20250514",
    maxTokens: 4096,
    balanceAlertThreshold: 10,
    balanceAlertEnabled: true,
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    enabled: false,
    apiKey: "",
    apiEndpoint: "https://api.deepseek.com/v1",
    model: "deepseek-chat",
    maxTokens: 4096,
    balanceAlertThreshold: 10,
    balanceAlertEnabled: true,
  },
  {
    id: "moonshot",
    name: "Moonshot (Kimi)",
    enabled: false,
    apiKey: "",
    apiEndpoint: "https://api.moonshot.cn/v1",
    model: "moonshot-v1-8k",
    maxTokens: 4096,
    balanceAlertThreshold: 10,
    balanceAlertEnabled: true,
  },
  {
    id: "groq",
    name: "Groq",
    enabled: true,
    apiKey: "",
    apiEndpoint: "https://api.groq.com/openai/v1",
    model: "llama3-8b-8192",
    maxTokens: 4096,
    balanceAlertThreshold: 0,
    balanceAlertEnabled: false,
    notes: "免费额度，无需余额监控",
  },
  {
    id: "coze",
    name: "Coze (扣子)",
    enabled: false,
    apiKey: "",
    apiEndpoint: "https://api.coze.cn/v1",
    model: "",
    maxTokens: 4096,
    balanceAlertThreshold: 10,
    balanceAlertEnabled: false,
  },
  {
    id: "qwen",
    name: "通义千问 (Qwen)",
    enabled: false,
    apiKey: "",
    apiEndpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    model: "qwen-turbo",
    maxTokens: 4096,
    balanceAlertThreshold: 10,
    balanceAlertEnabled: true,
  },
  {
    id: "zhipu",
    name: "智谱 (GLM)",
    enabled: false,
    apiKey: "",
    apiEndpoint: "https://open.bigmodel.cn/api/paas/v4",
    model: "glm-4-flash",
    maxTokens: 4096,
    balanceAlertThreshold: 10,
    balanceAlertEnabled: true,
  },
]

// 确保数据目录存在
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// 读取配置
function readConfig(): AIProviderConfig[] {
  ensureDataDir()
  if (!fs.existsSync(CONFIG_FILE)) {
    // 首次使用，写入默认配置
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_PROVIDERS, null, 2), "utf-8")
    return DEFAULT_PROVIDERS
  }
  try {
    const data = fs.readFileSync(CONFIG_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return DEFAULT_PROVIDERS
  }
}

// 写入配置
function writeConfig(providers: AIProviderConfig[]) {
  ensureDataDir()
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(providers, null, 2), "utf-8")
}

/**
 * GET - 获取所有 AI 服务商配置
 * 返回时隐藏 API Key 中间部分（安全考虑）
 */
export async function GET() {
  try {
    const providers = readConfig()
    // 脱敏处理：隐藏 API Key 中间部分
    const safeProviders = providers.map((p) => ({
      ...p,
      apiKey: p.apiKey ? maskApiKey(p.apiKey) : "",
      _hasKey: !!p.apiKey, // 标记是否已配置
    }))
    return NextResponse.json({ success: true, data: safeProviders })
  } catch (error) {
    return NextResponse.json({ success: false, error: "读取配置失败" }, { status: 500 })
  }
}

/**
 * POST - 保存/更新 AI 服务商配置
 * body: { providers: AIProviderConfig[] } 或 { provider: AIProviderConfig }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.providers) {
      // 批量更新全部
      const currentConfig = readConfig()
      const updatedProviders = body.providers.map((newProvider: AIProviderConfig) => {
        const existing = currentConfig.find((p) => p.id === newProvider.id)
        // 如果新提交的 apiKey 是脱敏的（包含 ***），则保留原始 key
        if (newProvider.apiKey && newProvider.apiKey.includes("***") && existing) {
          newProvider.apiKey = existing.apiKey
        }
        return { ...existing, ...newProvider }
      })
      writeConfig(updatedProviders)
      return NextResponse.json({ success: true, message: "配置已全部保存" })
    }

    if (body.provider) {
      // 单个更新
      const currentConfig = readConfig()
      const index = currentConfig.findIndex((p) => p.id === body.provider.id)
      if (index === -1) {
        // 新增
        currentConfig.push(body.provider)
      } else {
        // 更新（保留原始 apiKey 如果新值被脱敏）
        if (body.provider.apiKey && body.provider.apiKey.includes("***")) {
          body.provider.apiKey = currentConfig[index].apiKey
        }
        currentConfig[index] = { ...currentConfig[index], ...body.provider }
      }
      writeConfig(currentConfig)
      return NextResponse.json({ success: true, message: "配置已保存" })
    }

    return NextResponse.json({ success: false, error: "请提供 providers 或 provider 参数" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "保存配置失败" }, { status: 500 })
  }
}

/**
 * 脱敏 API Key：显示前4位和后4位，中间用 *** 代替
 */
function maskApiKey(key: string): string {
  if (key.length <= 8) return "****"
  return `${key.slice(0, 4)}***${key.slice(-4)}`
}
