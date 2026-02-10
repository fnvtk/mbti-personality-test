import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, userService } from '@/lib/database'

/**
 * GET /api/admin/users
 * 获取用户列表（管理后台）
 */
export async function GET(request: NextRequest) {
  try {
    await initDatabase()
    
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''
    
    const result = await userService.getUsers(page, limit, { search, role, status })
    
    return NextResponse.json({
      code: 200,
      data: result
    })
    
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return NextResponse.json({
      code: 500,
      message: '获取用户列表失败'
    }, { status: 500 })
  }
}

/**
 * POST /api/admin/users
 * 创建用户（管理后台）
 */
export async function POST(request: NextRequest) {
  try {
    await initDatabase()
    
    const body = await request.json()
    const { username, email, password, role, status } = body
    
    if (!username) {
      return NextResponse.json({
        code: 400,
        message: '用户名不能为空'
      }, { status: 400 })
    }
    
    const user = await userService.createUser({
      username,
      email,
      password: password || '123456',
      role: role || 'user',
      status: status || 'active'
    } as any)
    
    return NextResponse.json({
      code: 200,
      message: '创建成功',
      data: user
    })
    
  } catch (error) {
    console.error('创建用户失败:', error)
    return NextResponse.json({
      code: 500,
      message: '创建用户失败'
    }, { status: 500 })
  }
}

/**
 * PUT /api/admin/users
 * 更新用户（管理后台）
 */
export async function PUT(request: NextRequest) {
  try {
    await initDatabase()
    
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json({
        code: 400,
        message: '用户ID不能为空'
      }, { status: 400 })
    }
    
    const user = await userService.updateUser(id, updateData)
    
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
 * DELETE /api/admin/users
 * 删除用户（管理后台）
 */
export async function DELETE(request: NextRequest) {
  try {
    await initDatabase()
    
    const id = request.nextUrl.searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({
        code: 400,
        message: '用户ID不能为空'
      }, { status: 400 })
    }
    
    await userService.deleteUser(id)
    
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
