import { type NextRequest, NextResponse } from "next/server"
import { getMySQLService, type MySQLConfig } from "@/lib/mysql-service"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { host, port, user, password, database, connectionLimit } = data

    // 验证必要参数
    if (!host || !user || !password || !database) {
      return NextResponse.json({ success: false, message: "缺少必要的数据库连接参数" }, { status: 400 })
    }

    // 创建配置对象
    const config: MySQLConfig = {
      host,
      port: port || 3306,
      user,
      password,
      database,
      connectionLimit: connectionLimit || 10,
    }

    // 获取MySQL服务实例
    const mysqlService = getMySQLService()

    // 初始化连接
    const success = await mysqlService.initialize(config)

    if (success) {
      return NextResponse.json({
        success: true,
        message: "数据库连接成功",
        config: {
          host: config.host,
          port: config.port,
          user: config.user,
          database: config.database,
        },
      })
    } else {
      return NextResponse.json({ success: false, message: "数据库连接失败，请检查连接参数" }, { status: 500 })
    }
  } catch (error) {
    console.error("数据库连接错误:", error)
    return NextResponse.json({ success: false, message: `数据库连接错误: ${error.message}` }, { status: 500 })
  }
}
