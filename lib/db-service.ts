// 数据库服务 - 使用内存存储

// 用户数据类型
export interface User {
  id: string
  name: string
  nickname?: string
  phone?: string
  email?: string
  team?: string
  created_at: number
  updated_at: number
}

// 照片数据类型
export interface Photo {
  id: string
  user_id: string
  photo_url: string
  angle: string
  timestamp: number
  created_at: number
}

// 测试结果类型
export interface TestResult {
  id: string
  user_id: string
  test_type: string
  result: any
  timestamp: number
  created_at: number
}

// 内存数据存储
const db = {
  users: new Map<string, User>(),
  photos: new Map<string, Photo>(),
  testResults: new Map<string, TestResult>(),
  userPhotos: new Map<string, string[]>(),
  userTestResults: new Map<string, string[]>(),
}

// 初始化数据库
export async function initDatabase(): Promise<boolean> {
  try {
    if (db.users.size === 0) {
      // 用户1：张三
      const user1Id = "12345678"
      const user1: User = {
        id: user1Id,
        name: "张三",
        nickname: "小张",
        phone: "13800138001",
        email: "zhangsan@example.com",
        team: "产品团队",
        created_at: new Date("2025-10-29T16:50:01").getTime(),
        updated_at: new Date("2025-10-29T16:50:01").getTime(),
      }
      db.users.set(user1Id, user1)

      // 用户1的测试结果
      const mbtiResult1: TestResult = {
        id: "result_1761727801509_dmh1oo4zw",
        user_id: user1Id,
        test_type: "mbti",
        result: { type: "ENTJ", description: "指挥官型人格" },
        timestamp: new Date("2025-10-29T16:50:01").getTime(),
        created_at: new Date("2025-10-29T16:50:01").getTime(),
      }
      db.testResults.set(mbtiResult1.id, mbtiResult1)

      const pdpResult1: TestResult = {
        id: "result_1761727801510_t6iv13xau",
        user_id: user1Id,
        test_type: "pdp",
        result: { primaryType: "老虎", secondaryType: "孔雀" },
        timestamp: new Date("2025-10-29T16:50:01").getTime(),
        created_at: new Date("2025-10-29T16:50:01").getTime(),
      }
      db.testResults.set(pdpResult1.id, pdpResult1)

      const discResult1: TestResult = {
        id: "result_1761727801510_59lu277q4",
        user_id: user1Id,
        test_type: "disc",
        result: { primaryStyle: "D型", secondaryStyle: "支配型", tertiaryStyle: "I型", tertiaryStyleName: "影响型" },
        timestamp: new Date("2025-10-29T16:50:01").getTime(),
        created_at: new Date("2025-10-29T16:50:01").getTime(),
      }
      db.testResults.set(discResult1.id, discResult1)

      db.userTestResults.set(user1Id, [mbtiResult1.id, pdpResult1.id, discResult1.id])

      // 用户2：李四
      const user2Id = "23456789"
      const user2: User = {
        id: user2Id,
        name: "李四",
        nickname: "小李",
        phone: "13800138002",
        email: "lisi@example.com",
        team: "技术团队",
        created_at: new Date("2025-10-29T16:50:01").getTime(),
        updated_at: new Date("2025-10-29T16:50:01").getTime(),
      }
      db.users.set(user2Id, user2)

      // 用户2的测试结果
      const mbtiResult2: TestResult = {
        id: "result_mbti_2",
        user_id: user2Id,
        test_type: "mbti",
        result: { type: "INFP", description: "调停者型人格" },
        timestamp: new Date("2025-10-29T16:50:01").getTime(),
        created_at: new Date("2025-10-29T16:50:01").getTime(),
      }
      db.testResults.set(mbtiResult2.id, mbtiResult2)

      const pdpResult2: TestResult = {
        id: "result_pdp_2",
        user_id: user2Id,
        test_type: "pdp",
        result: { primaryType: "无尾熊", secondaryType: "圣伯龙" },
        timestamp: new Date("2025-10-29T16:50:01").getTime(),
        created_at: new Date("2025-10-29T16:50:01").getTime(),
      }
      db.testResults.set(pdpResult2.id, pdpResult2)

      const discResult2: TestResult = {
        id: "result_disc_2",
        user_id: user2Id,
        test_type: "disc",
        result: { primaryStyle: "S型", secondaryStyle: "稳定型", tertiaryStyle: "C型", tertiaryStyleName: "谨慎型" },
        timestamp: new Date("2025-10-29T16:50:01").getTime(),
        created_at: new Date("2025-10-29T16:50:01").getTime(),
      }
      db.testResults.set(discResult2.id, discResult2)

      db.userTestResults.set(user2Id, [mbtiResult2.id, pdpResult2.id, discResult2.id])

      // 用户3：王五
      const user3Id = "34567890"
      const user3: User = {
        id: user3Id,
        name: "王五",
        nickname: "小王",
        phone: "13800138003",
        email: "wangwu@example.com",
        team: "设计团队",
        created_at: new Date("2025-10-29T16:50:01").getTime(),
        updated_at: new Date("2025-10-29T16:50:01").getTime(),
      }
      db.users.set(user3Id, user3)

      // 用户3的测试结果
      const mbtiResult3: TestResult = {
        id: "result_mbti_3",
        user_id: user3Id,
        test_type: "mbti",
        result: { type: "ISTP", description: "鉴赏家型人格" },
        timestamp: new Date("2025-10-29T16:50:01").getTime(),
        created_at: new Date("2025-10-29T16:50:01").getTime(),
      }
      db.testResults.set(mbtiResult3.id, mbtiResult3)

      const pdpResult3: TestResult = {
        id: "result_pdp_3",
        user_id: user3Id,
        test_type: "pdp",
        result: { primaryType: "猫头鹰", secondaryType: "老虎" },
        timestamp: new Date("2025-10-29T16:50:01").getTime(),
        created_at: new Date("2025-10-29T16:50:01").getTime(),
      }
      db.testResults.set(pdpResult3.id, pdpResult3)

      const discResult3: TestResult = {
        id: "result_disc_3",
        user_id: user3Id,
        test_type: "disc",
        result: { primaryStyle: "C型", secondaryStyle: "谨慎型", tertiaryStyle: "D型", tertiaryStyleName: "支配型" },
        timestamp: new Date("2025-10-29T16:50:01").getTime(),
        created_at: new Date("2025-10-29T16:50:01").getTime(),
      }
      db.testResults.set(discResult3.id, discResult3)

      db.userTestResults.set(user3Id, [mbtiResult3.id, pdpResult3.id, discResult3.id])
    }

    return true
  } catch (error) {
    console.error("数据库初始化失败:", error)
    return false
  }
}

// 用户相关操作
export const userService = {
  // 创建用户
  async createUser(userData: any) {
    // 自动生成唯一ID：使用时间戳 + 随机数
    const { name, nickname, phone, email, team } = userData
    const now = Date.now()

    const id = `${now}${Math.floor(Math.random() * 10000)}`

    try {
      const user: User = {
        id,
        name,
        nickname: nickname || null,
        phone: phone || null,
        email: email || null,
        team: team || null,
        created_at: now,
        updated_at: now,
      }

      db.users.set(id, user)
      return user
    } catch (error) {
      console.error("创建用户失败:", error)
      throw error
    }
  },

  // 获取所有用户
  async getAllUsers() {
    try {
      const users: User[] = []
      for (const user of db.users.values()) {
        users.push(user)
      }
      // 按创建时间降序排序
      return users.sort((a, b) => b.created_at - a.created_at)
    } catch (error) {
      console.error("获取所有用户失败:", error)
      throw error
    }
  },

  // 获取用户
  async getUserById(id: string) {
    try {
      return db.users.get(id) || null
    } catch (error) {
      console.error("获取用户失败:", error)
      throw error
    }
  },

  // 更新用户
  async updateUser(id: string, userData: any) {
    const { name, nickname, phone, email, team } = userData

    try {
      const user = db.users.get(id)
      if (!user) return null

      const updatedUser: User = {
        ...user,
        name: name || user.name,
        nickname: nickname !== undefined ? nickname : user.nickname,
        phone: phone !== undefined ? phone : user.phone,
        email: email !== undefined ? email : user.email,
        team: team !== undefined ? team : user.team,
        updated_at: Date.now(),
      }

      db.users.set(id, updatedUser)
      return updatedUser
    } catch (error) {
      console.error("更新用户失败:", error)
      throw error
    }
  },
}

// 照片相关操作
export const photoService = {
  // 添加照片
  async addPhoto(photoData: any) {
    const { id, userId, photoUrl, angle, timestamp } = photoData
    const now = Date.now()

    try {
      const photo: Photo = {
        id,
        user_id: userId,
        photo_url: photoUrl,
        angle,
        timestamp,
        created_at: now,
      }

      db.photos.set(id, photo)

      // 更新用户照片列表
      const userPhotos = db.userPhotos.get(userId) || []
      userPhotos.push(id)
      db.userPhotos.set(userId, userPhotos)

      return photo
    } catch (error) {
      console.error("添加照片失败:", error)
      throw error
    }
  },

  // 获取用户照片
  async getUserPhotos(userId: string) {
    try {
      const photoIds = db.userPhotos.get(userId) || []
      const photos: Photo[] = []

      for (const id of photoIds) {
        const photo = db.photos.get(id)
        if (photo) {
          photos.push(photo)
        }
      }

      // 按时间戳降序排序
      return photos.sort((a, b) => b.timestamp - a.timestamp)
    } catch (error) {
      console.error("获取用户照片失败:", error)
      throw error
    }
  },
}

// 测试结果相关操作
export const testResultService = {
  // 添加测试结果
  async addTestResult(resultData: any) {
    const { id, userId, testType, result, timestamp } = resultData
    const now = Date.now()

    try {
      const testResult: TestResult = {
        id,
        user_id: userId,
        test_type: testType,
        result,
        timestamp,
        created_at: now,
      }

      db.testResults.set(id, testResult)

      // 更新用户测试结果列表
      const userResults = db.userTestResults.get(userId) || []
      userResults.push(id)
      db.userTestResults.set(userId, userResults)

      return testResult
    } catch (error) {
      console.error("添加测试结果失败:", error)
      throw error
    }
  },

  // 获取用户测试结果
  async getUserTestResults(userId: string) {
    try {
      const resultIds = db.userTestResults.get(userId) || []
      const results: TestResult[] = []

      for (const id of resultIds) {
        const result = db.testResults.get(id)
        if (result) {
          results.push(result)
        }
      }

      // 按时间戳降序排序
      return results.sort((a, b) => b.timestamp - a.timestamp)
    } catch (error) {
      console.error("获取用户测试结果失败:", error)
      throw error
    }
  },

  // 获取特定测试结果
  async getTestResultById(id: string) {
    try {
      return db.testResults.get(id) || null
    } catch (error) {
      console.error("获取测试结果失败:", error)
      throw error
    }
  },
}
