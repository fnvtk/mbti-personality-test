import mongoose, { Document, Schema } from 'mongoose'

// 订单接口
export interface IOrder extends Document {
  orderId: string
  userId?: string
  openId?: string
  amount: number          // 金额（分）
  productType: string     // vip | test_count | single_test | enterprise
  productDetail?: string  // month/quarter/year/lifetime | mbti/disc/pdp/ai
  paymentMethod: string   // wechat | alipay
  status: string          // pending | paid | completed | refunded | failed
  transactionId?: string  // 微信支付交易号
  prepayId?: string       // 预支付ID
  description?: string    // 商品描述
  // 分销追踪字段
  referrerId?: string            // 一级推荐人ID（直推）
  referrerCode?: string          // 推荐人邀请码
  level2ReferrerId?: string      // 二级推荐人ID（间推）
  commissionAmount?: number      // 一级佣金金额（分）
  level2CommissionAmount?: number // 二级佣金金额（分）
  commissionStatus?: string      // 佣金状态：none/pending/settled/cancelled
  // 用户行为追踪
  source?: string                // 来源：direct/invite/scan/share
  userAgent?: string             // 用户设备信息
  createdAt: Date
  updatedAt: Date
  paidAt?: Date
}

// 订单模式
const OrderSchema = new Schema<IOrder>({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    index: true
  },
  openId: {
    type: String,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  productType: {
    type: String,
    required: true,
    enum: ['vip', 'test_count', 'single_test', 'enterprise']
  },
  productDetail: {
    type: String,
    default: ''
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['wechat', 'alipay'],
    default: 'wechat'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'completed', 'refunded', 'failed'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    default: ''
  },
  prepayId: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  // 分销追踪字段
  referrerId: {
    type: String,
    index: true
  },
  referrerCode: {
    type: String
  },
  level2ReferrerId: {
    type: String,
    index: true
  },
  commissionAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  level2CommissionAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  commissionStatus: {
    type: String,
    enum: ['none', 'pending', 'settled', 'cancelled'],
    default: 'none'
  },
  // 用户行为追踪
  source: {
    type: String,
    enum: ['direct', 'invite', 'scan', 'share'],
    default: 'direct'
  },
  userAgent: {
    type: String,
    default: ''
  },
  paidAt: {
    type: Date
  }
}, {
  timestamps: true
})

// 索引
OrderSchema.index({ userId: 1, createdAt: -1 })
OrderSchema.index({ status: 1 })
OrderSchema.index({ productType: 1 })
OrderSchema.index({ createdAt: -1 })

// 防止重复编译
const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)

export default Order
