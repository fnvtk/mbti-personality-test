import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, orderService } from '@/lib/database'

/**
 * GET /api/payment/query?orderId=xxx
 * 查询订单支付状态
 */
export async function GET(request: NextRequest) {
  try {
    await initDatabase()
    
    const orderId = request.nextUrl.searchParams.get('orderId')
    
    if (!orderId) {
      return NextResponse.json({
        code: 400,
        message: '缺少订单ID'
      }, { status: 400 })
    }
    
    const order = await orderService.getOrder(orderId)
    
    if (!order) {
      return NextResponse.json({
        code: 404,
        message: '订单不存在'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      code: 200,
      data: {
        orderId: order.orderId,
        status: order.status,
        amount: order.amount,
        productType: order.productType,
        productDetail: order.productDetail,
        paymentMethod: order.paymentMethod,
        paidAt: order.paidAt,
        createdAt: order.createdAt
      }
    })
    
  } catch (error) {
    console.error('查询订单失败:', error)
    return NextResponse.json({
      code: 500,
      message: '查询失败'
    }, { status: 500 })
  }
}
