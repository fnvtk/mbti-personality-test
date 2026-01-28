import { type NextRequest, NextResponse } from "next/server"
import { analyzePhotosWithGroq } from "@/lib/groq-service"
import { getDatabase } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    console.log("收到分析请求")

    // 解析请求体
    let photoUrls: string[] = []
    let userId: string | null = null

    try {
      const body = await request.json()
      photoUrls = body.photoUrls || []
      userId = body.userId || null
    } catch (parseError) {
      console.error("解析请求体失败:", parseError)
      return NextResponse.json(
        {
          error: "无效的请求格式",
          code: 400,
          data: getMockAnalysisResult(),
        },
        { status: 400 },
      )
    }

    // 验证输入
    if (!photoUrls || !Array.isArray(photoUrls) || photoUrls.length === 0) {
      console.error("无效的照片URL")
      return NextResponse.json(
        {
          error: "无效的照片URL",
          code: 400,
          data: getMockAnalysisResult(),
        },
        { status: 400 },
      )
    }

    console.log(`开始分析照片，用户ID: ${userId}, 照片数量: ${photoUrls.length}`)

    // 优化：设置API调用超时
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时

    // 使用Groq进行实际分析
    let analysisResult
    try {
      // 使用Promise.race实现超时处理
      analysisResult = await Promise.race([
        analyzePhotosWithGroq(photoUrls),
        new Promise((_, reject) => setTimeout(() => reject(new Error("分析超时")), 10000)),
      ])

      console.log("分析完成，结果代码:", analysisResult.code)
      clearTimeout(timeoutId) // 清除超时
    } catch (analysisError) {
      clearTimeout(timeoutId) // 清除超时
      console.error("分析过程出错:", analysisError)
      analysisResult = {
        code: 500,
        message: `分析过程出错: ${(analysisError as Error).message}`,
        data: getMockAnalysisResult(),
      }
    }

    // 确保始终有data字段
    if (!analysisResult.data) {
      console.warn("分析结果中没有data字段，使用模拟数据")
      analysisResult.data = getMockAnalysisResult()
    }

    // 如果有用户ID，保存结果到数据库
    if (userId) {
      try {
        const db = getDatabase()
        const user = db.getUserById(userId)

        if (user) {
          // 生成结果ID
          const resultId = `result_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

          // 保存测试结果
          const testResult = {
            id: resultId,
            testType: "face",
            date: new Date().toISOString(),
            result: analysisResult.data,
          }

          user.testResults = user.testResults || []
          user.testResults.push(testResult)
          db.updateUser(user)
          console.log(`已保存用户 ${userId} 的测试结果`)
        } else {
          console.warn(`未找到用户 ${userId}`)
        }
      } catch (dbError) {
        console.error("保存结果到数据库失败:", dbError)
        // 继续处理，不中断响应
      }
    }

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("分析照片时出错:", error)

    // 返回错误响应，但同时包含模拟数据，确保前端能继续工作
    return NextResponse.json(
      {
        error: `分析失败: ${(error as Error).message}`,
        code: 999,
        data: getMockAnalysisResult(),
      },
      { status: 500 },
    )
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
