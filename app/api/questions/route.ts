import { NextRequest, NextResponse } from 'next/server'
import { mbtiQuestions } from '@/data/mbti-questions'

/**
 * GET /api/questions
 * 获取MBTI测试题库
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dimension = searchParams.get('dimension')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '90')

    let questions = [...mbtiQuestions]

    // 按维度筛选
    if (dimension && ['EI', 'SN', 'TF', 'JP'].includes(dimension)) {
      questions = questions.filter(q => q.dimension === dimension)
    }

    // 分页
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedQuestions = questions.slice(startIndex, endIndex)

    // 统计各维度题目数量
    const dimensionCounts = {
      EI: mbtiQuestions.filter(q => q.dimension === 'EI').length,
      SN: mbtiQuestions.filter(q => q.dimension === 'SN').length,
      TF: mbtiQuestions.filter(q => q.dimension === 'TF').length,
      JP: mbtiQuestions.filter(q => q.dimension === 'JP').length,
    }

    return NextResponse.json({
      success: true,
      data: {
        questions: paginatedQuestions,
        total: questions.length,
        page,
        limit,
        totalPages: Math.ceil(questions.length / limit),
        dimensionCounts
      }
    })

  } catch (error) {
    console.error('获取题库失败:', error)
    return NextResponse.json({
      success: false,
      message: '服务器内部错误'
    }, { status: 500 })
  }
}
