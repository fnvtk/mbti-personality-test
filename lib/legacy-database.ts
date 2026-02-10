// 内存数据库实现 - 不依赖任何原生模块

// 用户类型定义
export interface User {
  id: string
  name: string
  nickname?: string
  phone?: string
  email?: string
  team?: string
  createdAt: number
  updatedAt: number
  tags: string[]
  photos: Photo[]
  testResults: TestResult[]
  faceAnalysis?: {
    mbti?: {
      type: string
      title: string
      dimensions?: {
        energy: string
        information: string
        decisions: string
        lifestyle: string
      }
      scores?: {
        E: number
        I: number
        S: number
        N: number
        T: number
        F: number
        J: number
        P: number
      }
    }
    pdp?: {
      primary: string
      secondary: string
      description?: string
      workStyle?: string
      scores?: {
        tiger: number
        peacock: number
        koala: number
        owl: number
        chameleon: number
      }
    }
    disc?: {
      primary: string
      secondary: string
      description?: string
      communication?: string
      scores?: {
        D: number
        I: number
        S: number
        C: number
      }
    }
    strengths?: string[]
    strengthDetails?: Record<string, string>
  }
}

// 测试结果类型定义
export interface TestResult {
  id: string
  userId: string
  testType: string
  result: any
  timestamp: number
}

// 照片类型定义
export interface Photo {
  id: string
  userId: string
  photoUrl: string
  angle: string
  timestamp: number
}

// 内存数据库类
class InMemoryDatabase {
  private users: Map<string, User> = new Map()
  private testResults: Map<string, TestResult> = new Map()
  private photos: Map<string, Photo> = new Map()
  private userTestResults: Map<string, string[]> = new Map()
  private userPhotos: Map<string, string[]> = new Map()
  private userTags: Map<string, string[]> = new Map()

  // 用户相关方法
  getUserById(id: string): User | null {
    const user = this.users.get(id)
    if (!user) return null

    return {
      ...user,
      photos: this.getUserPhotos(id),
      testResults: this.getUserTestResults(id),
      tags: this.userTags.get(id) || [],
    }
  }

  getUsers(): User[] {
    return Array.from(this.users.values()).map((user) => ({
      ...user,
      photos: this.getUserPhotos(user.id),
      testResults: this.getUserTestResults(user.id),
      tags: this.userTags.get(user.id) || [],
    }))
  }

  createUser(userData: Omit<User, "createdAt" | "updatedAt" | "tags" | "photos" | "testResults">): User {
    const now = Date.now()
    const user: User = {
      ...userData,
      createdAt: now,
      updatedAt: now,
      tags: [],
      photos: [],
      testResults: [],
    }
    this.users.set(user.id, user)
    this.userTags.set(user.id, [])
    return user
  }

  updateUser(id: string, userData: Partial<User>): User | null {
    const user = this.users.get(id)
    if (!user) return null

    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: Date.now(),
      tags: user.tags,
      photos: user.photos,
      testResults: user.testResults,
    }
    this.users.set(id, updatedUser)
    return this.getUserById(id)
  }

  deleteUser(id: string): boolean {
    this.userTags.delete(id)
    this.userTestResults.delete(id)
    this.userPhotos.delete(id)
    return this.users.delete(id)
  }

  addUserTag(userId: string, tag: string): string[] {
    const tags = this.userTags.get(userId) || []
    if (!tags.includes(tag)) {
      tags.push(tag)
      this.userTags.set(userId, tags)
    }
    return tags
  }

  removeUserTag(userId: string, tag: string): string[] {
    const tags = this.userTags.get(userId) || []
    const index = tags.indexOf(tag)
    if (index > -1) {
      tags.splice(index, 1)
      this.userTags.set(userId, tags)
    }
    return tags
  }

  // 测试结果相关方法
  getTestResultById(id: string): TestResult | null {
    return this.testResults.get(id) || null
  }

  getUserTestResults(userId: string): TestResult[] {
    const resultIds = this.userTestResults.get(userId) || []
    return resultIds.map((id) => this.testResults.get(id)).filter(Boolean) as TestResult[]
  }

  createTestResult(resultData: TestResult): TestResult {
    this.testResults.set(resultData.id, resultData)

    // 更新用户-测试结果映射
    const userResults = this.userTestResults.get(resultData.userId) || []
    userResults.push(resultData.id)
    this.userTestResults.set(resultData.userId, userResults)

    return resultData
  }

  // 照片相关方法
  getPhotoById(id: string): Photo | null {
    return this.photos.get(id) || null
  }

  getUserPhotos(userId: string): Photo[] {
    const photoIds = this.userPhotos.get(userId) || []
    return photoIds.map((id) => this.photos.get(id)).filter(Boolean) as Photo[]
  }

  createPhoto(photoData: Photo): Photo {
    this.photos.set(photoData.id, photoData)

    // 更新用户-照片映射
    const userPhotos = this.userPhotos.get(photoData.userId) || []
    userPhotos.push(photoData.id)
    this.userPhotos.set(photoData.userId, userPhotos)

    return photoData
  }

  // 统计方法
  getUserCount(): number {
    return this.users.size
  }

  getTeamCount(): number {
    const teams = new Set(
      Array.from(this.users.values())
        .map((user) => user.team)
        .filter(Boolean),
    )
    return teams.size
  }

  getPhotoCount(): number {
    return this.photos.size
  }

  getTestResultCount(): number {
    return this.testResults.size
  }

  initSampleData() {
    const now = Date.now()

    // 用户1：张三
    const user1 = this.createUser({
      id: "12345678",
      name: "张三",
      email: "zhangsan@example.com",
      phone: "13800138001",
      team: "产品团队",
      faceAnalysis: {
        mbti: {
          type: "ENTJ",
          title: "指挥官型人格",
          dimensions: {
            energy: "外向",
            information: "直觉",
            decisions: "思考",
            lifestyle: "判断",
          },
          scores: {
            E: 75,
            I: 25,
            S: 30,
            N: 70,
            T: 80,
            F: 20,
            J: 65,
            P: 35,
          },
        },
        pdp: {
          primary: "老虎",
          secondary: "孔雀",
          description: "果断、自信、有领导力",
          workStyle: "目标导向，追求卓越",
          scores: {
            tiger: 25,
            peacock: 18,
            koala: 10,
            owl: 15,
            chameleon: 12,
          },
        },
        disc: {
          primary: "D型",
          secondary: "I型",
          description: "支配型，喜欢挑战和竞争",
          communication: "直接、果断、高效",
          scores: {
            D: 85,
            I: 60,
            S: 30,
            C: 45,
          },
        },
        strengths: ["领导力", "战略思维", "决策能力"],
        strengthDetails: {
          领导力: "善于带领团队达成目标",
          战略思维: "能够制定长远规划",
          决策能力: "快速做出正确决策",
        },
      },
    })

    // 添加张三的标签
    this.addUserTag("12345678", "MBTI-ENTJ")
    this.addUserTag("12345678", "PDP-老虎")
    this.addUserTag("12345678", "DISC-D型")

    // 添加张三的测试结果
    this.createTestResult({
      id: "result_1761727801509_dmh1oo4zw",
      userId: "12345678",
      testType: "mbti",
      result: {
        type: "ENTJ",
        title: "指挥官型人格",
        description: "天生的领导者，善于组织和指挥",
        scores: { E: 75, I: 25, S: 30, N: 70, T: 80, F: 20, J: 65, P: 35 },
      },
      timestamp: new Date("2025-10-29T16:50:01").getTime(),
    })

    this.createTestResult({
      id: "result_1761727801510_t6iv13xau",
      userId: "12345678",
      testType: "pdp",
      result: {
        primary: "老虎",
        secondary: "孔雀",
        description: "果断、自信、有领导力",
        scores: { tiger: 25, peacock: 18, koala: 10, owl: 15, chameleon: 12 },
      },
      timestamp: new Date("2025-10-29T16:50:01").getTime(),
    })

    this.createTestResult({
      id: "result_1761727801510_59lu277q4",
      userId: "12345678",
      testType: "disc",
      result: {
        primary: "D型",
        secondary: "I型",
        description: "支配型，喜欢挑战和竞争",
        scores: { D: 85, I: 60, S: 30, C: 45 },
      },
      timestamp: new Date("2025-10-29T16:50:01").getTime(),
    })

    // 用户2：李四
    const user2 = this.createUser({
      id: "23456789",
      name: "李四",
      email: "lisi@example.com",
      phone: "13800138002",
      team: "技术团队",
      faceAnalysis: {
        mbti: {
          type: "INFP",
          title: "调停者型人格",
          dimensions: {
            energy: "内向",
            information: "直觉",
            decisions: "情感",
            lifestyle: "知觉",
          },
          scores: {
            E: 30,
            I: 70,
            S: 35,
            N: 65,
            T: 25,
            F: 75,
            J: 40,
            P: 60,
          },
        },
        pdp: {
          primary: "无尾熊",
          secondary: "圣伯龙",
          description: "温和、友善、善于倾听",
          workStyle: "注重团队和谐，追求稳定",
          scores: {
            tiger: 10,
            peacock: 15,
            koala: 28,
            owl: 12,
            chameleon: 15,
          },
        },
        disc: {
          primary: "S型",
          secondary: "C型",
          description: "稳定型，注重团队合作",
          communication: "温和、耐心、善于倾听",
          scores: {
            D: 25,
            I: 40,
            S: 80,
            C: 55,
          },
        },
        strengths: ["同理心", "创造力", "适应能力"],
        strengthDetails: {
          同理心: "能够理解他人的感受",
          创造力: "富有想象力和创新思维",
          适应能力: "能够快速适应新环境",
        },
      },
    })

    this.addUserTag("23456789", "MBTI-INFP")
    this.addUserTag("23456789", "PDP-无尾熊")
    this.addUserTag("23456789", "DISC-S型")

    this.createTestResult({
      id: "result_mbti_2",
      userId: "23456789",
      testType: "mbti",
      result: {
        type: "INFP",
        title: "调停者型人格",
        description: "理想主义者，富有同情心",
        scores: { E: 30, I: 70, S: 35, N: 65, T: 25, F: 75, J: 40, P: 60 },
      },
      timestamp: new Date("2025-10-29T16:50:01").getTime(),
    })

    this.createTestResult({
      id: "result_pdp_2",
      userId: "23456789",
      testType: "pdp",
      result: {
        primary: "无尾熊",
        secondary: "圣伯龙",
        description: "温和、友善、善于倾听",
        scores: { tiger: 10, peacock: 15, koala: 28, owl: 12, chameleon: 15 },
      },
      timestamp: new Date("2025-10-29T16:50:01").getTime(),
    })

    this.createTestResult({
      id: "result_disc_2",
      userId: "23456789",
      testType: "disc",
      result: {
        primary: "S型",
        secondary: "C型",
        description: "稳定型，注重团队合作",
        scores: { D: 25, I: 40, S: 80, C: 55 },
      },
      timestamp: new Date("2025-10-29T16:50:01").getTime(),
    })

    // 用户3：王五
    const user3 = this.createUser({
      id: "34567890",
      name: "王五",
      email: "wangwu@example.com",
      phone: "13800138003",
      team: "设计团队",
      faceAnalysis: {
        mbti: {
          type: "ISTP",
          title: "鉴赏家型人格",
          dimensions: {
            energy: "内向",
            information: "感觉",
            decisions: "思考",
            lifestyle: "知觉",
          },
          scores: {
            E: 35,
            I: 65,
            S: 70,
            N: 30,
            T: 75,
            F: 25,
            J: 30,
            P: 70,
          },
        },
        pdp: {
          primary: "猫头鹰",
          secondary: "老虎",
          description: "理性、分析、注重细节",
          workStyle: "追求完美，注重质量",
          scores: {
            tiger: 18,
            peacock: 10,
            koala: 12,
            owl: 25,
            chameleon: 15,
          },
        },
        disc: {
          primary: "C型",
          secondary: "D型",
          description: "谨慎型，注重准确性",
          communication: "精确、理性、注重细节",
          scores: {
            D: 60,
            I: 30,
            S: 35,
            C: 85,
          },
        },
        strengths: ["分析能力", "技术专长", "问题解决"],
        strengthDetails: {
          分析能力: "善于分析复杂问题",
          技术专长: "精通专业技能",
          问题解决: "能够找到创新解决方案",
        },
      },
    })

    this.addUserTag("34567890", "MBTI-ISTP")
    this.addUserTag("34567890", "PDP-猫头鹰")
    this.addUserTag("34567890", "DISC-C型")

    this.createTestResult({
      id: "result_mbti_3",
      userId: "34567890",
      testType: "mbti",
      result: {
        type: "ISTP",
        title: "鉴赏家型人格",
        description: "实用主义者，善于解决问题",
        scores: { E: 35, I: 65, S: 70, N: 30, T: 75, F: 25, J: 30, P: 70 },
      },
      timestamp: new Date("2025-10-29T16:50:01").getTime(),
    })

    this.createTestResult({
      id: "result_pdp_3",
      userId: "34567890",
      testType: "pdp",
      result: {
        primary: "猫头鹰",
        secondary: "老虎",
        description: "理性、分析、注重细节",
        scores: { tiger: 18, peacock: 10, koala: 12, owl: 25, chameleon: 15 },
      },
      timestamp: new Date("2025-10-29T16:50:01").getTime(),
    })

    this.createTestResult({
      id: "result_disc_3",
      userId: "34567890",
      testType: "disc",
      result: {
        primary: "C型",
        secondary: "D型",
        description: "谨慎型，注重准确性",
        scores: { D: 60, I: 30, S: 35, C: 85 },
      },
      timestamp: new Date("2025-10-29T16:50:01").getTime(),
    })
  }
}

// 创建单例实例
let databaseInstance: InMemoryDatabase | null = null

export function getDatabase(): InMemoryDatabase {
  if (!databaseInstance) {
    databaseInstance = new InMemoryDatabase()
    // 初始化示例数据
    databaseInstance.initSampleData()
  }
  return databaseInstance
}

// 导出类型
export type { User, TestResult, Photo }
