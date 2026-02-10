import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, orderService } from '@/lib/database'

/**
 * GET /api/admin/orders
 * 获取订单列表和统计（从MongoDB读取真实数据）
 */
export async function GET(request: NextRequest) {
  try {
    await initDatabase()
    
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || ''
    const productType = searchParams.get('productType') || ''
    const search = searchParams.get('search') || ''
    
    // 获取统计数据
    const stats = await orderService.getStats()
    
    // 获取订单列表（真实数据库查询）
    let orders: any[] = []
    let total = 0
    
    try {
      // 尝试从MongoDB获取真实订单
      const { isConnected } = require('@/lib/db')
      if (isConnected()) {
        const Order = require('@/lib/models/Order').default
        const query: any = {}
        if (status) query.status = status
        if (productType) query.productType = productType
        if (search) {
          query.$or = [
            { orderId: { $regex: search, $options: 'i' } },
            { userId: { $regex: search, $options: 'i' } }
          ]
        }
        
        total = await Order.countDocuments(query)
        orders = await Order.find(query)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean()
      }
    } catch (dbError) {
      console.warn('MongoDB订单查询失败:', dbError)
    }
    
    return NextResponse.json({
      code: 200,
      data: {
        stats,
        orders,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
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
