import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, userService, testResultService } from '@/lib/database'
import { authenticateRequest } from '@/lib/jwt'

/**
 * GET /api/user/profile
 * 获取用户个人信息
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
    
    const user = await userService.getUserById(auth.userId)
    if (!user) {
      return NextResponse.json({
        code: 404,
        message: '用户不存在'
      }, { status: 404 })
    }
    
    // 获取测试历史
    const testHistory = await testResultService.getUserResults(auth.userId, 1, 10)
    
    return NextResponse.json({
      code: 200,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          mbtiType: user.mbtiType,
          discType: user.discType,
          pdpType: user.pdpType,
          role: user.role,
          createdAt: user.createdAt,
          vipInfo: user.vipInfo,
          testCount: user.testCount || 0,
          unlockedTests: user.unlockedTests || []
        },
        testHistory: testHistory.results
      }
    })
    
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return NextResponse.json({
      code: 500,
      message: '获取用户信息失败'
    }, { status: 500 })
  }
}

/**
 * PUT /api/user/profile
 * 更新用户个人信息
 */
export async function PUT(request: NextRequest) {
  try {
    await initDatabase()
    
    const auth = authenticateRequest(request.headers.get('authorization'))
    if (!auth) {
      return NextResponse.json({
        code: 401,
        message: '未登录'
      }, { status: 401 })
    }
    
    const body = await request.json()
    const { username, email, phone, avatar } = body
    
    const updates: any = {}
    if (username) updates.username = username
    if (email) updates.email = email
    if (phone) updates.phone = phone
    if (avatar) updates.avatar = avatar
    
    const user = await userService.updateUser(auth.userId, updates)
    
    return NextResponse.json({
      code: 200,
      message: '更新成功',
      data: user
    })
    
  } catch (error) {
    console.error('更新用户信息失败:', error)
    return NextResponse.json({
      code: 500,
      message: '更新用户信息失败'
    }, { status: 500 })
  }
}
