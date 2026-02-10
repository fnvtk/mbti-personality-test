// JWT认证工具
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'mbti-system-secret-key-2026'

export interface JWTPayload {
  userId: string
  username?: string
  role?: string
  openId?: string
}

/**
 * 生成JWT Token
 */
export function generateToken(payload: JWTPayload, expiresIn = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

/**
 * 验证JWT Token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

/**
 * 从请求头中获取Token
 */
export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return authHeader
}

/**
 * 验证请求中的认证信息
 */
export function authenticateRequest(authHeader: string | null): JWTPayload | null {
  const token = getTokenFromHeader(authHeader)
  if (!token) return null
  return verifyToken(token)
}
