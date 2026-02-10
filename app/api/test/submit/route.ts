import { NextRequest, NextResponse } from 'next/server'
import { MBTICalculator, ITestAnswer } from '@/lib/mbti-calculator'
import { initDatabase, testResultService } from '@/lib/database'
import { v4 as uuidv4 } from 'uuid'

/**
 * POST /api/test/submit
 * 提交MBTI测试答案并计算结果
 */
export async function POST(request: NextRequest) {
  try {
    await initDatabase()
    
    const body = await request.json()
    const { answers, testDuration, userId, sessionId, testType } = body

    // 验证答案数量
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({
        success: false,
        message: '答案格式无效'
      }, { status: 400 })
    }

    // MBTI测试：完整验证
    if (!testType || testType === 'mbti') {
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

      // 保存到数据库
      try {
        await testResultService.saveResult({
          userId: userId || undefined,
          sessionId: finalSessionId,
          answers: formattedAnswers,
          dimensionScores: result.dimensionScores,
          mbtiType: result.mbtiType,
          confidence: result.confidence,
          testDuration: testDuration || 0,
          ipAddress: request.headers.get('x-forwarded-for') || '',
          userAgent: request.headers.get('user-agent') || ''
        })
      } catch (dbError) {
        console.warn('保存测试结果到数据库失败（不影响返回）:', dbError)
      }

      return NextResponse.json({
        success: true,
        message: '测试提交成功',
        data: responseData
      }, { status: 201 })
    }

    // DISC/PDP/AI等其他测试类型：直接保存结果
    const resultId = uuidv4()
    const responseData = {
      resultId,
      testType,
      ...body.result,
      testDuration: testDuration || 0,
      completedAt: new Date().toISOString()
    }

    // 保存到数据库
    try {
      await testResultService.saveResult({
        userId: userId || undefined,
        sessionId: sessionId || uuidv4(),
        testType,
        result: body.result,
        testDuration: testDuration || 0,
        mbtiType: body.result?.type || body.result?.mbtiType || 'N/A',
        confidence: body.result?.confidence || 0,
        dimensionScores: body.result?.dimensionScores || { E: 50, I: 50, S: 50, N: 50, T: 50, F: 50, J: 50, P: 50 },
        answers: answers || []
      })
    } catch (dbError) {
      console.warn('保存测试结果到数据库失败:', dbError)
    }

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
