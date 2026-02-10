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
