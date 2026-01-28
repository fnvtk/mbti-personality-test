import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 模拟企业账户数据
const enterpriseAccounts = [
  {
    id: "ent-001",
    username: "tech-company",
    password: "password123", // 实际应用中应使用加密密码
    name: "科技创新有限公司",
  },
  {
    id: "ent-002",
    username: "edu-group",
    password: "password123",
    name: "未来教育集团",
  },
  {
    id: "ent-003",
    username: "health-tech",
    password: "password123",
    name: "健康医疗科技",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // 验证用户名和密码
    const enterprise = enterpriseAccounts.find(
      (account) => account.username === username && account.password === password,
    )

    if (enterprise) {
      // 生成简单的token（实际应用中应使用JWT等安全方式）
      const token = Buffer.from(`${enterprise.id}:${Date.now()}`).toString("base64")

      return NextResponse.json({
        success: true,
        token,
        enterpriseId: enterprise.id,
        enterpriseName: enterprise.name,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "用户名或密码错误",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("登录处理错误:", error)
    return NextResponse.json(
      {
        success: false,
        message: "登录处理失败",
      },
      { status: 500 },
    )
  }
}
