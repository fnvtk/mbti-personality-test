import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, distributionService } from '@/lib/database'

/**
 * GET /api/admin/distribution
 * 管理后台 - 获取分销数据
 * 参数：type (overview|distributors|commissions|withdrawals|config)
 */
export async function GET(request: NextRequest) {
  try {
    await initDatabase()
    
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'overview'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    switch (type) {
      // 分销总览
      case 'overview': {
        const stats = await distributionService.getOverviewStats()
        return NextResponse.json({ code: 200, data: stats })
      }
      
      // 分销商列表
      case 'distributors': {
        const search = searchParams.get('search') || ''
        const level = searchParams.get('level') || ''
        const result = await distributionService.getDistributors(page, limit, { search, level })
        return NextResponse.json({ code: 200, data: result })
      }
      
      // 佣金记录
      case 'commissions': {
        const status = searchParams.get('status') || ''
        const levelFilter = searchParams.get('commissionLevel') || ''
        const productType = searchParams.get('productType') || ''
        const distributorId = searchParams.get('distributorId') || ''
        const result = await distributionService.getAllCommissions(page, limit, {
          status: status || undefined,
          level: levelFilter ? parseInt(levelFilter) : undefined,
          productType: productType || undefined,
          distributorId: distributorId || undefined
        })
        return NextResponse.json({ code: 200, data: result })
      }
      
      // 提现记录
      case 'withdrawals': {
        const wdStatus = searchParams.get('status') || ''
        const result = await distributionService.getWithdrawals(
          { status: wdStatus || undefined },
          page,
          limit
        )
        return NextResponse.json({ code: 200, data: result })
      }
      
      // 分销配置
      case 'config': {
        const config = await distributionService.getConfig()
        return NextResponse.json({ code: 200, data: config })
      }
      
      default:
        return NextResponse.json({ code: 400, message: '不支持的类型' }, { status: 400 })
    }
  } catch (error) {
    console.error('获取分销管理数据失败:', error)
    return NextResponse.json({ code: 500, message: '获取失败' }, { status: 500 })
  }
}

/**
 * POST /api/admin/distribution
 * 管理后台 - 分销操作
 * action: updateConfig | reviewWithdrawal | settleCommission | batchSettle
 */
export async function POST(request: NextRequest) {
  try {
    await initDatabase()
    
    const body = await request.json()
    const { action } = body
    
    switch (action) {
      // 更新分销配置
      case 'updateConfig': {
        const { config } = body
        const result = await distributionService.updateConfig(config)
        return NextResponse.json({
          code: result ? 200 : 500,
          message: result ? '配置更新成功' : '更新失败',
          data: result
        })
      }
      
      // 审核提现
      case 'reviewWithdrawal': {
        const { withdrawalId, approved, reviewedBy, remark } = body
        if (!withdrawalId) {
          return NextResponse.json({ code: 400, message: '缺少提现ID' }, { status: 400 })
        }
        const result = await distributionService.reviewWithdrawal(
          withdrawalId, approved, reviewedBy || 'admin', remark
        )
        return NextResponse.json({
          code: result ? 200 : 500,
          message: result ? (approved ? '审核通过' : '审核拒绝') : '操作失败'
        })
      }
      
      // 手动结算佣金
      case 'settleCommission': {
        const { commissionId } = body
        if (!commissionId) {
          return NextResponse.json({ code: 400, message: '缺少佣金ID' }, { status: 400 })
        }
        const result = await distributionService.settleCommission(commissionId)
        return NextResponse.json({
          code: result ? 200 : 500,
          message: result ? '结算成功' : '结算失败'
        })
      }
      
      // 批量结算
      case 'batchSettle': {
        const count = await distributionService.autoSettleCommissions()
        return NextResponse.json({
          code: 200,
          message: `成功结算 ${count} 笔佣金`,
          data: { settledCount: count }
        })
      }
      
      default:
        return NextResponse.json({ code: 400, message: '不支持的操作' }, { status: 400 })
    }
  } catch (error) {
    console.error('分销管理操作失败:', error)
    return NextResponse.json({ code: 500, message: '操作失败' }, { status: 500 })
  }
}
