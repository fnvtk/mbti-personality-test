import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, orderService } from '@/lib/database'
import { isConnected } from '@/lib/db'
import Order from '@/lib/models/Order'

/**
 * GET /api/admin/orders
 * 获取订单数据（管理后台）
 * type=stats 获取统计 | type=list 获取列表
 */
export async function GET(request: NextRequest) {
  try {
    await initDatabase()
    
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'stats'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // 统计数据
    if (type === 'stats') {
      const stats = await orderService.getStats()
      return NextResponse.json({ code: 200, data: stats })
    }
    
    // 订单列表
    if (type === 'list') {
      const status = searchParams.get('status') || ''
      const productType = searchParams.get('productType') || ''
      const search = searchParams.get('search') || ''
      
      if (isConnected()) {
        const query: any = {}
        if (status) query.status = status
        if (productType) query.productType = productType
        if (search) {
          query.$or = [
            { orderId: { $regex: search, $options: 'i' } },
            { userId: { $regex: search, $options: 'i' } },
            { openId: { $regex: search, $options: 'i' } }
          ]
        }
        
        const total = await Order.countDocuments(query)
        const orders = await Order.find(query)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
        
        return NextResponse.json({
          code: 200,
          data: { orders, total, page, limit, pages: Math.ceil(total / limit) }
        })
      }
      
      return NextResponse.json({
        code: 200,
        data: { orders: [], total: 0, page, limit, pages: 0 }
      })
    }
    
    // 默认返回统计
    const stats = await orderService.getStats()
    return NextResponse.json({ code: 200, data: stats })
    
  } catch (error) {
    console.error('获取订单数据失败:', error)
    return NextResponse.json({
      code: 500,
      message: '获取订单数据失败'
    }, { status: 500 })
  }
}
