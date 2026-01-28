// 存储认证令牌
let authToken: string | null = null

// 获取认证令牌
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    // 优先从内存中获取
    if (authToken) return authToken

    // 其次从localStorage获取
    const storedToken = localStorage.getItem("authToken")
    if (storedToken) {
      authToken = storedToken
      return storedToken
    }
  }
  return null
}

// 设置认证令牌
export function setAuthToken(token: string): void {
  authToken = token
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token)
  }
}

// 清除认证令牌
export function clearAuthToken(): void {
  authToken = null
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
  }
}

// 检查是否已认证
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}
