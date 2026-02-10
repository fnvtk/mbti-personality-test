// MySQL数据库服务 - 处理数据库连接和同步（模拟实现）

import { getDatabase, type User } from "./database"
import mysql from "serverless-mysql"

// 创建 MySQL 连接
const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: Number.parseInt(process.env.MYSQL_PORT || "3306"),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
})

// 执行 SQL 查询
export async function executeQuery({ query, values = [] }: { query: string; values?: any[] }) {
  try {
    const results = await db.query(query, values)
    await db.end()
    return results
  } catch (error) {
    console.error("MySQL query error:", error)
    throw error
  }
}

// 初始化数据库
export async function initializeDatabase() {
  try {
    // 检查连接
    await db.query("SELECT 1")
    console.log("MySQL connection successful")
    return { success: true, message: "Database connection successful" }
  } catch (error) {
    console.error("MySQL connection error:", error)
    return { success: false, message: "Database connection failed" }
  }
}

// 数据库配置接口
export interface MySQLConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
  connectionLimit?: number
}

// MySQL服务类（模拟实现）
export class MySQLService {
  private config: MySQLConfig | null = null
  private isConnected = false
  private syncInterval: NodeJS.Timeout | null = null
  private lastSyncTime = 0
  private syncLogs: string[] = []

  // 初始化数据库连接
  async initialize(config: MySQLConfig): Promise<boolean> {
    try {
      // 模拟连接延迟
      await new Promise((resolve) => setTimeout(resolve, 500))

      this.config = config
      this.isConnected = true
      this.addSyncLog(`MySQL数据库连接成功: ${config.host}:${config.port}/${config.database}`)

      // 模拟初始化表
      this.addSyncLog("数据库表初始化完成")

      return true
    } catch (error) {
      this.addSyncLog(`MySQL数据库连接失败: ${error.message}`)
      this.isConnected = false
      return false
    }
  }

  // 关闭数据库连接
  async close(): Promise<void> {
    if (this.isConnected) {
      // 模拟关闭延迟
      await new Promise((resolve) => setTimeout(resolve, 300))

      this.isConnected = false
      this.addSyncLog("MySQL数据库连接已关闭")
    }

    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  // 检查连接状态
  isConnectedToDatabase(): boolean {
    return this.isConnected
  }

  // 获取配置信息
  getConfig(): MySQLConfig | null {
    return this.config
  }

  // 获取同步日志
  getSyncLogs(): string[] {
    return this.syncLogs
  }

  // 添加同步日志
  addSyncLog(message: string): void {
    const timestamp = new Date().toLocaleString()
    this.syncLogs.unshift(`[${timestamp}] ${message}`)

    // 保留最近100条日志
    if (this.syncLogs.length > 100) {
      this.syncLogs = this.syncLogs.slice(0, 100)
    }
  }

  // 同步单个用户数据到MySQL
  async syncUserToMySQL(user: User): Promise<boolean> {
    if (!this.isConnected) return false

    try {
      // 模拟同步延迟
      await new Promise((resolve) => setTimeout(resolve, 200))

      this.addSyncLog(`同步用户数据到MySQL: ${user.id} (${user.name})`)
      return true
    } catch (error) {
      this.addSyncLog(`同步用户数据到MySQL失败: ${error.message}`)
      return false
    }
  }

  // 从MySQL同步单个用户数据
  async syncUserFromMySQL(userId: string): Promise<User | null> {
    if (!this.isConnected) return null

    try {
      // 模拟同步延迟
      await new Promise((resolve) => setTimeout(resolve, 200))

      // 从本地数据库获取用户（在实际实现中，这里应该是从MySQL获取）
      const db = getDatabase()
      const user = db.getUserById(userId)

      if (user) {
        this.addSyncLog(`从MySQL同步用户数据: ${userId} (${user.name})`)
      } else {
        this.addSyncLog(`从MySQL同步用户数据失败: 未找到用户 ${userId}`)
      }

      return user
    } catch (error) {
      this.addSyncLog(`从MySQL同步用户数据失败: ${error.message}`)
      return null
    }
  }

  // 同步所有用户数据到MySQL
  async syncAllUsersToMySQL(): Promise<{ success: boolean; message: string; syncedCount: number }> {
    if (!this.isConnected) {
      return { success: false, message: "数据库未连接", syncedCount: 0 }
    }

    try {
      const db = getDatabase()
      const users = db.getUsers()

      // 模拟同步延迟
      await new Promise((resolve) => setTimeout(resolve, 500))

      this.lastSyncTime = Date.now()
      this.addSyncLog(`同步所有用户数据到MySQL: ${users.length}个用户`)

      return {
        success: true,
        message: `同步完成: ${users.length}个用户数据已同步`,
        syncedCount: users.length,
      }
    } catch (error) {
      this.addSyncLog(`同步所有用户数据到MySQL失败: ${error.message}`)
      return { success: false, message: `同步失败: ${error.message}`, syncedCount: 0 }
    }
  }

  // 从MySQL同步所有用户数据
  async syncAllUsersFromMySQL(): Promise<{ success: boolean; message: string; syncedCount: number }> {
    if (!this.isConnected) {
      return { success: false, message: "数据库未连接", syncedCount: 0 }
    }

    try {
      const db = getDatabase()
      const users = db.getUsers()

      // 模拟同步延迟
      await new Promise((resolve) => setTimeout(resolve, 500))

      this.lastSyncTime = Date.now()
      this.addSyncLog(`从MySQL同步所有用户数据: ${users.length}个用户`)

      return {
        success: true,
        message: `同步完成: ${users.length}个用户数据已同步`,
        syncedCount: users.length,
      }
    } catch (error) {
      this.addSyncLog(`从MySQL同步所有用户数据失败: ${error.message}`)
      return { success: false, message: `同步失败: ${error.message}`, syncedCount: 0 }
    }
  }

  // 启动自动同步
  startAutoSync(intervalMinutes = 5): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }

    // 转换为毫秒
    const intervalMs = intervalMinutes * 60 * 1000

    this.syncInterval = setInterval(async () => {
      this.addSyncLog(`执行自动同步 (${new Date().toLocaleString()})`)
      await this.syncAllUsersToMySQL()
    }, intervalMs)

    this.addSyncLog(`自动同步已启动，间隔: ${intervalMinutes}分钟`)
  }

  // 停止自动同步
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
      this.addSyncLog("自动同步已停止")
    }
  }

  // 获取上次同步时间
  getLastSyncTime(): number {
    return this.lastSyncTime
  }
}

// 创建单例实例
let mysqlServiceInstance: MySQLService | null = null

export function getMySQLService(): MySQLService {
  if (!mysqlServiceInstance) {
    mysqlServiceInstance = new MySQLService()
  }
  return mysqlServiceInstance
}
