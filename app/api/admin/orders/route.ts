import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, orderService } from '@/lib/database'

/**
 * GET /api/admin/orders
 * 获取订单列表（管理后台）
 */
export async function GET(request: NextRequest) {
  try {
    await initDatabase()
    
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    const stats = await orderService.getStats()
    
    return NextResponse.json({
      code: 200,
      data: {
        stats,
        page,
        limit
      }
    })
    
  } catch (error) {
    console.error('获取订单列表失败:', error)
    return NextResponse.json({
      code: 500,
      message: '获取订单列表失败'
    }, { status: 500 })
  }
}
