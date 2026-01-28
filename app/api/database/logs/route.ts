import { NextResponse } from "next/server"
import { getMySQLService } from "@/lib/mysql-service"

export async function GET() {
  try {
    const mysqlService = getMySQLService()
    const logs = mysqlService.getSyncLogs()

    return NextResponse.json({
      success: true,
      logs,
    })
  } catch (error) {
    console.error("获取同步日志错误:", error)
    return NextResponse.json({ success: false, message: `获取同步日志错误: ${error.message}` }, { status: 500 })
  }
}
