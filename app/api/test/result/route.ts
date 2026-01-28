import { NextRequest, NextResponse } from 'next/server'
import { mbtiDescriptions } from '@/data/mbti-descriptions'
import { MBTI_DESCRIPTIONS } from '@/lib/mbti-calculator'

/**
 * GET /api/test/result
 * 获取MBTI类型详细描述
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mbtiType = searchParams.get('type')?.toUpperCase()

    // 验证MBTI类型
    const validTypes = [
      'INTJ', 'INTP', 'ENTJ', 'ENTP',
      'INFJ', 'INFP', 'ENFJ', 'ENFP',
      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
      'ISTP', 'ISFP', 'ESTP', 'ESFP'
    ]

    if (!mbtiType || !validTypes.includes(mbtiType)) {
      return NextResponse.json({
        success: false,
        message: '无效的MBTI类型',
        validTypes
      }, { status: 400 })
    }

    // 获取类型描述
    const description = mbtiDescriptions[mbtiType as keyof typeof mbtiDescriptions]
    const basicInfo = MBTI_DESCRIPTIONS[mbtiType as keyof typeof MBTI_DESCRIPTIONS]

    if (!description) {
      return NextResponse.json({
        success: false,
        message: '未找到该类型的详细描述'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        type: mbtiType,
        name: basicInfo?.name || description.title,
        category: basicInfo?.category || '未分类',
        ...description
      }
    })

  } catch (error) {
    console.error('获取结果详情失败:', error)
    return NextResponse.json({
      success: false,
      message: '服务器内部错误'
    }, { status: 500 })
  }
}

/**
 * GET /api/test/result/all
 * 获取所有MBTI类型概览
 */
export async function POST(request: NextRequest) {
  try {
    const allTypes = Object.entries(mbtiDescriptions).map(([type, desc]) => ({
      type,
      name: MBTI_DESCRIPTIONS[type as keyof typeof MBTI_DESCRIPTIONS]?.name || desc.title,
      category: MBTI_DESCRIPTIONS[type as keyof typeof MBTI_DESCRIPTIONS]?.category || '未分类',
      description: desc.description.slice(0, 100) + '...',
      careers: desc.careers.slice(0, 3)
    }))

    // 按类别分组
    const byCategory: Record<string, typeof allTypes> = {}
    allTypes.forEach(item => {
      if (!byCategory[item.category]) {
        byCategory[item.category] = []
      }
      byCategory[item.category].push(item)
    })

    return NextResponse.json({
      success: true,
      data: {
        types: allTypes,
        byCategory,
        totalTypes: allTypes.length
      }
    })

  } catch (error) {
    console.error('获取所有类型失败:', error)
    return NextResponse.json({
      success: false,
      message: '服务器内部错误'
    }, { status: 500 })
  }
}
