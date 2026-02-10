import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, distributionService } from '@/lib/database'

/**
 * GET /api/distribution/commissions
 * 获取用户佣金记录
 * 参数：userId（必填）, page, limit, status
 */
export async function GET(request: NextRequest) {
  try {
    await initDatabase()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || undefined
    
    if (!userId) {
      return NextResponse.json({ code: 400, message: '缺少用户ID' }, { status: 400 })
    }
    
    const result = await distributionService.getUserCommissions(userId, page, limit, status)
    
    return NextResponse.json({ code: 200, data: result })
  } catch (error) {
    console.error('获取佣金记录失败:', error)
    return NextResponse.json({ code: 500, message: '获取失败' }, { status: 500 })
  }
}
