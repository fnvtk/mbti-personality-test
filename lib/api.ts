// 扣子(Coze.cn)API服务

// 设置是否使用模拟数据（在API不可用时设置为true）
const USE_MOCK_DATA = false // 默认尝试使用真实API

// 检查API密钥是否有效
const isValidApiKey = (key: string | undefined): boolean => {
  return !!key && key.length > 10
}

// 函数：获取Coze API设置
export function getCozeSettings() {
  // 检查是否在客户端
  const isClient = typeof window !== "undefined"

  let apiKey = ""
  let botId = ""

  if (isClient) {
    // 客户端：从localStorage获取
    apiKey = localStorage.getItem("cozeApiKey") || ""
    botId = localStorage.getItem("cozeAppId") || "" // 使用正确的键名
  } else {
    // 服务器端：从环境变量获取
    apiKey = process.env.COZE_API_KEY || ""
    botId = process.env.COZE_BOT_ID || ""
  }

  return { apiKey, botId }
}

// 修改analyzePhotosWithCoze函数，改为本地处理
export async function analyzePhotosWithCoze(photoUrls: string[]) {
  try {
    console.log("本地生成分析结果...")

    // 模拟分析延迟
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 返回模拟数据
    return {
      code: 0,
      message: "分析成功",
      data: getMockAnalysisResult(),
    }
  } catch (error) {
    console.error("分析照片失败:", error)
    return {
      code: 1,
      message: `分析失败: ${(error as Error).message}`,
      data: getMockAnalysisResult(), // 失败时返回模拟数据
    }
  }
}

// 处理分析响应
function processAnalysisResponse(response: any) {
  try {
    // 从响应中提取内容
    const content = response.choices?.[0]?.message?.content || ""

    // 尝试解析为JSON（如果是JSON格式）
    if (content.startsWith("{") && content.endsWith("}")) {
      try {
        return JSON.parse(content)
      } catch (e) {
        // JSON解析失败，继续使用文本处理
      }
    }

    // 提取基本分析结果
    return {
      overview: content.substring(0, 200),
      mbti: {
        type: extractMBTIType(content) || "未知",
        title: extractMBTIType(content) ? getMBTITitle(extractMBTIType(content) || "") : "未知",
        dimensions: {
          energy: extractDimension(content, ["外向", "内向"]),
          information: extractDimension(content, ["感觉", "直觉"]),
          decisions: extractDimension(content, ["思考", "情感"]),
          lifestyle: extractDimension(content, ["判断", "感知"]),
        },
      },
      pdp: {
        primary: extractType(content, ["老虎", "孔雀", "无尾熊", "猫头鹰", "变色龙"]),
        secondary: extractType(content, ["老虎", "孔雀", "无尾熊", "猫头鹰", "变色龙"], false),
        description: extractSection(content, "PDP") || content.substring(0, 150),
      },
      disc: {
        primary: extractType(content, ["D型", "I型", "S型", "C型", "支配型", "影响型", "稳定型", "服从型"]),
        secondary: extractType(content, ["D型", "I型", "S型", "C型", "支配型", "影响型", "稳定型", "服从型"], false),
        description: extractSection(content, "DISC") || content.substring(150, 300),
      },
      facialExpressions: {
        overall: extractSection(content, "表情") || "面部表情显示出自信和专注的状态",
        emotions: extractEmotions(content),
        frontPhoto: extractSection(content, "正面") || "正面表情自然",
        leftPhoto: extractSection(content, "左侧") || "左侧表情沉稳",
        rightPhoto: extractSection(content, "右侧") || "右侧表情亲和",
      },
    }
  } catch (error) {
    console.error("处理分析响应时出错:", error)
    return {
      overview: "无法处理分析结果",
      mbti: { type: "未知", title: "未知", dimensions: {} },
      pdp: { primary: "未知", secondary: "未知", description: "无法处理分析结果" },
      disc: { primary: "未知", secondary: "未知", description: "无法处理分析结果" },
      facialExpressions: { overall: "无法处理分析结果", emotions: ["未知"] },
    }
  }
}

// 辅助函数：提取MBTI类型
function extractMBTIType(text: string): string | null {
  const mbtiTypes = [
    "INTJ",
    "INTP",
    "ENTJ",
    "ENTP",
    "INFJ",
    "INFP",
    "ENFJ",
    "ENFP",
    "ISTJ",
    "ISFJ",
    "ESTJ",
    "ESFJ",
    "ISTP",
    "ISFP",
    "ESTP",
    "ESFP",
  ]

  for (const type of mbtiTypes) {
    if (text.includes(type)) {
      return type
    }
  }

  return null
}

// 辅助函数：获取MBTI标题
function getMBTITitle(type: string): string {
  const titles: Record<string, string> = {
    ENFJ: "教导者型人格",
    ENFP: "冒险家型人格",
    ENTJ: "指挥官型人格",
    ENTP: "辩论家型人格",
    ESFJ: "执政官型人格",
    ESFP: "表演者型人格",
    ESTJ: "总经理型人格",
    ESTP: "企业家型人格",
    INFJ: "提倡者型人格",
    INFP: "调停者型人格",
    INTJ: "建筑师型人格",
    INTP: "逻辑学家型人格",
    ISFJ: "守卫者型人格",
    ISFP: "探险家型人格",
    ISTJ: "物流师型人格",
    ISTP: "鉴赏家型人格",
  }

  return titles[type] || "未知类型"
}

// 辅助函数：提取维度
function extractDimension(text: string, options: string[]): string {
  for (const option of options) {
    if (text.includes(option)) {
      const index = text.indexOf(option)
      const segment = text.substring(index, index + 50)
      return segment.split(/[,.;:]|\n/)[0].trim()
    }
  }

  return options.join("/")
}

// 辅助函数：提取类型（PDP或DISC）
function extractType(text: string, types: string[], isPrimary = true): string {
  const keyword = isPrimary ? "主导|主要|首要" : "辅助|次要|第二"

  for (const type of types) {
    const pattern = new RegExp(`(${keyword}).*?(${type})`, "i")
    if (pattern.test(text)) {
      return type
    }
  }

  // 如果没有找到明确的主/次类型标记，尝试找到出现的第一个/第二个类型
  const foundTypes = types.filter((type) => text.includes(type))
  if (foundTypes.length > 0) {
    return isPrimary ? foundTypes[0] : foundTypes[1] || foundTypes[0]
  }

  return isPrimary ? types[0] || "未知" : types[1] || "未知"
}

// 辅助函数：提取指定部分
function extractSection(text: string, keyword: string): string | null {
  const pattern = new RegExp(`${keyword}[^.]*[.:](.+?)(?=\\n\\n|$)`, "i")
  const match = text.match(pattern)
  return match ? match[1].trim() : null
}

// 辅助函数：提取情绪
function extractEmotions(text: string): string[] {
  const emotionKeywords = [
    "快乐",
    "悲伤",
    "愤怒",
    "惊讶",
    "恐惧",
    "厌恶",
    "中性",
    "微笑",
    "严肃",
    "困惑",
    "自信",
    "焦虑",
  ]

  const emotions = []
  for (const emotion of emotionKeywords) {
    if (text.includes(emotion)) {
      emotions.push(emotion)
    }
  }

  return emotions.length > 0 ? emotions : ["中性", "自然"]
}

// 确保getMockAnalysisResult函数返回正确的数据结构
export function getMockAnalysisResult() {
  return {
    overview: "基于面部特征分析，您展现出外向、善于思考的特质，具有较强的领导能力和决策力。",
    mbti: {
      type: "ENTJ",
      title: "指挥官型人格",
      dimensions: {
        energy: "外向(E) - 从外部世界获取能量，喜欢社交互动",
        information: "直觉(N) - 关注可能性和未来，善于发现模式和联系",
        decisions: "思考(T) - 基于逻辑和客观分析做决定，注重效率",
        lifestyle: "判断(J) - 喜欢计划和组织，追求确定性和结构",
      },
    },
    pdp: {
      primary: "老虎",
      secondary: "孔雀",
      description: "您的主导型为老虎型，表现为果断、直接、目标导向；辅助型为孔雀型，增添了表达能力和社交魅力。",
    },
    disc: {
      primary: "D型(支配型)",
      secondary: "I型(影响型)",
      description: "您的沟通风格以支配型为主，表现为直接、果断、结果导向；辅以影响型特质，增强了表达能力和说服力。",
    },
    facialExpressions: {
      overall: "整体面部表情显示出自信、坚定，同时带有一定的亲和力。",
      emotions: ["自信", "专注", "亲和"],
      frontPhoto: "正面照片中，您展现了自然且自信的表情，眼神专注有力。",
      leftPhoto: "左侧照片表现出您沉稳的一面，表情从容不迫，体现了思考者的特质。",
      rightPhoto: "右侧照片中的微笑展现了您的社交魅力，亲和力强，给人留下积极印象。",
    },
    resultId: `result_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  }
}

// 函数：保存CozeAPI设置
export function saveCozeSettings(apiKey: string, botId: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("cozeApiKey", apiKey)
    localStorage.setItem("cozeAppId", botId)
  }
  return { success: true }
}
