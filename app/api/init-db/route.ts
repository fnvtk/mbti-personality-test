import { NextResponse } from "next/server"
import { initDatabase } from "@/lib/db-service"

export async function GET() {
  try {
    const result = await initDatabase()

    if (result) {
      return NextResponse.json({
        code: 0,
        message: "数据库初始化成功",
      })
    } else {
      return NextResponse.json(
        {
          code: 1,
          message: "数据库初始化失败",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("初始化数据库时出错:", error)
    return NextResponse.json(
      {
        code: 1,
        message: `初始化数据库失败: ${(error as Error).message}`,
      },
      { status: 500 },
    )
  }
}
