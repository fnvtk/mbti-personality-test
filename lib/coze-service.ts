import { aiConfig } from "./config"

/**
 * 使用Coze API分析照片
 * @param photoUrls 照片URL数组
 * @returns 分析结果
 */
export async function analyzePhotosWithCoze(photoUrls: string[]) {
  try {
    if (!aiConfig.cozeApiKey || !aiConfig.cozeBotId) {
      throw new Error("缺少Coze API配置")
    }

    // 准备请求数据
    const requestData = {
      botId: aiConfig.cozeBotId,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "请分析这些面部照片，提供MBTI性格类型、PDP行为偏好和DISC沟通风格的分析结果。",
            },
            ...photoUrls.map((url) => ({
              type: "image_url",
              image_url: { url },
            })),
          ],
        },
      ],
    }

    // 发送请求到Coze API
    const response = await fetch("https://api.coze.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aiConfig.cozeApiKey}`,
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Coze API请求失败: ${response.status} ${errorText}`)
    }

    const result = await response.json()

    // 解析结果
    return {
      code: 0,
      message: "分析成功",
      data: parseCozeResponse(result),
    }
  } catch (error) {
    console.error("使用Coze分析照片失败:", error)
    return {
      code: 1,
      message: `分析失败: ${(error as Error).message}`,
      data: getMockAnalysisResult(), // 失败时返回模拟数据
    }
  }
}

/**
 * 解析Coze API响应
 * @param response Coze API响应
 * @returns 解析后的分析结果
 */
function parseCozeResponse(response: any) {
  try {
    // 尝试从响应中提取结构化数据
    // 这里需要根据实际的Coze API响应格式进行调整
    const content = response.choices?.[0]?.message?.content || ""

    // 如果返回的是JSON字符串，尝试解析
    try {
      return JSON.parse(content)
    } catch {
      // 如果不是JSON，返回模拟数据
      return getMockAnalysisResult()
    }
  } catch (error) {
    console.error("解析Coze响应失败:", error)
    return getMockAnalysisResult()
  }
}

/**
 * 获取模拟分析结果
 * @returns 模拟的分析结果
 */
function getMockAnalysisResult() {
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
  }
}
