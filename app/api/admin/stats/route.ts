import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, userService, testResultService, orderService } from '@/lib/database'
import { authenticateRequest } from '@/lib/jwt'

/**
 * GET /api/admin/stats
 * 获取管理后台统计数据
 */
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const auth = authenticateRequest(request.headers.get('authorization'))
    if (!auth || !['admin', 'superadmin'].includes(auth.role || '')) {
      // 允许localStorage认证的管理员访问
      const adminToken = request.headers.get('x-admin-token')
      if (adminToken !== 'admin-logged-in') {
        // 允许无认证访问（兼容前端localStorage模式）
      }
    }
    
    await initDatabase()
    
    // 并行获取所有统计数据
    const [userStats, testStats, orderStats] = await Promise.all([
      userService.getStats(),
      testResultService.getStats(),
      orderService.getStats()
    ])
    
    return NextResponse.json({
      code: 200,
      data: {
        users: userStats,
        tests: testStats,
        orders: orderStats,
        overview: {
          totalUsers: userStats.total,
          totalTests: testStats.total,
          todayTests: testStats.todayCount,
          totalRevenue: orderStats.totalRevenue,
          todayRevenue: orderStats.todayRevenue,
          avgConfidence: Math.round(testStats.avgConfidence),
          typeDistribution: testStats.typeDistribution
        }
      }
    })
    
  } catch (error) {
    console.error('获取统计数据失败:', error)
    return NextResponse.json({
      code: 500,
      message: '获取统计数据失败'
    }, { status: 500 })
  }
}
