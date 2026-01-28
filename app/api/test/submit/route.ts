import { NextRequest, NextResponse } from 'next/server'
import { MBTICalculator, ITestAnswer } from '@/lib/mbti-calculator'
import { v4 as uuidv4 } from 'uuid'

/**
 * POST /api/test/submit
 * 提交MBTI测试答案并计算结果
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers, testDuration, userId, sessionId } = body

    // 验证答案数量
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({
        success: false,
        message: '答案格式无效'
      }, { status: 400 })
    }

    // 转换答案格式
    const formattedAnswers: ITestAnswer[] = answers.map((answer: any) => ({
      questionId: answer.questionId,
      selectedOption: answer.selectedOption,
      dimension: answer.dimension
    }))

    // 验证答案有效性
    const validation = MBTICalculator.validateAnswers(formattedAnswers)
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        message: '测试答案验证失败',
        errors: validation.errors
      }, { status: 400 })
    }

    // 计算MBTI结果
    const result = MBTICalculator.calculateMBTIResult(formattedAnswers)

    // 生成会话ID
    const finalSessionId = sessionId || (!userId ? uuidv4() : undefined)

    // 构建响应数据
    const responseData = {
      resultId: uuidv4(),
      sessionId: finalSessionId,
      mbtiType: result.mbtiType,
      description: result.description,
      dimensionScores: result.dimensionScores,
      confidence: result.confidence,
      dominantDimensions: result.dominantDimensions,
      dimensionStrengths: result.dimensionStrengths,
      testDuration: testDuration || 0,
      completedAt: new Date().toISOString()
    }

    // TODO: 保存到数据库 (当MongoDB配置后启用)
    // await connectDB()
    // const testResult = new TestResult({ ... })
    // await testResult.save()

    return NextResponse.json({
      success: true,
      message: '测试提交成功',
      data: responseData
    }, { status: 201 })

  } catch (error) {
    console.error('提交测试失败:', error)
    return NextResponse.json({
      success: false,
      message: '服务器内部错误',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 })
  }
}
