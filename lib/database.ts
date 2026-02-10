// 数据库服务 - 支持MongoDB和内存存储双模式
// 当MongoDB可用时使用MongoDB，否则降级到内存存储

import { connectDB, isConnected } from './db'
import User, { IUser } from './models/User'
import TestResult, { ITestResult } from './models/TestResult'
import Order from './models/Order'

// 内存存储（MongoDB不可用时的降级方案）
interface InMemoryStore {
  users: Map<string, any>
  testResults: Map<string, any>
  orders: Map<string, any>
  photos: Map<string, any>
}

const memoryStore: InMemoryStore = {
  users: new Map(),
  testResults: new Map(),
  orders: new Map(),
  photos: new Map(),
}

// 初始化标志
let initialized = false

/**
 * 初始化数据库
 * 尝试连接MongoDB，失败则使用内存存储
 */
export async function initDatabase() {
  if (initialized) return
  initialized = true
  
  // 无论如何先初始化内存数据（保底）
  initMemoryData()

  // 异步尝试连接MongoDB（不阻塞请求）
  connectDB().then(() => {
    console.log('✅ 数据库初始化成功（MongoDB模式）')
    ensureSuperAdmin().catch(e => console.error('创建管理员失败:', e))
  }).catch(error => {
    console.warn('⚠️ MongoDB连接失败，继续使用内存存储模式')
  })
}

/**
 * 强制使用内存模式（当MongoDB不可用时）
 */
export function ensureMemoryMode() {
  if (memoryStore.users.size === 0) {
    initMemoryData()
  }
}

/**
 * 确保超级管理员账户存在
 */
async function ensureSuperAdmin() {
  try {
    if (!isConnected()) return
    
    const adminExists = await User.findOne({ role: 'superadmin' })
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@mbti.com',
        password: '123456',
        role: 'superadmin',
        status: 'active'
      })
      console.log('✅ 超级管理员账户已创建 (admin / 123456)')
    }
  } catch (error) {
    console.error('创建超级管理员失败:', error)
  }
}

/**
 * 初始化内存数据（降级模式）
 */
function initMemoryData() {
  // 创建默认管理员（不设置password字段，让登录逻辑走内存模式验证）
  memoryStore.users.set('admin-001', {
    _id: 'admin-001',
    username: 'admin',
    email: 'admin@mbti.com',
    role: 'superadmin',
    status: 'active',
    avatar: '',
    mbtiType: '',
    createdAt: new Date(),
    updatedAt: new Date()
  })
}

// ==================== 用户服务 ====================

export const userService = {
  /**
   * 创建用户
   */
  async createUser(userData: Partial<IUser>) {
    try {
      if (isConnected()) {
        return await User.create(userData)
      }
      
      const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const user = { _id: id, ...userData, createdAt: new Date(), updatedAt: new Date() }
      memoryStore.users.set(id, user)
      return user
    } catch (error) {
      console.error('创建用户失败:', error)
      throw error
    }
  },

  /**
   * 根据ID获取用户
   */
  async getUserById(id: string) {
    try {
      if (isConnected()) {
        return await User.findById(id)
      }
      return memoryStore.users.get(id) || null
    } catch (error) {
      return memoryStore.users.get(id) || null
    }
  },

  /**
   * 根据openId获取用户
   */
  async getUserByOpenId(openId: string) {
    try {
      if (isConnected()) {
        return await User.findOne({ openId })
      }
      for (const user of memoryStore.users.values()) {
        if (user.openId === openId) return user
      }
      return null
    } catch (error) {
      return null
    }
  },

  /**
   * 根据用户名或邮箱查找用户
   */
  async findByUsernameOrEmail(identifier: string) {
    // 先尝试MongoDB
    try {
      if (isConnected()) {
        const user = await User.findOne({
          $or: [{ username: identifier }, { email: identifier }]
        }).select('+password')
        if (user) return user
      }
    } catch (error) {
      console.warn('MongoDB查询失败，降级到内存模式:', (error as any)?.codeName || error)
    }
    
    // 降级到内存模式
    if (memoryStore.users.size === 0) {
      initMemoryData()
    }
    for (const user of memoryStore.users.values()) {
      if (user.username === identifier || user.email === identifier) return user
    }
    return null
  },

  /**
   * 更新用户
   */
  async updateUser(id: string, data: Partial<IUser>) {
    try {
      if (isConnected()) {
        return await User.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true })
      }
      const user = memoryStore.users.get(id)
      if (user) {
        Object.assign(user, data, { updatedAt: new Date() })
        return user
      }
      return null
    } catch (error) {
      return null
    }
  },

  /**
   * 获取所有用户（分页）
   */
  async getUsers(page = 1, limit = 20, filters: any = {}) {
    try {
      if (isConnected()) {
        const query: any = {}
        if (filters.role) query.role = filters.role
        if (filters.status) query.status = filters.status
        if (filters.search) {
          query.$or = [
            { username: { $regex: filters.search, $options: 'i' } },
            { email: { $regex: filters.search, $options: 'i' } }
          ]
        }
        
        const total = await User.countDocuments(query)
        const users = await User.find(query)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
        
        return { users, total, page, limit, pages: Math.ceil(total / limit) }
      }
      
      const allUsers = Array.from(memoryStore.users.values())
      return {
        users: allUsers.slice((page - 1) * limit, page * limit),
        total: allUsers.length,
        page,
        limit,
        pages: Math.ceil(allUsers.length / limit)
      }
    } catch (error) {
      return { users: [], total: 0, page, limit, pages: 0 }
    }
  },

  /**
   * 获取用户统计
   */
  async getStats() {
    try {
      if (isConnected()) {
        const total = await User.countDocuments()
        const active = await User.countDocuments({ status: 'active' })
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const newToday = await User.countDocuments({ createdAt: { $gte: today } })
        const admins = await User.countDocuments({ role: { $in: ['admin', 'superadmin'] } })
        
        return { total, active, newToday, admins }
      }
      return { total: memoryStore.users.size, active: memoryStore.users.size, newToday: 0, admins: 1 }
    } catch (error) {
      return { total: 0, active: 0, newToday: 0, admins: 0 }
    }
  },

  /**
   * 删除用户
   */
  async deleteUser(id: string) {
    try {
      if (isConnected()) {
        return await User.findByIdAndDelete(id)
      }
      memoryStore.users.delete(id)
      return true
    } catch (error) {
      return null
    }
  }
}

// ==================== 测试结果服务 ====================

export const testResultService = {
  /**
   * 保存测试结果
   */
  async saveResult(data: any) {
    // 先尝试MongoDB
    try {
      if (isConnected()) {
        const result = await TestResult.create(data)
        if (data.userId) {
          await User.findByIdAndUpdate(data.userId, {
            $push: { testHistory: result._id },
            mbtiType: data.mbtiType
          })
        }
        return result
      }
    } catch (error) {
      console.warn('MongoDB保存测试结果失败，降级到内存模式')
    }
    
    // 降级到内存模式
    const id = `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const result = { _id: id, ...data, createdAt: new Date() }
    memoryStore.testResults.set(id, result)
    return result
  },

  /**
   * 根据ID获取测试结果
   */
  async getResultById(id: string) {
    try {
      if (isConnected()) {
        return await TestResult.findById(id)
      }
      return memoryStore.testResults.get(id) || null
    } catch (error) {
      return null
    }
  },

  /**
   * 获取用户测试历史
   */
  async getUserResults(userId: string, page = 1, limit = 20) {
    try {
      if (isConnected()) {
        const total = await TestResult.countDocuments({ userId })
        const results = await TestResult.find({ userId })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
        
        return { results, total, page, limit }
      }
      
      const allResults = Array.from(memoryStore.testResults.values())
        .filter(r => r.userId === userId)
      return {
        results: allResults.slice((page - 1) * limit, page * limit),
        total: allResults.length,
        page,
        limit
      }
    } catch (error) {
      return { results: [], total: 0, page, limit }
    }
  },

  /**
   * 获取测试统计
   */
  async getStats() {
    try {
      if (isConnected()) {
        const total = await TestResult.countDocuments()
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayCount = await TestResult.countDocuments({ createdAt: { $gte: today } })
        
        // MBTI类型分布
        const typeDistribution = await TestResult.aggregate([
          { $group: { _id: '$mbtiType', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ])
        
        // 平均置信度
        const avgConfidence = await TestResult.aggregate([
          { $group: { _id: null, avg: { $avg: '$confidence' } } }
        ])
        
        return {
          total,
          todayCount,
          typeDistribution,
          avgConfidence: avgConfidence[0]?.avg || 0
        }
      }
      return {
        total: memoryStore.testResults.size,
        todayCount: 0,
        typeDistribution: [],
        avgConfidence: 0
      }
    } catch (error) {
      return { total: 0, todayCount: 0, typeDistribution: [], avgConfidence: 0 }
    }
  }
}

// ==================== 订单服务 ====================

export const orderService = {
  /**
   * 创建订单
   */
  async createOrder(data: any) {
    // 先尝试MongoDB
    try {
      if (isConnected()) {
        return await Order.create(data)
      }
    } catch (error) {
      console.warn('MongoDB创建订单失败，降级到内存模式')
    }
    
    // 降级到内存模式
    const id = data.orderId || `order_${Date.now()}`
    const order = { _id: id, ...data, createdAt: new Date(), status: data.status || 'pending' }
    memoryStore.orders.set(id, order)
    return order
  },

  /**
   * 更新订单状态
   */
  async updateOrderStatus(orderId: string, status: string, extra?: any) {
    try {
      if (isConnected()) {
        return await Order.findOneAndUpdate(
          { orderId },
          { status, ...extra, updatedAt: new Date() },
          { new: true }
        )
      }
      
      const order = memoryStore.orders.get(orderId)
      if (order) {
        Object.assign(order, { status, ...extra, updatedAt: new Date() })
        return order
      }
      return null
    } catch (error) {
      return null
    }
  },

  /**
   * 查询订单
   */
  async getOrder(orderId: string) {
    try {
      if (isConnected()) {
        return await Order.findOne({ orderId })
      }
      return memoryStore.orders.get(orderId) || null
    } catch (error) {
      return null
    }
  },

  /**
   * 获取用户订单
   */
  async getUserOrders(userId: string, page = 1, limit = 20) {
    try {
      if (isConnected()) {
        const total = await Order.countDocuments({ userId })
        const orders = await Order.find({ userId })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
        return { orders, total, page, limit }
      }
      
      const allOrders = Array.from(memoryStore.orders.values())
        .filter(o => o.userId === userId)
      return {
        orders: allOrders.slice((page - 1) * limit, page * limit),
        total: allOrders.length,
        page,
        limit
      }
    } catch (error) {
      return { orders: [], total: 0, page, limit }
    }
  },

  /**
   * 获取订单统计
   */
  async getStats() {
    try {
      if (isConnected()) {
        const total = await Order.countDocuments()
        const completed = await Order.countDocuments({ status: 'completed' })
        const revenue = await Order.aggregate([
          { $match: { status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayRevenue = await Order.aggregate([
          { $match: { status: 'completed', createdAt: { $gte: today } } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
        
        return {
          total,
          completed,
          totalRevenue: (revenue[0]?.total || 0) / 100,
          todayRevenue: (todayRevenue[0]?.total || 0) / 100
        }
      }
      return { total: 0, completed: 0, totalRevenue: 0, todayRevenue: 0 }
    } catch (error) {
      return { total: 0, completed: 0, totalRevenue: 0, todayRevenue: 0 }
    }
  }
}

// ==================== 照片服务 ====================

export const photoService = {
  async addPhoto(data: any) {
    const id = `photo_${Date.now()}`
    const photo = { _id: id, ...data, createdAt: new Date() }
    memoryStore.photos.set(id, photo)
    return photo
  },

  async getUserPhotos(userId: string) {
    return Array.from(memoryStore.photos.values())
      .filter(p => p.userId === userId)
  }
}

// ==================== 获取数据库实例（兼容旧代码） ====================

class DatabaseProxy {
  getUserById(id: string) {
    return memoryStore.users.get(id) || null
  }
  
  updateUser(user: any) {
    if (user._id || user.id) {
      memoryStore.users.set(user._id || user.id, user)
    }
  }
  
  createUser(data: any) {
    const id = data._id || `user_${Date.now()}`
    memoryStore.users.set(id, { _id: id, ...data })
    return memoryStore.users.get(id)
  }
}

const dbProxy = new DatabaseProxy()

export function getDatabase() {
  return dbProxy
}

export default {
  initDatabase,
  userService,
  testResultService,
  orderService,
  photoService,
  getDatabase,
}
