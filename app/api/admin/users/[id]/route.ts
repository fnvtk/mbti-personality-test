import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, userService, testResultService } from '@/lib/database'

/**
 * GET /api/admin/users/:id
 * 获取单个用户详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDatabase()
    
    const user = await userService.getUserById(params.id)
    
    if (!user) {
      return NextResponse.json({
        code: 404,
        message: '用户不存在'
      }, { status: 404 })
    }
    
    // 获取用户测试历史
    const testHistory = await testResultService.getUserResults(params.id, 1, 50)
    
    return NextResponse.json({
      code: 200,
      data: {
        user,
        testHistory: testHistory.results
      }
    })
    
  } catch (error) {
    console.error('获取用户详情失败:', error)
    return NextResponse.json({
      code: 500,
      message: '获取用户详情失败'
    }, { status: 500 })
  }
}

/**
 * PUT /api/admin/users/:id
 * 更新单个用户
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDatabase()
    
    const body = await request.json()
    const user = await userService.updateUser(params.id, body)
    
    if (!user) {
      return NextResponse.json({
        code: 404,
        message: '用户不存在'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      code: 200,
      message: '更新成功',
      data: user
    })
    
  } catch (error) {
    console.error('更新用户失败:', error)
    return NextResponse.json({
      code: 500,
      message: '更新用户失败'
    }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/users/:id
 * 删除单个用户
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDatabase()
    
    await userService.deleteUser(params.id)
    
    return NextResponse.json({
      code: 200,
      message: '删除成功'
    })
    
  } catch (error) {
    console.error('删除用户失败:', error)
    return NextResponse.json({
      code: 500,
      message: '删除用户失败'
    }, { status: 500 })
  }
}
