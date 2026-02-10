import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, userService } from '@/lib/database'
import { generateToken } from '@/lib/jwt'

// 微信小程序配置
const WECHAT_APP_ID = process.env.WECHAT_APP_ID || 'wx3d15ed02e98b04e3'
const WECHAT_APP_SECRET = process.env.WECHAT_APP_SECRET || ''

/**
 * POST /api/auth/wechat
 * 微信小程序登录
 * 接收code，换取openId，创建或查找用户，返回token
 */
export async function POST(request: NextRequest) {
  try {
    await initDatabase()
    
    const { code, userInfo } = await request.json()
    
    if (!code) {
      return NextResponse.json({
        code: 400,
        message: '缺少code参数'
      }, { status: 400 })
    }
    
    // 1. 用code换取openId和session_key
    let openId = ''
    let sessionKey = ''
    
    try {
      const wxRes = await fetch(
        `https://api.weixin.qq.com/sns/jscode2session?` +
        `appid=${WECHAT_APP_ID}&` +
        `secret=${WECHAT_APP_SECRET}&` +
        `js_code=${code}&grant_type=authorization_code`,
        { next: { revalidate: 0 } }
      )
      
      const wxData = await wxRes.json()
      
      if (wxData.errcode) {
        console.error('微信登录失败:', wxData)
        return NextResponse.json({
          code: 401,
          message: `微信登录失败: ${wxData.errmsg}`
        }, { status: 401 })
      }
      
      openId = wxData.openid
      sessionKey = wxData.session_key
    } catch (wxError) {
      console.error('调用微信API失败:', wxError)
      // 降级：生成临时openId
      openId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    // 2. 查找或创建用户
    let user = await userService.getUserByOpenId(openId)
    
    if (!user) {
      // 新用户
      user = await userService.createUser({
        username: userInfo?.nickName || `wx_${openId.substr(-6)}`,
        avatar: userInfo?.avatarUrl || '',
        openId,
        role: 'user',
        status: 'active'
      } as any)
    } else {
      // 更新用户信息
      if (userInfo?.nickName) {
        await userService.updateUser(user._id, {
          username: userInfo.nickName,
          avatar: userInfo.avatarUrl || user.avatar,
          lastLoginAt: new Date()
        } as any)
      }
    }
    
    // 3. 生成Token
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username,
      role: 'user',
      openId
    })
    
    return NextResponse.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        openId,
        user: {
          id: user._id,
          username: user.username,
          avatar: user.avatar,
          mbtiType: user.mbtiType || '',
          discType: user.discType || '',
          pdpType: user.pdpType || ''
        }
      }
    })
    
  } catch (error) {
    console.error('微信登录失败:', error)
    return NextResponse.json({
      code: 500,
      message: '服务器错误'
    }, { status: 500 })
  }
}
