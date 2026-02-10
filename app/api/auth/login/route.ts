import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, userService } from '@/lib/database'
import { generateToken } from '@/lib/jwt'
import bcrypt from 'bcryptjs'

/**
 * POST /api/auth/login
 * 管理员/用户登录
 */
export async function POST(request: NextRequest) {
  try {
    await initDatabase()
    
    const { username, password } = await request.json()
    
    if (!username || !password) {
      return NextResponse.json({
        code: 400,
        message: '用户名和密码不能为空'
      }, { status: 400 })
    }
    
    // 查找用户
    let user = await userService.findByUsernameOrEmail(username)
    console.log('[LOGIN] username:', username, 'found:', !!user, 'userObj:', user ? JSON.stringify({_id: user._id, username: user.username, role: user.role}) : 'null')
    
    // 如果找不到且是admin，直接验证默认密码
    if (!user && username === 'admin' && password === 'k123456') {
      // 创建管理员并返回
      const token = generateToken({
        userId: 'admin-001',
        username: 'admin',
        role: 'superadmin'
      })
      
      return NextResponse.json({
        code: 200,
        message: '登录成功',
        data: {
          token,
          user: {
            id: 'admin-001',
            username: 'admin',
            email: 'admin@mbti.com',
            role: 'superadmin',
            avatar: '',
            mbtiType: ''
          }
        }
      })
    }
    
    if (!user) {
      return NextResponse.json({
        code: 401,
        message: '用户名或密码错误'
      }, { status: 401 })
    }
    
    // 验证密码
    let isPasswordValid = false
    
    if (user.comparePassword && typeof user.comparePassword === 'function') {
      // MongoDB模式
      isPasswordValid = await user.comparePassword(password)
    } else if (user.password && user.password.startsWith('$2')) {
      // bcrypt哈希密码
      const bcrypt = require('bcryptjs')
      isPasswordValid = await bcrypt.compare(password, user.password)
    } else {
      // 内存模式 - 超管默认密码
      isPasswordValid = (username === 'admin' && password === 'k123456')
    }
    
    if (!isPasswordValid) {
      return NextResponse.json({
        code: 401,
        message: '用户名或密码错误'
      }, { status: 401 })
    }
    
    // 检查用户状态
    if (user.status === 'banned') {
      return NextResponse.json({
        code: 403,
        message: '账户已被禁用'
      }, { status: 403 })
    }
    
    // 更新最后登录时间
    await userService.updateUser(user._id, { lastLoginAt: new Date() })
    
    // 生成Token
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username,
      role: user.role
    })
    
    return NextResponse.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          mbtiType: user.mbtiType
        }
      }
    })
    
  } catch (error) {
    console.error('登录失败:', error)
    return NextResponse.json({
      code: 500,
      message: '服务器错误'
    }, { status: 500 })
  }
}
