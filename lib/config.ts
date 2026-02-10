export const dbConfig = {
  connectionString:
    process.env.POSTGRES_URL ||
    "postgresql://mbti_owner:npg_XaJv15dkqwuD@ep-fragrant-union-a4ndg6o8-pooler.us-east-1.aws.neon.tech/mbti?sslmode=require",
}

export const apiConfig = {
  baseUrl: process.env.API_BASE_URL || "https://ai-pandora.xyz",
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
}

export const groqConfig = {
  apiKey: process.env.GROQ_API_KEY || "",
  model: "llama2-70b-4096",
}
