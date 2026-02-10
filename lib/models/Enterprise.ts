import mongoose, { Document, Schema } from 'mongoose'

// 企业接口
export interface IEnterprise extends Document {
  name: string                    // 企业/项目名称
  contact: string                 // 联系人
  phone: string                   // 联系电话
  email?: string                  // 邮箱
  status: 'active' | 'trial' | 'inactive'  // 状态：运营中/试用/已停用
  balance: number                 // 账户余额（分）
  usedTests: number               // 已使用测试次数
  remainingTests: number          // 剩余测试次数
  userCount: number               // 关联用户数
  // 来源信息（从存客宝同步）
  sourceId?: number               // 存客宝 companyId
  sourcePlatform?: string         // 来源平台（cunkebao/manual）
  // 扩展信息
  industry?: string               // 行业
  address?: string                // 地址
  licenseNumber?: string          // 营业执照号
  memo?: string                   // 备注
  // 管理员用户ID
  adminUserId?: mongoose.Types.ObjectId  // 企业管理员用户ID
  createdAt: Date
  updatedAt: Date
}

// 企业模式
const EnterpriseSchema = new Schema<IEnterprise>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  contact: {
    type: String,
    trim: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'trial', 'inactive'],
    default: 'trial'
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  usedTests: {
    type: Number,
    default: 0,
    min: 0
  },
  remainingTests: {
    type: Number,
    default: 0,
    min: 0
  },
  userCount: {
    type: Number,
    default: 0,
    min: 0
  },
  sourceId: {
    type: Number,
    sparse: true
  },
  sourcePlatform: {
    type: String,
    default: 'manual'
  },
  industry: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  licenseNumber: {
    type: String,
    default: ''
  },
  memo: {
    type: String,
    default: ''
  },
  adminUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// 索引
EnterpriseSchema.index({ name: 1 })
EnterpriseSchema.index({ status: 1 })
EnterpriseSchema.index({ sourceId: 1 })
EnterpriseSchema.index({ createdAt: -1 })

// 防止重复编译模型
const Enterprise = mongoose.models.Enterprise || mongoose.model<IEnterprise>('Enterprise', EnterpriseSchema)

export default Enterprise
