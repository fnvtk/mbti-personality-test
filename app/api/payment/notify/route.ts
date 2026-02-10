import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, orderService, userService, distributionService } from '@/lib/database'

/**
 * POST /api/payment/notify
 * 微信支付回调通知 / 客户端支付成功通知
 */
export async function POST(request: NextRequest) {
  try {
    await initDatabase()
    
    const body = await request.json()
    const { orderId, prepayId, status } = body
    
    if (!orderId) {
      return NextResponse.json({
        code: 400,
        message: '缺少订单ID'
      }, { status: 400 })
    }
    
    // 查找订单
    const order = await orderService.getOrder(orderId)
    
    if (!order) {
      return NextResponse.json({
        code: 404,
        message: '订单不存在'
      }, { status: 404 })
    }
    
    // 更新订单状态
    if (status === 'success') {
      await orderService.updateOrderStatus(orderId, 'completed', {
        paidAt: new Date(),
        transactionId: prepayId || ''
      })
      
      // 根据产品类型处理用户权益
      if (order.userId || order.openId) {
        await processOrderBenefits(order)
      }
      
      // 自动计算分销佣金
      try {
        await distributionService.calculateCommission(orderId)
        console.log(`✅ 订单 ${orderId} 佣金计算完成`)
      } catch (commError) {
        console.error(`⚠️ 订单 ${orderId} 佣金计算失败:`, commError)
        // 佣金计算失败不影响支付结果
      }
      
      // 自动结算超期佣金
      try {
        await distributionService.autoSettleCommissions()
      } catch (settleError) {
        console.error('⚠️ 自动结算佣金失败:', settleError)
      }
      
      return NextResponse.json({
        code: 200,
        message: '支付通知处理成功'
      })
    }
    
    return NextResponse.json({
      code: 200,
      message: '通知已接收'
    })
    
  } catch (error) {
    console.error('支付通知处理失败:', error)
    return NextResponse.json({
      code: 500,
      message: '处理失败'
    }, { status: 500 })
  }
}

/**
 * 处理订单权益发放
 */
async function processOrderBenefits(order: any) {
  try {
    const userId = order.userId || order.openId
    if (!userId) return
    
    const user = await userService.getUserById(userId)
    if (!user) return
    
    const updates: any = {}
    
    switch (order.productType) {
      case 'vip':
        // VIP会员
        const durations: Record<string, number> = {
          month: 30, quarter: 90, year: 365, lifetime: 36500
        }
        const days = durations[order.productDetail] || 30
        const expireDate = new Date()
        expireDate.setDate(expireDate.getDate() + days)
        
        updates.vipInfo = {
          isVIP: true,
          vipType: order.productDetail,
          expireDate: expireDate.toISOString(),
          purchaseDate: new Date().toISOString()
        }
        break
        
      case 'test_count':
        // 测试次数
        const currentCount = user.testCount || 0
        updates.testCount = currentCount + (order.productDetail ? parseInt(order.productDetail) : 1)
        break
        
      case 'single_test':
        // 单次测试解锁
        const unlockedTests = user.unlockedTests || []
        if (!unlockedTests.includes(order.productDetail)) {
          unlockedTests.push(order.productDetail)
          updates.unlockedTests = unlockedTests
        }
        break
    }
    
    if (Object.keys(updates).length > 0) {
      await userService.updateUser(userId, updates)
    }
  } catch (error) {
    console.error('处理权益发放失败:', error)
  }
}
