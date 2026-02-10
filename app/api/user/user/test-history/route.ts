import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, testResultService } from '@/lib/database'
import { authenticateRequest } from '@/lib/jwt'

/**
 * GET /api/user/test-history
 * 获取用户测试历史
 */
export async function GET(request: NextRequest) {
  try {
    await initDatabase()
    
    const auth = authenticateRequest(request.headers.get('authorization'))
    if (!auth) {
      return NextResponse.json({
        code: 401,
        message: '未登录'
      }, { status: 401 })
    }
    
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20')
    
    const result = await testResultService.getUserResults(auth.userId, page, limit)
    
    return NextResponse.json({
      code: 200,
      data: result
    })
    
  } catch (error) {
    console.error('获取测试历史失败:', error)
    return NextResponse.json({
      code: 500,
      message: '获取测试历史失败'
    }, { status: 500 })
  }
}
