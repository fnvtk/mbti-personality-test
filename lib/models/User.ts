import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

// 用户接口
export interface IUser extends Document {
  username: string
  email?: string
  phone?: string
  password?: string
  avatar?: string
  mbtiType?: string
  discType?: string
  pdpType?: string
  isEnterprise: boolean
  enterpriseId?: mongoose.Types.ObjectId
  testHistory: mongoose.Types.ObjectId[]
  role: 'user' | 'admin' | 'enterprise_admin' | 'superadmin'
  status: 'active' | 'inactive' | 'banned'
  lastLoginAt?: Date
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
  }
}, {
  timestamps: true
})

// 索引
UserSchema.index({ email: 1 })
UserSchema.index({ phone: 1 })
UserSchema.index({ mbtiType: 1 })
UserSchema.index({ enterpriseId: 1 })
UserSchema.index({ createdAt: -1 })

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
