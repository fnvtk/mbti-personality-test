import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, distributionService, userService } from '@/lib/database'

/**
 * GET /api/distribution
 * 获取用户分销统计数据
 * 参数：userId（必填）
 */
export async function GET(request: NextRequest) {
  try {
    await initDatabase()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ code: 400, message: '缺少用户ID' }, { status: 400 })
    }
    
    const stats = await distributionService.getUserDistributionStats(userId)
    if (!stats) {
      return NextResponse.json({ code: 404, message: '用户不存在或数据获取失败' }, { status: 404 })
    }
    
    return NextResponse.json({ code: 200, data: stats })
  } catch (error) {
    console.error('获取分销统计失败:', error)
    return NextResponse.json({ code: 500, message: '获取失败' }, { status: 500 })
  }
}

/**
 * POST /api/distribution
 * 分销操作：绑定邀请人 / 申请提现
 */
export async function POST(request: NextRequest) {
  try {
    await initDatabase()
    
    const body = await request.json()
    const { action, userId } = body
    
    if (!userId || !action) {
      return NextResponse.json({ code: 400, message: '缺少参数' }, { status: 400 })
    }
    
    switch (action) {
      // 绑定邀请人
      case 'bind': {
        const { inviteCode } = body
        if (!inviteCode) {
          return NextResponse.json({ code: 400, message: '缺少邀请码' }, { status: 400 })
        }
        const result = await distributionService.bindInviter(userId, inviteCode)
        return NextResponse.json({ code: result.success ? 200 : 400, ...result })
      }
      
      // 申请提现
      case 'withdraw': {
        const { amount, method, account, realName } = body
        if (!amount) {
          return NextResponse.json({ code: 400, message: '缺少提现金额' }, { status: 400 })
        }
        const result = await distributionService.createWithdrawal(userId, amount, method, account, realName)
        return NextResponse.json({ code: result.success ? 200 : 400, ...result })
      }
      
      default:
        return NextResponse.json({ code: 400, message: '不支持的操作' }, { status: 400 })
    }
  } catch (error) {
    console.error('分销操作失败:', error)
    return NextResponse.json({ code: 500, message: '操作失败' }, { status: 500 })
  }
}
