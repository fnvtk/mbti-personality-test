import mongoose, { Document, Schema } from 'mongoose'

// 维度得分接口
export interface IDimensionScore {
  E: number
  I: number
  S: number
  N: number
  T: number
  F: number
  J: number
  P: number
}

// 测试答案接口
export interface ITestAnswer {
  questionId: number
  selectedOption: string
  dimension: string
}

// 测试结果接口
export interface ITestResult extends Document {
  userId?: mongoose.Types.ObjectId
  sessionId?: string
  answers: ITestAnswer[]
  dimensionScores: IDimensionScore
  mbtiType: string
  confidence: number
  testDuration: number
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
}

// 维度得分模式
const DimensionScoreSchema = new Schema({
  E: { type: Number, required: true, min: 0, max: 100 },
  I: { type: Number, required: true, min: 0, max: 100 },
  S: { type: Number, required: true, min: 0, max: 100 },
  N: { type: Number, required: true, min: 0, max: 100 },
  T: { type: Number, required: true, min: 0, max: 100 },
  F: { type: Number, required: true, min: 0, max: 100 },
  J: { type: Number, required: true, min: 0, max: 100 },
  P: { type: Number, required: true, min: 0, max: 100 }
}, { _id: false })

// 测试答案模式
const TestAnswerSchema = new Schema({
  questionId: {
    type: Number,
    required: true,
    min: 1,
    max: 90
  },
  selectedOption: {
    type: String,
    required: true,
    enum: ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']
  },
  dimension: {
    type: String,
    required: true,
    enum: ['EI', 'SN', 'TF', 'JP']
  }
}, { _id: false })

// 测试结果模式
const TestResultSchema = new Schema<ITestResult>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  sessionId: {
    type: String,
    index: true
  },
  answers: {
    type: [TestAnswerSchema],
    required: true,
    validate: {
      validator: function(answers: ITestAnswer[]) {
        return answers.length === 90
      },
      message: '必须回答所有90个问题'
    }
  },
  dimensionScores: {
    type: DimensionScoreSchema,
    required: true
  },
  mbtiType: {
    type: String,
    required: true,
    enum: [
      'INTJ', 'INTP', 'ENTJ', 'ENTP',
      'INFJ', 'INFP', 'ENFJ', 'ENFP',
      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
      'ISTP', 'ISFP', 'ESTP', 'ESFP'
    ]
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  testDuration: {
    type: Number,
    required: true,
    min: 0
  },
  ipAddress: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

// 索引优化
TestResultSchema.index({ userId: 1, createdAt: -1 })
TestResultSchema.index({ sessionId: 1 })
TestResultSchema.index({ mbtiType: 1 })
TestResultSchema.index({ createdAt: -1 })

// 虚拟字段：主导维度
TestResultSchema.virtual('dominantDimensions').get(function() {
  const scores = this.dimensionScores
  return {
    energySource: scores.E > scores.I ? 'E' : 'I',
    informationGathering: scores.S > scores.N ? 'S' : 'N',
    decisionMaking: scores.T > scores.F ? 'T' : 'F',
    lifestyle: scores.J > scores.P ? 'J' : 'P'
  }
})

// 虚拟字段：维度强度
TestResultSchema.virtual('dimensionStrengths').get(function() {
  const scores = this.dimensionScores
  return {
    EI: Math.abs(scores.E - scores.I),
    SN: Math.abs(scores.S - scores.N),
    TF: Math.abs(scores.T - scores.F),
    JP: Math.abs(scores.J - scores.P)
  }
})

// 静态方法：获取MBTI类型统计
TestResultSchema.statics.getMBTIStats = function(timeRange?: { start: Date; end: Date }) {
  const matchCondition: any = {}
  
  if (timeRange) {
    matchCondition.createdAt = {
      $gte: timeRange.start,
      $lte: timeRange.end
    }
  }
  
  return this.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: '$mbtiType',
        count: { $sum: 1 },
        avgConfidence: { $avg: '$confidence' },
        avgDuration: { $avg: '$testDuration' }
      }
    },
    { $sort: { count: -1 } }
  ])
}

// 防止重复编译模型
const TestResult = mongoose.models.TestResult || mongoose.model<ITestResult>('TestResult', TestResultSchema)

export default TestResult
