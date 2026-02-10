// 数据库服务 - 支持MongoDB和内存存储双模式
// 当MongoDB可用时使用MongoDB，否则降级到内存存储

import { connectDB, isConnected } from './db'
import User, { IUser } from './models/User'
import TestResult, { ITestResult } from './models/TestResult'
import Order from './models/Order'
import Enterprise, { IEnterprise } from './models/Enterprise'
import { Commission, Withdrawal, DistributionConfig } from './models/Distribution'

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
  if (initialized && isConnected()) return
  
  // 无论如何先初始化内存数据（保底）
  initMemoryData()

  // 等待MongoDB连接完成（最多5秒超时）
  try {
    await connectDB()
    console.log('✅ 数据库初始化成功（MongoDB模式）')
    await ensureSuperAdmin().catch(e => console.error('创建管理员失败:', e))
  } catch (error) {
    console.warn('⚠️ MongoDB连接失败，继续使用内存存储模式')
  }
  
  initialized = true
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
            { email: { $regex: filters.search, $options: 'i' } },
            { phone: { $regex: filters.search, $options: 'i' } }
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

// ==================== 分销服务 ====================

export const distributionService = {
  /**
   * 获取分销配置
   */
  async getConfig() {
    try {
      if (isConnected()) {
        let config = await DistributionConfig.findOne({ configKey: 'default' })
        if (!config) {
          // 创建默认配置
          config = await DistributionConfig.create({
            configKey: 'default',
            level1Rate: 20,
            level2Rate: 10,
            productRates: [
              { productType: 'vip', level1Rate: 20, level2Rate: 10 },
              { productType: 'single_test', level1Rate: 30, level2Rate: 15 },
              { productType: 'test_count', level1Rate: 20, level2Rate: 10 },
              { productType: 'enterprise', level1Rate: 30, level2Rate: 15 },
            ],
            minWithdrawAmount: 1000,
            withdrawFeeRate: 0,
            autoSettleDays: 7,
            levelThresholds: [
              { level: '普通分销商', minTeamSize: 0, minTotalSales: 0, bonusRate: 0 },
              { level: '白银分销商', minTeamSize: 10, minTotalSales: 100000, bonusRate: 2 },
              { level: '黄金分销商', minTeamSize: 50, minTotalSales: 500000, bonusRate: 5 },
              { level: '钻石分销商', minTeamSize: 200, minTotalSales: 2000000, bonusRate: 8 },
            ],
            enabled: true,
            level2Enabled: true
          })
        }
        return config
      }
      // 降级返回默认配置
      return {
        level1Rate: 20,
        level2Rate: 10,
        productRates: [],
        minWithdrawAmount: 1000,
        withdrawFeeRate: 0,
        autoSettleDays: 7,
        levelThresholds: [],
        enabled: true,
        level2Enabled: true
      }
    } catch (error) {
      console.error('获取分销配置失败:', error)
      return null
    }
  },

  /**
   * 更新分销配置
   */
  async updateConfig(data: any) {
    try {
      if (isConnected()) {
        return await DistributionConfig.findOneAndUpdate(
          { configKey: 'default' },
          { ...data, updatedAt: new Date() },
          { new: true, upsert: true }
        )
      }
      return null
    } catch (error) {
      console.error('更新分销配置失败:', error)
      return null
    }
  },

  /**
   * 绑定邀请关系
   */
  async bindInviter(userId: string, inviteCode: string) {
    try {
      if (!isConnected()) return { success: false, message: '数据库未连接' }
      
      // 查找邀请人
      const inviter = await User.findOne({ inviteCode })
      if (!inviter) return { success: false, message: '邀请码无效' }
      
      // 查找当前用户
      const user = await User.findById(userId)
      if (!user) return { success: false, message: '用户不存在' }
      
      // 不能绑定自己
      if (inviter._id.toString() === userId) return { success: false, message: '不能绑定自己' }
      
      // 已经有邀请人了
      if (user.inviterId) return { success: false, message: '已绑定邀请人' }
      
      // 防止循环：检查邀请人的上级是否是自己
      if (inviter.inviterId === userId) return { success: false, message: '不能互相邀请' }
      
      // 绑定关系
      await User.findByIdAndUpdate(userId, {
        inviterId: inviter._id.toString(),
        inviterCode: inviteCode
      })
      
      // 更新邀请人团队数据
      await User.findByIdAndUpdate(inviter._id, {
        $inc: { teamSize: 1, totalTeamSize: 1 },
        isDistributor: true,
        distributorSince: inviter.distributorSince || new Date()
      })
      
      // 如果邀请人也有上级，更新上级的总团队数
      if (inviter.inviterId) {
        await User.findByIdAndUpdate(inviter.inviterId, {
          $inc: { totalTeamSize: 1 }
        })
      }
      
      return { success: true, message: '绑定成功', inviterName: inviter.username }
    } catch (error) {
      console.error('绑定邀请关系失败:', error)
      return { success: false, message: '绑定失败' }
    }
  },

  /**
   * 计算并创建佣金（支付成功后调用）
   */
  async calculateCommission(orderId: string) {
    try {
      if (!isConnected()) return null
      
      const order = await Order.findOne({ orderId })
      if (!order || !order.userId) return null
      
      // 获取购买者信息
      const buyer = await User.findById(order.userId)
      if (!buyer || !buyer.inviterId) return null  // 没有邀请人，不计算佣金
      
      // 获取分销配置
      const config = await this.getConfig()
      if (!config || !config.enabled) return null
      
      // 获取产品专属佣金比例
      let level1Rate = config.level1Rate
      let level2Rate = config.level2Rate
      const productConfig = config.productRates?.find(
        (p: any) => p.productType === order.productType
      )
      if (productConfig) {
        level1Rate = productConfig.level1Rate
        level2Rate = productConfig.level2Rate
      }
      
      const results = []
      
      // 一级佣金（直推）
      const level1Amount = Math.floor(order.amount * level1Rate / 100)
      if (level1Amount > 0) {
        const commission1 = await Commission.create({
          commissionId: `comm_${Date.now()}_l1_${Math.random().toString(36).substr(2, 6)}`,
          distributorId: buyer.inviterId,
          orderId: order.orderId,
          buyerId: order.userId,
          buyerName: buyer.username || '',
          orderAmount: order.amount,
          commissionRate: level1Rate,
          commissionAmount: level1Amount,
          level: 1,
          productType: order.productType,
          productDetail: order.productDetail || '',
          status: 'pending'
        })
        results.push(commission1)
        
        // 更新一级推荐人余额
        await User.findByIdAndUpdate(buyer.inviterId, {
          $inc: {
            frozenBalance: level1Amount,
            totalSales: order.amount
          }
        })
        
        // 更新订单分销信息
        await Order.findOneAndUpdate({ orderId }, {
          referrerId: buyer.inviterId,
          referrerCode: buyer.inviterCode,
          commissionAmount: level1Amount,
          commissionStatus: 'pending'
        })
      }
      
      // 二级佣金（间推）
      if (config.level2Enabled) {
        const inviter = await User.findById(buyer.inviterId)
        if (inviter && inviter.inviterId) {
          const level2Amount = Math.floor(order.amount * level2Rate / 100)
          if (level2Amount > 0) {
            const commission2 = await Commission.create({
              commissionId: `comm_${Date.now()}_l2_${Math.random().toString(36).substr(2, 6)}`,
              distributorId: inviter.inviterId,
              orderId: order.orderId,
              buyerId: order.userId,
              buyerName: buyer.username || '',
              orderAmount: order.amount,
              commissionRate: level2Rate,
              commissionAmount: level2Amount,
              level: 2,
              productType: order.productType,
              productDetail: order.productDetail || '',
              status: 'pending'
            })
            results.push(commission2)
            
            // 更新二级推荐人余额
            await User.findByIdAndUpdate(inviter.inviterId, {
              $inc: { frozenBalance: level2Amount }
            })
            
            // 更新订单二级分销信息
            await Order.findOneAndUpdate({ orderId }, {
              level2ReferrerId: inviter.inviterId,
              level2CommissionAmount: level2Amount
            })
          }
        }
      }
      
      return results
    } catch (error) {
      console.error('计算佣金失败:', error)
      return null
    }
  },

  /**
   * 结算佣金（自动结算或手动结算）
   */
  async settleCommission(commissionId: string) {
    try {
      if (!isConnected()) return null
      
      const commission = await Commission.findOne({ commissionId })
      if (!commission || commission.status !== 'pending') return null
      
      // 更新佣金状态
      await Commission.findOneAndUpdate({ commissionId }, {
        status: 'settled',
        settledAt: new Date()
      })
      
      // 将冻结余额转为可提现余额
      await User.findByIdAndUpdate(commission.distributorId, {
        $inc: {
          frozenBalance: -commission.commissionAmount,
          withdrawableBalance: commission.commissionAmount,
          totalEarnings: commission.commissionAmount
        }
      })
      
      return commission
    } catch (error) {
      console.error('结算佣金失败:', error)
      return null
    }
  },

  /**
   * 批量结算超期佣金
   */
  async autoSettleCommissions() {
    try {
      if (!isConnected()) return 0
      
      const config = await this.getConfig()
      if (!config) return 0
      
      const settleDate = new Date()
      settleDate.setDate(settleDate.getDate() - config.autoSettleDays)
      
      const pendingCommissions = await Commission.find({
        status: 'pending',
        createdAt: { $lte: settleDate }
      })
      
      let settledCount = 0
      for (const comm of pendingCommissions) {
        await this.settleCommission(comm.commissionId)
        settledCount++
      }
      
      return settledCount
    } catch (error) {
      console.error('批量结算佣金失败:', error)
      return 0
    }
  },

  /**
   * 获取用户佣金记录
   */
  async getUserCommissions(userId: string, page = 1, limit = 20, status?: string) {
    try {
      if (isConnected()) {
        const query: any = { distributorId: userId }
        if (status) query.status = status
        
        const total = await Commission.countDocuments(query)
        const commissions = await Commission.find(query)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
        
        return { commissions, total, page, limit, pages: Math.ceil(total / limit) }
      }
      return { commissions: [], total: 0, page, limit, pages: 0 }
    } catch (error) {
      return { commissions: [], total: 0, page, limit, pages: 0 }
    }
  },

  /**
   * 获取用户分销统计
   */
  async getUserDistributionStats(userId: string) {
    try {
      if (!isConnected()) return null
      
      const user = await User.findById(userId)
      if (!user) return null
      
      // 今日佣金
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayCommissions = await Commission.aggregate([
        { $match: { distributorId: userId, createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$commissionAmount' }, count: { $sum: 1 } } }
      ])
      
      // 本月佣金
      const monthStart = new Date()
      monthStart.setDate(1)
      monthStart.setHours(0, 0, 0, 0)
      const monthCommissions = await Commission.aggregate([
        { $match: { distributorId: userId, createdAt: { $gte: monthStart } } },
        { $group: { _id: null, total: { $sum: '$commissionAmount' }, count: { $sum: 1 } } }
      ])
      
      // 直推团队
      const directTeam = await User.countDocuments({ inviterId: userId })
      
      // 间推团队
      const directMembers = await User.find({ inviterId: userId }).select('_id')
      const directIds = directMembers.map(m => m._id.toString())
      const indirectTeam = directIds.length > 0 
        ? await User.countDocuments({ inviterId: { $in: directIds } })
        : 0
      
      return {
        totalEarnings: user.totalEarnings || 0,
        withdrawableBalance: user.withdrawableBalance || 0,
        frozenBalance: user.frozenBalance || 0,
        totalWithdrawn: user.totalWithdrawn || 0,
        todayEarnings: todayCommissions[0]?.total || 0,
        todayOrders: todayCommissions[0]?.count || 0,
        monthEarnings: monthCommissions[0]?.total || 0,
        monthOrders: monthCommissions[0]?.count || 0,
        directTeam,
        indirectTeam,
        totalTeam: directTeam + indirectTeam,
        totalSales: user.totalSales || 0,
        distributionLevel: user.distributionLevel || 'normal',
        inviteCode: user.inviteCode || ''
      }
    } catch (error) {
      console.error('获取分销统计失败:', error)
      return null
    }
  },

  /**
   * 获取用户团队成员
   */
  async getTeamMembers(userId: string, level: 1 | 2 = 1, page = 1, limit = 20) {
    try {
      if (!isConnected()) return { members: [], total: 0, page, limit }
      
      let query: any
      if (level === 1) {
        query = { inviterId: userId }
      } else {
        // 二级：先找一级成员，再找他们的下线
        const directMembers = await User.find({ inviterId: userId }).select('_id')
        const directIds = directMembers.map(m => m._id.toString())
        query = { inviterId: { $in: directIds } }
      }
      
      const total = await User.countDocuments(query)
      const members = await User.find(query)
        .select('username avatar phone createdAt totalSales teamSize')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
      
      return { members, total, page, limit, pages: Math.ceil(total / limit) }
    } catch (error) {
      return { members: [], total: 0, page, limit, pages: 0 }
    }
  },

  /**
   * 创建提现申请
   */
  async createWithdrawal(userId: string, amount: number, method: string, account?: string, realName?: string) {
    try {
      if (!isConnected()) return { success: false, message: '数据库未连接' }
      
      const user = await User.findById(userId)
      if (!user) return { success: false, message: '用户不存在' }
      
      const config = await this.getConfig()
      if (!config) return { success: false, message: '配置获取失败' }
      
      // 检查最低提现金额
      if (amount < config.minWithdrawAmount) {
        return { success: false, message: `最低提现${config.minWithdrawAmount / 100}元` }
      }
      
      // 检查余额
      if (amount > (user.withdrawableBalance || 0)) {
        return { success: false, message: '余额不足' }
      }
      
      // 计算手续费
      const fee = Math.floor(amount * config.withdrawFeeRate / 100)
      const actualAmount = amount - fee
      
      // 创建提现记录
      const withdrawal = await Withdrawal.create({
        withdrawalId: `wd_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        userId,
        amount: actualAmount,
        method: method || 'wechat',
        account: account || '',
        realName: realName || '',
        status: 'pending'
      })
      
      // 扣减可提现余额
      await User.findByIdAndUpdate(userId, {
        $inc: { withdrawableBalance: -amount }
      })
      
      return { success: true, message: '提现申请已提交', withdrawal }
    } catch (error) {
      console.error('创建提现申请失败:', error)
      return { success: false, message: '提现申请失败' }
    }
  },

  /**
   * 审核提现申请
   */
  async reviewWithdrawal(withdrawalId: string, approved: boolean, reviewedBy: string, remark?: string) {
    try {
      if (!isConnected()) return null
      
      const withdrawal = await Withdrawal.findOne({ withdrawalId })
      if (!withdrawal || withdrawal.status !== 'pending') return null
      
      if (approved) {
        await Withdrawal.findOneAndUpdate({ withdrawalId }, {
          status: 'approved',
          reviewedBy,
          reviewedAt: new Date(),
          remark: remark || '审核通过'
        })
        
        // 更新用户已提现金额
        await User.findByIdAndUpdate(withdrawal.userId, {
          $inc: { totalWithdrawn: withdrawal.amount }
        })
      } else {
        // 退回余额
        await Withdrawal.findOneAndUpdate({ withdrawalId }, {
          status: 'rejected',
          reviewedBy,
          reviewedAt: new Date(),
          remark: remark || '审核未通过'
        })
        
        await User.findByIdAndUpdate(withdrawal.userId, {
          $inc: { withdrawableBalance: withdrawal.amount }
        })
      }
      
      return withdrawal
    } catch (error) {
      console.error('审核提现失败:', error)
      return null
    }
  },

  /**
   * 获取提现记录列表
   */
  async getWithdrawals(filters: any = {}, page = 1, limit = 20) {
    try {
      if (!isConnected()) return { withdrawals: [], total: 0, page, limit }
      
      const query: any = {}
      if (filters.userId) query.userId = filters.userId
      if (filters.status) query.status = filters.status
      
      const total = await Withdrawal.countDocuments(query)
      const withdrawals = await Withdrawal.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
      
      return { withdrawals, total, page, limit, pages: Math.ceil(total / limit) }
    } catch (error) {
      return { withdrawals: [], total: 0, page, limit, pages: 0 }
    }
  },

  /**
   * 获取分销总览统计（管理后台用）
   */
  async getOverviewStats() {
    try {
      if (!isConnected()) return null
      
      // 分销商总数
      const totalDistributors = await User.countDocuments({ isDistributor: true })
      
      // 今日新增分销商
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const newDistributorsToday = await User.countDocuments({
        isDistributor: true,
        distributorSince: { $gte: today }
      })
      
      // 总佣金
      const totalCommissions = await Commission.aggregate([
        { $match: { status: { $in: ['pending', 'confirmed', 'settled'] } } },
        { $group: { _id: null, total: { $sum: '$commissionAmount' } } }
      ])
      
      // 今日佣金
      const todayCommissions = await Commission.aggregate([
        { $match: { createdAt: { $gte: today }, status: { $in: ['pending', 'confirmed', 'settled'] } } },
        { $group: { _id: null, total: { $sum: '$commissionAmount' }, count: { $sum: 1 } } }
      ])
      
      // 待结算佣金
      const pendingCommissions = await Commission.aggregate([
        { $match: { status: 'pending' } },
        { $group: { _id: null, total: { $sum: '$commissionAmount' }, count: { $sum: 1 } } }
      ])
      
      // 待审核提现
      const pendingWithdrawals = await Withdrawal.aggregate([
        { $match: { status: 'pending' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ])
      
      // 已完成提现
      const completedWithdrawals = await Withdrawal.aggregate([
        { $match: { status: { $in: ['approved', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
      
      // 最近7天佣金趋势
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const dailyCommissions = await Commission.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            total: { $sum: '$commissionAmount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
      
      // 分销商等级分布
      const levelDistribution = await User.aggregate([
        { $match: { isDistributor: true } },
        { $group: { _id: '$distributionLevel', count: { $sum: 1 } } }
      ])
      
      // 产品佣金分布
      const productCommissions = await Commission.aggregate([
        { $group: { _id: '$productType', total: { $sum: '$commissionAmount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } }
      ])
      
      return {
        totalDistributors,
        newDistributorsToday,
        totalCommissionAmount: totalCommissions[0]?.total || 0,
        todayCommissionAmount: todayCommissions[0]?.total || 0,
        todayCommissionCount: todayCommissions[0]?.count || 0,
        pendingCommissionAmount: pendingCommissions[0]?.total || 0,
        pendingCommissionCount: pendingCommissions[0]?.count || 0,
        pendingWithdrawAmount: pendingWithdrawals[0]?.total || 0,
        pendingWithdrawCount: pendingWithdrawals[0]?.count || 0,
        completedWithdrawAmount: completedWithdrawals[0]?.total || 0,
        dailyCommissions,
        levelDistribution,
        productCommissions
      }
    } catch (error) {
      console.error('获取分销总览统计失败:', error)
      return null
    }
  },

  /**
   * 获取分销商列表（管理后台用）
   */
  async getDistributors(page = 1, limit = 20, filters: any = {}) {
    try {
      if (!isConnected()) return { distributors: [], total: 0, page, limit }
      
      const query: any = { isDistributor: true }
      if (filters.level) query.distributionLevel = filters.level
      if (filters.search) {
        query.$or = [
          { username: { $regex: filters.search, $options: 'i' } },
          { phone: { $regex: filters.search, $options: 'i' } },
          { inviteCode: { $regex: filters.search, $options: 'i' } }
        ]
      }
      
      const total = await User.countDocuments(query)
      const distributors = await User.find(query)
        .select('username avatar phone inviteCode distributionLevel totalEarnings withdrawableBalance frozenBalance teamSize totalTeamSize totalSales distributorSince createdAt')
        .sort({ totalEarnings: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
      
      return { distributors, total, page, limit, pages: Math.ceil(total / limit) }
    } catch (error) {
      return { distributors: [], total: 0, page, limit, pages: 0 }
    }
  },

  /**
   * 获取所有佣金记录（管理后台用）
   */
  async getAllCommissions(page = 1, limit = 20, filters: any = {}) {
    try {
      if (!isConnected()) return { commissions: [], total: 0, page, limit }
      
      const query: any = {}
      if (filters.status) query.status = filters.status
      if (filters.level) query.level = filters.level
      if (filters.productType) query.productType = filters.productType
      if (filters.distributorId) query.distributorId = filters.distributorId
      
      const total = await Commission.countDocuments(query)
      const commissions = await Commission.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
      
      return { commissions, total, page, limit, pages: Math.ceil(total / limit) }
    } catch (error) {
      return { commissions: [], total: 0, page, limit, pages: 0 }
    }
  }
}

// ==================== 企业服务 ====================

export const enterpriseService = {
  /**
   * 获取企业列表（分页+筛选）
   */
  async getEnterprises(page = 1, limit = 50, filters: any = {}) {
    try {
      if (!isConnected()) return { enterprises: [], total: 0, page, limit, pages: 0 }

      const query: any = {}
      if (filters.status && filters.status !== 'all') query.status = filters.status
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { contact: { $regex: filters.search, $options: 'i' } },
          { phone: { $regex: filters.search, $options: 'i' } },
        ]
      }

      const total = await Enterprise.countDocuments(query)
      const enterprises = await Enterprise.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)

      return { enterprises, total, page, limit, pages: Math.ceil(total / limit) }
    } catch (error) {
      console.error('获取企业列表失败:', error)
      return { enterprises: [], total: 0, page, limit, pages: 0 }
    }
  },

  /**
   * 根据ID获取企业
   */
  async getEnterpriseById(id: string) {
    try {
      if (!isConnected()) return null
      return await Enterprise.findById(id)
    } catch (error) {
      return null
    }
  },

  /**
   * 创建企业
   */
  async createEnterprise(data: Partial<IEnterprise>) {
    try {
      if (!isConnected()) return null
      return await Enterprise.create(data)
    } catch (error) {
      console.error('创建企业失败:', error)
      return null
    }
  },

  /**
   * 更新企业
   */
  async updateEnterprise(id: string, data: Partial<IEnterprise>) {
    try {
      if (!isConnected()) return null
      return await Enterprise.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true })
    } catch (error) {
      return null
    }
  },

  /**
   * 企业充值
   */
  async rechargeEnterprise(id: string, amount: number) {
    try {
      if (!isConnected()) return null
      const enterprise = await Enterprise.findById(id)
      if (!enterprise) return null

      enterprise.balance += amount
      enterprise.remainingTests += Math.floor(amount / 50)
      enterprise.status = 'active'
      await enterprise.save()
      return enterprise
    } catch (error) {
      console.error('企业充值失败:', error)
      return null
    }
  },

  /**
   * 获取企业统计
   */
  async getStats() {
    try {
      if (!isConnected()) return null
      const total = await Enterprise.countDocuments()
      const active = await Enterprise.countDocuments({ status: 'active' })
      const trial = await Enterprise.countDocuments({ status: 'trial' })
      const inactive = await Enterprise.countDocuments({ status: 'inactive' })
      const balanceAgg = await Enterprise.aggregate([
        { $group: { _id: null, totalBalance: { $sum: '$balance' }, totalTests: { $sum: '$usedTests' } } }
      ])

      return {
        total,
        active,
        trial,
        inactive,
        totalBalance: balanceAgg[0]?.totalBalance || 0,
        totalTests: balanceAgg[0]?.totalTests || 0,
      }
    } catch (error) {
      return null
    }
  },

  /**
   * 获取企业关联的用户
   */
  async getEnterpriseUsers(enterpriseId: string, page = 1, limit = 20) {
    try {
      if (!isConnected()) return { users: [], total: 0, page, limit }

      const total = await User.countDocuments({ enterpriseId })
      const users = await User.find({ enterpriseId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)

      return { users, total, page, limit, pages: Math.ceil(total / limit) }
    } catch (error) {
      return { users: [], total: 0, page, limit, pages: 0 }
    }
  },
}

export default {
  initDatabase,
  userService,
  testResultService,
  orderService,
  photoService,
  enterpriseService,
  distributionService,
  getDatabase,
}

// ==================== Legacy 兼容导出 ====================
// 5-19-ai 前端页面需要的类型定义
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
  photos: any[]
  testResults: any[]
  faceAnalysis?: any
}

export interface TestResult {
  id: string
  userId: string
  testType: string
  result: any
  date: string
}

export interface Photo {
  id: string
  userId: string
  url: string
  angle: string
  uploadedAt: number
}
