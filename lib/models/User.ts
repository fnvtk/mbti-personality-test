import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

// 用户接口
export interface IUser extends Document {
  username: string
  email?: string
  phone?: string
  password?: string
  avatar?: string
  openId?: string
  mbtiType?: string
  discType?: string
  pdpType?: string
  isEnterprise: boolean
  enterpriseId?: mongoose.Types.ObjectId
  testHistory: mongoose.Types.ObjectId[]
  role: 'user' | 'admin' | 'enterprise_admin' | 'superadmin'
  status: 'active' | 'inactive' | 'banned'
  lastLoginAt?: Date
  // 分销相关字段
  inviteCode?: string              // 邀请码（唯一，6位字母数字）
  inviterId?: string               // 邀请人用户ID
  inviterCode?: string             // 邀请人的邀请码（冗余，方便查询）
  distributionLevel: string        // 分销等级：normal/silver/gold/diamond
  totalEarnings: number            // 累计收益（分）
  withdrawableBalance: number      // 可提现余额（分）
  frozenBalance: number            // 冻结余额（分）- 待结算佣金
  totalWithdrawn: number           // 累计已提现（分）
  teamSize: number                 // 直推团队人数
  totalTeamSize: number            // 总团队人数（含间推）
  totalSales: number               // 累计销售额（分）- 团队总业绩
  isDistributor: boolean           // 是否为分销商（扫码绑定后即为分销商）
  distributorSince?: Date          // 成为分销商的时间
  // VIP相关
  vipInfo?: {
    isVIP: boolean
    vipType: string
    expireDate: string
    purchaseDate: string
  }
  testCount?: number               // 剩余测试次数
  unlockedTests?: string[]         // 已解锁的测试类型
  createdAt: Date
  updatedAt: Date
  comparePassword(password: string): Promise<boolean>
}

// 用户模式
const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    match: /^1[3-9]\d{9}$/
  },
  password: {
    type: String,
    minlength: 6,
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  mbtiType: {
    type: String,
    enum: [
      '', 'INTJ', 'INTP', 'ENTJ', 'ENTP',
      'INFJ', 'INFP', 'ENFJ', 'ENFP',
      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
      'ISTP', 'ISFP', 'ESTP', 'ESFP'
    ],
    default: ''
  },
  discType: {
    type: String,
    default: ''
  },
  pdpType: {
    type: String,
    default: ''
  },
  isEnterprise: {
    type: Boolean,
    default: false
  },
  enterpriseId: {
    type: Schema.Types.ObjectId,
    ref: 'Enterprise'
  },
  testHistory: [{
    type: Schema.Types.ObjectId,
    ref: 'TestResult'
  }],
  role: {
    type: String,
    enum: ['user', 'admin', 'enterprise_admin', 'superadmin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active'
  },
  lastLoginAt: {
    type: Date
  },
  // 分销相关字段
  inviteCode: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  inviterId: {
    type: String,
    index: true
  },
  inviterCode: {
    type: String
  },
  distributionLevel: {
    type: String,
    enum: ['normal', 'silver', 'gold', 'diamond'],
    default: 'normal'
  },
  totalEarnings: {
    type: Number,
    default: 0,
    min: 0
  },
  withdrawableBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  frozenBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  totalWithdrawn: {
    type: Number,
    default: 0,
    min: 0
  },
  teamSize: {
    type: Number,
    default: 0,
    min: 0
  },
  totalTeamSize: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSales: {
    type: Number,
    default: 0,
    min: 0
  },
  isDistributor: {
    type: Boolean,
    default: false
  },
  distributorSince: {
    type: Date
  },
  // VIP相关
  vipInfo: {
    isVIP: { type: Boolean, default: false },
    vipType: { type: String, default: '' },
    expireDate: { type: String, default: '' },
    purchaseDate: { type: String, default: '' }
  },
  testCount: {
    type: Number,
    default: 0
  },
  unlockedTests: [{
    type: String
  }]
}, {
  timestamps: true
})

// 索引
UserSchema.index({ email: 1 })
UserSchema.index({ phone: 1 })
UserSchema.index({ mbtiType: 1 })
UserSchema.index({ enterpriseId: 1 })
UserSchema.index({ inviteCode: 1 })
UserSchema.index({ inviterId: 1 })
UserSchema.index({ isDistributor: 1 })
UserSchema.index({ createdAt: -1 })

// 生成唯一邀请码
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'  // 去掉容易混淆的 I/O/0/1
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// 保存前自动生成邀请码
UserSchema.pre('save', async function(next) {
  if (!this.inviteCode) {
    // 生成唯一邀请码，最多重试5次
    for (let i = 0; i < 5; i++) {
      const code = generateInviteCode()
      const existing = await mongoose.models.User?.findOne({ inviteCode: code })
      if (!existing) {
        this.inviteCode = code
        break
      }
    }
    if (!this.inviteCode) {
      this.inviteCode = generateInviteCode() + Math.floor(Math.random() * 10)
    }
  }
  next()
})

// 保存前加密密码
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next()
  }
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// 比较密码
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  if (!this.password) return false
  return bcrypt.compare(password, this.password)
}

// 防止重复编译模型
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
