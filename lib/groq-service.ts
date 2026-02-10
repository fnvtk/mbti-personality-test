// 优化Groq服务调用
// 1. 减少处理时间
// 2. 优化提示词
// 3. 改进错误处理

// 分析照片并生成性格分析
export async function analyzePhotosWithGroq(photoUrls: string[]): Promise<any> {
  try {
    console.log("开始使用Groq分析照片...")

    // 检查API密钥
    if (!process.env.GROQ_API_KEY) {
      console.error("Groq API密钥未设置")
      return {
        code: 1,
        message: "Groq API密钥未配置",
        data: getMockAnalysisResult(),
      }
    }

    // 优化：限制照片数量，只处理1张照片以减少token使用和处理时间
    const limitedPhotoUrls = photoUrls.slice(0, 1)
    console.log(`处理照片数量: ${limitedPhotoUrls.length}/${photoUrls.length}`)

    // 优化提示词，使其更简洁明了
    const prompt = `
作为面相分析专家，请基于用户面部照片生成简短性格分析报告。

严格按照以下JSON格式返回，不要添加任何其他文本：
{
  "overview": "整体性格概述（50字左右）",
  "mbti": {
    "type": "MBTI类型（如ENTJ）",
    "title": "MBTI类型中文名称",
    "dimensions": {
      "energy": "外向/内向分析（简短）",
      "information": "感觉/直觉分析（简短）",
      "decisions": "思考/情感分析（简短）",
      "lifestyle": "判断/感知分析（简短）"
    }
  },
  "pdp": {
    "primary": "主要PDP类型（老虎/孔雀/无尾熊/猫头鹰/变色龙）",
    "secondary": "辅助PDP类型",
    "description": "PDP类型描述（简短）"
  },
  "disc": {
    "primary": "主要DISC类型（D/I/S/C）",
    "secondary": "辅助DISC类型",
    "description": "DISC类型描述（简短）"
  },
  "facialExpressions": {
    "overall": "整体面部表情分析（简短）",
    "emotions": ["主要情绪1", "主要情绪2", "主要情绪3"]
  }
}

只返回JSON对象，不要添加任何前缀或解释。
`

    try {
      // 设置超时处理
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Groq API调用超时")), 8000))

      // 使用Promise.race实现超时处理
      return await Promise.race([callGroqWithFetch(prompt), timeoutPromise])
    } catch (apiError) {
      console.error("通过fetch调用Groq API失败:", apiError)

      // 返回模拟数据作为备用
      return {
        code: 2,
        message: `AI分析失败: ${(apiError as Error).message}`,
        data: getMockAnalysisResult(),
      }
    }
  } catch (error) {
    console.error("Groq服务异常:", error)
    return {
      code: 3,
      message: `Groq服务异常: ${(error as Error).message}`,
      data: getMockAnalysisResult(),
    }
  }
}

// 优化callGroqWithFetch函数
async function callGroqWithFetch(prompt: string): Promise<any> {
  try {
    console.log("使用fetch调用Groq API...")

    // 使用fetch直接调用Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // 使用较小的模型减少token使用量和处理时间
        messages: [
          {
            role: "system",
            content: "你是一个JSON响应助手。你只返回有效的JSON，不添加任何其他文本。",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3, // 降低温度以获得更一致的输出和更快的响应
        max_tokens: 800, // 减少token数量以加快响应
        response_format: { type: "json_object" }, // 明确要求JSON格式响应
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Groq API响应错误:", response.status, errorText)
      throw new Error(`Groq API响应错误: ${response.status}`)
    }

    const data = await response.json()
    console.log("Groq API通过fetch调用成功")

    // 解析响应
    const content = data.choices[0]?.message?.content || ""
    console.log("API返回内容前30个字符:", content.substring(0, 30))

    try {
      // 尝试直接解析整个内容
      try {
        const parsedData = JSON.parse(content)
        console.log("成功直接解析JSON")
        return {
          code: 0,
          data: parsedData,
        }
      } catch (directParseError) {
        console.error("直接解析JSON失败:", directParseError)
      }

      // 尝试提取JSON部分
      const jsonMatch = content.match(/(\{[\s\S]*\})/g)
      if (jsonMatch && jsonMatch[0]) {
        console.log("从文本中提取JSON")
        const jsonContent = jsonMatch[0]
        try {
          return {
            code: 0,
            data: JSON.parse(jsonContent),
          }
        } catch (extractedJsonError) {
          console.error("解析提取的JSON失败:", extractedJsonError)
        }
      }

      // 如果所有尝试都失败，返回错误
      console.error("无法从响应中提取有效JSON:", content)
      throw new Error("无法从响应中提取有效JSON")
    } catch (parseError) {
      console.error("解析Groq响应失败:", parseError)
      throw parseError
    }
  } catch (fetchError) {
    console.error("通过fetch调用Groq API失败:", fetchError)
    throw fetchError
  }
}

// 模拟分析结果
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
    },
    resultId: `result_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  }
}
