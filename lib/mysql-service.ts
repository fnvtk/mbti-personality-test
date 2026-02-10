// MySQL数据库服务 - 模拟实现（不依赖serverless-mysql）
// 本项目使用MongoDB，此文件仅保留接口兼容

import { getDatabase } from "./legacy-database"

// MySQL服务模拟
class MySQLService {
  private connected = false
  private syncLogs: any[] = []

  async initialize(config: any) {
    console.log('MySQL服务初始化（模拟模式）')
    this.connected = true
    return true
  }

  async close() {
    this.connected = false
  }

  isConnected() {
    return this.connected
  }

  // 模拟同步用户到MySQL
  async syncUserToMySQL(user: any) {
    this.syncLogs.push({
      type: 'sync_user',
      userId: user.id,
      timestamp: new Date().toISOString(),
      status: 'simulated'
    })
    return true
  }

  async syncAllUsersToMySQL() {
    this.syncLogs.push({
      type: 'sync_all',
      timestamp: new Date().toISOString(),
      status: 'simulated'
    })
    return { synced: 0, message: 'MySQL同步已模拟（项目使用MongoDB）' }
  }

  async syncAllUsersFromMySQL() {
    return { synced: 0, message: 'MySQL同步已模拟（项目使用MongoDB）' }
  }

  startAutoSync(intervalMinutes = 5) {
    console.log(`自动同步已启动（模拟，间隔${intervalMinutes}分钟）`)
  }

  stopAutoSync() {
    console.log('自动同步已停止')
  }

  getSyncLogs() {
    return this.syncLogs
  }
}

// 导出单例
const mysqlService = new MySQLService()
export default mysqlService
