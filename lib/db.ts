import mongoose from 'mongoose'

// MongoDB连接URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mbti_test'

// 全局缓存mongoose连接
declare global {
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  } | undefined
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

/**
 * 连接MongoDB数据库
 * 使用连接池缓存，避免重复连接
 */
export async function connectDB() {
  if (cached!.conn) {
    return cached!.conn
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
    }

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB 连接成功')
      return mongoose
    })
  }

  try {
    cached!.conn = await cached!.promise
  } catch (e) {
    cached!.promise = null
    console.error('❌ MongoDB 连接失败:', e)
    throw e
  }

  return cached!.conn
}

/**
 * 断开MongoDB连接
 */
export async function disconnectDB() {
  if (cached!.conn) {
    await mongoose.disconnect()
    cached!.conn = null
    cached!.promise = null
    console.log('🔌 MongoDB 已断开连接')
  }
}

/**
 * 检查MongoDB连接状态
 */
export function isConnected() {
  return mongoose.connection.readyState === 1
}

export default mongoose
