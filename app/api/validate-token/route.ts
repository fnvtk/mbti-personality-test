import { NextResponse } from "next/server"

// API基础URL
const API_BASE_URL = "https://ai-pandora.xyz"

export async function GET(request: Request) {
  try {
    // 获取认证头
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json(
        {
          code: 401,
          message: "未提供认证信息",
        },
        { status: 401 },
      )
    }

    // 发送请求到目标API验证令牌
    // 这里我们使用一个简单的API调用来验证令牌
    const response = await fetch(`${API_BASE_URL}/api/mbti/result/1`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        {
          code: 401,
          message: "无效的认证令牌",
        },
        { status: 401 },
      )
    }

    // 返回成功响应
    return NextResponse.json(
      {
        code: 0,
        message: "认证成功",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("验证令牌时出错:", error)
    return NextResponse.json(
      {
        code: 500,
        message: `验证失败: ${(error as Error).message}`,
      },
      { status: 500 },
    )
  }
}
