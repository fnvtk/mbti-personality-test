import { NextResponse } from "next/server"
import { getMySQLService } from "@/lib/mysql-service"

export async function GET() {
  try {
    const mysqlService = getMySQLService()

    const isConnected = mysqlService.isConnectedToDatabase()
    const config = mysqlService.getConfig()
    const logs = mysqlService.getSyncLogs()
    const lastSyncTime = mysqlService.getLastSyncTime()

    return NextResponse.json({
      success: true,
      isConnected,
      config: isConnected
        ? {
            host: config?.host,
            port: config?.port,
            user: config?.user,
            database: config?.database,
          }
        : null,
      logs: logs.slice(0, 20), // 只返回最近20条日志
      lastSyncTime,
    })
  } catch (error) {
    console.error("获取数据库状态错误:", error)
    return NextResponse.json({ success: false, message: `获取数据库状态错误: ${error.message}` }, { status: 500 })
  }
}
