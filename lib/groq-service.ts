// AI分析服务 - 支持Gemini(图片) + Groq(文本)
// Gemini优先（支持真实图片分析），Groq降级

// AI面相分析核心提示词
const DEFAULT_FACE_PROMPT = `将他视为一个模拟的人，使用曾国藩《冰鉴》（骨形包含：颧骨、驿马骨、将军骨、日角骨、月角骨、龙宫骨、伏犀骨、龙角骨）、《周易》《燕翼子·相人》《骈拇子·卜相》的知识，进行面相五官（额头、眼睛、耳朵、鼻子、嘴巴、下巴、骨形）分析。

用MBTI测试、PDP测试、DISC测试、盖洛普测试，这个面相的会偏向属于什么类别：
- MBTI性格（16种类型）
- PDP性格（老虎、孔雀、无尾熊、猫头鹰、变色龙），以主性格+辅助性格分
- DISC性格（力量D、活跃I、和平S、完美C），以主性格+辅助性格分
- 盖洛普的前三大优势

要求：
1、用每本书的知识互相验证
2、描述详细清晰，深入分析，不要模棱两可
3、直接给是什么性格的答案，不要展示分析过程
4、用中文分析`

// JSON输出格式要求
const JSON_FORMAT = `
严格按照以下JSON格式返回：
{
  "overview": "整体性格概述（100字）",
  "mbti": {
    "type": "MBTI类型如ENTJ",
    "title": "中文名如指挥官",
    "dimensions": {
      "energy": "外向/内向分析",
      "information": "感觉/直觉分析",
      "decisions": "思考/情感分析",
      "lifestyle": "判断/感知分析"
    }
  },
  "pdp": {
    "primary": "主PDP类型",
    "secondary": "辅助PDP类型",
    "description": "描述"
  },
  "disc": {
    "primary": "主DISC类型",
    "secondary": "辅助DISC类型",
    "description": "描述"
  },
  "gallup": {
    "top3": ["优势1","优势2","优势3"],
    "description": "描述"
  },
  "faceAnalysis": {
    "forehead": "额头分析",
    "eyes": "眼睛分析",
    "nose": "鼻子分析",
    "mouth": "嘴巴分析",
    "chin": "下巴分析",
    "boneStructure": "骨形分析"
  },
  "facialExpressions": {
    "overall": "总结",
    "emotions": ["特质1","特质2","特质3"]
  }
}
只返回JSON。`

/**
 * 分析照片 - 优先Gemini，降级Groq
 */
export async function analyzePhotosWithGroq(photoUrls: string[]): Promise<any> {
  try {
    console.log("开始AI分析...")

    // 优先用Gemini（支持图片识别）
    if (process.env.GEMINI_API_KEY) {
      try {
        const result = await callGemini(photoUrls)
        if (result) return { code: 0, data: result }
      } catch (e) {
        console.warn("Gemini调用失败，降级到Groq:", e)
      }
    }

    // 降级到Groq（纯文本分析）
    if (process.env.GROQ_API_KEY) {
      try {
        const result = await callGroq()
        if (result) return { code: 0, data: result }
      } catch (e) {
        console.warn("Groq调用失败:", e)
      }
    }

    // 都失败则返回模拟数据
    console.warn("所有AI服务不可用，返回模拟数据")
    return { code: 2, message: "AI服务暂时不可用", data: getMockResult() }

  } catch (error) {
    console.error("AI分析异常:", error)
    return { code: 3, message: String(error), data: getMockResult() }
  }
}

/**
 * 调用Gemini API（支持图片分析）
 */
async function callGemini(photoUrls: string[]): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("Gemini API Key未配置")

  console.log("使用Gemini分析...")

  const prompt = DEFAULT_FACE_PROMPT + "\n\n" + JSON_FORMAT

  // 构建请求内容（文本+图片）
  const parts: any[] = [{ text: prompt }]

  // 如果有图片URL，尝试获取图片数据
  for (const url of photoUrls.slice(0, 1)) {
    if (url.startsWith('data:image')) {
      // Base64图片
      const base64Match = url.match(/data:image\/(.*?);base64,(.*)/)
      if (base64Match) {
        parts.push({
          inline_data: {
            mime_type: `image/${base64Match[1]}`,
            data: base64Match[2]
          }
        })
      }
    }
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000,
          responseMimeType: "application/json"
        }
      })
    }
  )

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Gemini API错误: ${response.status} ${errText.substring(0, 200)}`)
  }

  const data = await response.json()
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

  try {
    return JSON.parse(content)
  } catch {
    // 尝试提取JSON
    const match = content.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new Error("无法解析Gemini响应")
  }
}

/**
 * 调用Groq API（纯文本分析）
 */
async function callGroq(): Promise<any> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error("Groq API Key未配置")

  console.log("使用Groq分析...")

  const prompt = DEFAULT_FACE_PROMPT + "\n\n" + JSON_FORMAT

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "你是JSON响应助手。只返回有效JSON。" },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    }),
  })

  if (!response.ok) throw new Error(`Groq API错误: ${response.status}`)

  const data = await response.json()
  const content = data.choices[0]?.message?.content || ""
  return JSON.parse(content)
}

/**
 * 模拟结果（降级方案）
 */
function getMockResult() {
  return {
    overview: "基于面部特征分析，结合《冰鉴》骨形学，您展现出外向、善于思考的特质，具有较强的领导能力和决策力。",
    mbti: { type: "INTJ", title: "战略家", dimensions: { energy: "内向(I)", information: "直觉(N)", decisions: "思考(T)", lifestyle: "判断(J)" } },
    pdp: { primary: "老虎", secondary: "猫头鹰", description: "主导型老虎，辅助猫头鹰，果断+深思。" },
    disc: { primary: "D型(力量型)", secondary: "C型(完美型)", description: "力量型为主，追求结果，注重细节。" },
    gallup: { top3: ["战略", "统率", "成就"], description: "核心优势在战略思维和领导力。" },
    faceAnalysis: { forehead: "额头饱满，主智慧。", eyes: "目光有神，洞察力强。", nose: "鼻梁挺直，决策力强。", mouth: "嘴角上扬，乐观。", chin: "下巴方正，意志坚定。", boneStructure: "颧骨高耸，伏犀骨显露，大格局。" },
    facialExpressions: { overall: "整体表现自信坚定。", emotions: ["自信", "专注", "沉稳"] },
  }
}
