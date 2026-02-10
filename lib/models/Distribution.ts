import mongoose, { Document, Schema } from 'mongoose'

// ==================== 佣金记录接口 ====================
export interface ICommission extends Document {
  commissionId: string           // 佣金记录ID
  distributorId: string          // 分销商用户ID（获得佣金的人）
  orderId: string                // 关联订单ID
  buyerId: string                // 购买者ID
  buyerName?: string             // 购买者昵称
  orderAmount: number            // 订单金额（分）
  commissionRate: number         // 佣金比例（百分比，如 10 代表 10%）
  commissionAmount: number       // 佣金金额（分）
  level: number                  // 分销层级（1=直推，2=间推）
  productType: string            // 产品类型
  productDetail?: string         // 产品详情
  status: 'pending' | 'confirmed' | 'settled' | 'cancelled'  // 待确认/已确认/已结算/已取消
  settledAt?: Date               // 结算时间
  createdAt: Date
  updatedAt: Date
}

// 佣金记录模式
const CommissionSchema = new Schema<ICommission>({
  commissionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  distributorId: {
    type: String,
    required: true,
    index: true
  },
  orderId: {
    type: String,
    required: true,
    index: true
  },
  buyerId: {
    type: String,
    required: true
  },
  buyerName: {
    type: String,
    default: ''
  },
  orderAmount: {
    type: Number,
    required: true,
    min: 0
  },
  commissionRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  commissionAmount: {
    type: Number,
    required: true,
    min: 0
  },
  level: {
    type: Number,
    required: true,
    enum: [1, 2],  // 最多二级分销
    default: 1
  },
  productType: {
    type: String,
    required: true
  },
  productDetail: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'settled', 'cancelled'],
    default: 'pending'
  },
  settledAt: {
    type: Date
  }
}, {
  timestamps: true
})

// 索引
CommissionSchema.index({ distributorId: 1, createdAt: -1 })
CommissionSchema.index({ orderId: 1 })
CommissionSchema.index({ status: 1 })
CommissionSchema.index({ createdAt: -1 })

// ==================== 提现记录接口 ====================
export interface IWithdrawal extends Document {
  withdrawalId: string           // 提现记录ID
  userId: string                 // 用户ID
  amount: number                 // 提现金额（分）
  method: 'wechat' | 'alipay' | 'bank'  // 提现方式
  account?: string               // 提现账户（脱敏）
  realName?: string              // 真实姓名
  status: 'pending' | 'approved' | 'rejected' | 'completed'  // 待审核/已通过/已拒绝/已完成
  remark?: string                // 备注（拒绝原因等）
  reviewedBy?: string            // 审核人
  reviewedAt?: Date              // 审核时间
  completedAt?: Date             // 到账时间
  createdAt: Date
  updatedAt: Date
}

// 提现记录模式
const WithdrawalSchema = new Schema<IWithdrawal>({
  withdrawalId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 100  // 最低提现1元（100分）
  },
  method: {
    type: String,
    required: true,
    enum: ['wechat', 'alipay', 'bank'],
    default: 'wechat'
  },
  account: {
    type: String,
    default: ''
  },
  realName: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  remark: {
    type: String,
    default: ''
  },
  reviewedBy: {
    type: String
  },
  reviewedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
})

// 索引
WithdrawalSchema.index({ userId: 1, createdAt: -1 })
WithdrawalSchema.index({ status: 1 })
WithdrawalSchema.index({ createdAt: -1 })

// ==================== 分销配置接口 ====================
export interface IDistributionConfig extends Document {
  configKey: string              // 配置键
  // 佣金比例配置
  level1Rate: number             // 一级分销佣金比例（%）
  level2Rate: number             // 二级分销佣金比例（%）
  // 产品专属佣金比例（覆盖默认）
  productRates: {
    productType: string
    level1Rate: number
    level2Rate: number
  }[]
  // 提现配置
  minWithdrawAmount: number      // 最低提现金额（分）
  withdrawFeeRate: number        // 提现手续费比例（%）
  autoSettleDays: number         // 自动结算天数（订单完成后N天自动结算佣金）
  // 分销等级门槛
  levelThresholds: {
    level: string                // 等级名称
    minTeamSize: number          // 最低团队人数
    minTotalSales: number        // 最低总销售额（分）
    bonusRate: number            // 额外奖励比例（%）
  }[]
  // 开关
  enabled: boolean               // 分销功能是否启用
  level2Enabled: boolean         // 是否开启二级分销
  updatedAt: Date
}

// 分销配置模式
const DistributionConfigSchema = new Schema<IDistributionConfig>({
  configKey: {
    type: String,
    required: true,
    unique: true,
    default: 'default'
  },
  level1Rate: {
    type: Number,
    default: 20,  // 默认一级分销20%
    min: 0,
    max: 50
  },
  level2Rate: {
    type: Number,
    default: 10,  // 默认二级分销10%
    min: 0,
    max: 30
  },
  productRates: [{
    productType: { type: String, required: true },
    level1Rate: { type: Number, default: 20 },
    level2Rate: { type: Number, default: 10 }
  }],
  minWithdrawAmount: {
    type: Number,
    default: 1000,  // 默认最低10元（1000分）提现
    min: 100
  },
  withdrawFeeRate: {
    type: Number,
    default: 0,  // 默认无手续费
    min: 0,
    max: 10
  },
  autoSettleDays: {
    type: Number,
    default: 7,  // 默认7天自动结算
    min: 0,
    max: 30
  },
  levelThresholds: [{
    level: { type: String, required: true },
    minTeamSize: { type: Number, default: 0 },
    minTotalSales: { type: Number, default: 0 },
    bonusRate: { type: Number, default: 0 }
  }],
  enabled: {
    type: Boolean,
    default: true
  },
  level2Enabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// 防止重复编译
const Commission = mongoose.models.Commission || mongoose.model<ICommission>('Commission', CommissionSchema)
const Withdrawal = mongoose.models.Withdrawal || mongoose.model<IWithdrawal>('Withdrawal', WithdrawalSchema)
const DistributionConfig = mongoose.models.DistributionConfig || mongoose.model<IDistributionConfig>('DistributionConfig', DistributionConfigSchema)

export { Commission, Withdrawal, DistributionConfig }
export default { Commission, Withdrawal, DistributionConfig }
