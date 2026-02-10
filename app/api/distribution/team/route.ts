import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, distributionService } from '@/lib/database'

/**
 * GET /api/distribution/team
 * 获取用户团队成员
 * 参数：userId（必填）, level (1|2), page, limit
 */
export async function GET(request: NextRequest) {
  try {
    await initDatabase()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const level = parseInt(searchParams.get('level') || '1') as 1 | 2
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    if (!userId) {
      return NextResponse.json({ code: 400, message: '缺少用户ID' }, { status: 400 })
    }
    
    const result = await distributionService.getTeamMembers(userId, level, page, limit)
    
    return NextResponse.json({ code: 200, data: result })
  } catch (error) {
    console.error('获取团队成员失败:', error)
    return NextResponse.json({ code: 500, message: '获取失败' }, { status: 500 })
  }
}
