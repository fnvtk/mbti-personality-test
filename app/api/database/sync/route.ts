import { type NextRequest, NextResponse } from "next/server"
import { getMySQLService } from "@/lib/mysql-service"
import { getDatabase } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { direction, userId, autoSync, interval } = data

    const mysqlService = getMySQLService()

    // 检查数据库连接状态
    if (!mysqlService.isConnectedToDatabase()) {
      return NextResponse.json({ success: false, message: "数据库未连接，请先连接数据库" }, { status: 400 })
    }

    // 处理自动同步设置
    if (autoSync !== undefined) {
      if (autoSync) {
        const syncInterval = interval || 5 // 默认5分钟
        mysqlService.startAutoSync(syncInterval)
        return NextResponse.json({
          success: true,
          message: `自动同步已启动，间隔: ${syncInterval}分钟`,
        })
      } else {
        mysqlService.stopAutoSync()
        return NextResponse.json({
          success: true,
          message: "自动同步已停止",
        })
      }
    }

    // 处理同步方向
    if (direction === "to") {
      // 同步到MySQL
      if (userId) {
        // 同步单个用户
        const db = getDatabase()
        const user = db.getUserById(userId)

        if (!user) {
          return NextResponse.json(
            {
              success: false,
              message: `用户不存在: ${userId}`,
            },
            { status: 404 },
          )
        }

        const result = await mysqlService.syncUserToMySQL(user)
        return NextResponse.json({
          success: result,
          message: result ? "用户数据同步成功" : "用户数据同步失败",
        })
      } else {
        // 同步所有用户
        const result = await mysqlService.syncAllUsersToMySQL()
        return NextResponse.json(result)
      }
    } else if (direction === "from") {
      // 从MySQL同步
      if (userId) {
        // 同步单个用户
        const user = await mysqlService.syncUserFromMySQL(userId)
        return NextResponse.json({
          success: !!user,
          message: user ? "用户数据同步成功" : "用户数据同步失败",
          user,
        })
      } else {
        // 同步所有用户
        const result = await mysqlService.syncAllUsersFromMySQL()
        return NextResponse.json(result)
      }
    } else {
      return NextResponse.json({ success: false, message: '无效的同步方向，请指定 "to" 或 "from"' }, { status: 400 })
    }
  } catch (error) {
    console.error("数据同步错误:", error)
    return NextResponse.json({ success: false, message: `数据同步错误: ${error.message}` }, { status: 500 })
  }
}
