export const dbConfig = {
  connectionString: process.env.MONGODB_URI || "mongodb://localhost:27017/mbti_test",
}

export const apiConfig = {
  baseUrl: process.env.API_BASE_URL || "http://localhost:3000",
}

export const authConfig = {
  tokenKey: "authToken",
  userIdKey: "currentUserId",
}

export const blobConfig = {
  baseUrl: "https://blob.vercel-storage.com",
}

export const aiConfig = {
  groqApiKey: process.env.GROQ_API_KEY || "",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  // Coze已弃用，保留字段兼容
  cozeApiKey: process.env.COZE_API_KEY || "",
  cozeBotId: process.env.COZE_BOT_ID || "",
}

export const groqConfig = {
  apiKey: process.env.GROQ_API_KEY || "",
  model: "llama3-8b-8192",
}

/**
 * 动态 AI 配置读取（从超管配置文件）
 * 优先级：超管配置 > 环境变量 > 默认值
 * 
 * 使用方式：
 * const config = getAIProviderConfig("openai")
 * if (config?.enabled && config?.apiKey) { // 调用 OpenAI API }
 */
export function getAIProviderConfig(providerId: string) {
  try {
    const fs = require("fs")
    const path = require("path")
    const configFile = path.join(process.cwd(), "data", "ai-providers-config.json")
    if (!fs.existsSync(configFile)) return null
    const configs = JSON.parse(fs.readFileSync(configFile, "utf-8"))
    return configs.find((p: any) => p.id === providerId) || null
  } catch {
    return null
  }
}

/**
 * 获取当前启用的 AI 服务商列表
 */
export function getEnabledAIProviders() {
  try {
    const fs = require("fs")
    const path = require("path")
    const configFile = path.join(process.cwd(), "data", "ai-providers-config.json")
    if (!fs.existsSync(configFile)) return []
    const configs = JSON.parse(fs.readFileSync(configFile, "utf-8"))
    return configs.filter((p: any) => p.enabled && p.apiKey)
  } catch {
    return []
  }
}
