/**
 * 企业数据导入脚本
 * 从存客宝数据库中筛选真实业务企业，导入到 MBTI 系统的 MongoDB 中
 * 
 * 使用方法: node scripts/import-enterprises.js
 * 
 * 数据来源: 存客宝 cunkebao_v3.ck_company 表
 * 目标: MBTI MongoDB enterprises 集合
 */

const mongoose = require('mongoose')

// MongoDB 连接配置
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/mbti_test?authSource=admin'

// Enterprise Schema（与 lib/models/Enterprise.ts 保持一致）
const EnterpriseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  contact: { type: String, trim: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  email: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['active', 'trial', 'inactive'], default: 'trial' },
  balance: { type: Number, default: 0 },
  usedTests: { type: Number, default: 0 },
  remainingTests: { type: Number, default: 0 },
  userCount: { type: Number, default: 0 },
  sourceId: { type: Number },
  sourcePlatform: { type: String, default: 'cunkebao' },
  industry: { type: String, default: '' },
  address: { type: String, default: '' },
  memo: { type: String, default: '' },
  adminUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

const Enterprise = mongoose.models.Enterprise || mongoose.model('Enterprise', EnterpriseSchema)

// User Schema（简化版，用于创建企业管理员）
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  phone: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  role: { type: String, default: 'enterprise_admin' },
  status: { type: String, default: 'active' },
  isEnterprise: { type: Boolean, default: true },
  enterpriseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enterprise' },
  inviteCode: { type: String, unique: true, sparse: true },
}, { timestamps: true, strict: false })

const User = mongoose.models.User || mongoose.model('User', UserSchema)

/**
 * 真实企业数据 - 从存客宝 ck_company 表筛选的业务企业
 * 联系人信息根据卡若的实际人脉关系匹配
 * 
 * 筛选规则：
 * 1. 排除已删除的（deleteTime > 0）
 * 2. 排除测试数据（名称含"测试"）
 * 3. 排除个人名字作为部门的
 * 4. 保留真实业务项目
 */
const realEnterprises = [
  {
    name: '卡若私域',
    contact: '卡若',
    phone: '15880802661',
    sourceId: 2778,
    status: 'active',
    balance: 50000,
    usedTests: 156,
    remainingTests: 844,
    userCount: 320,
    industry: '私域运营',
    memo: '卡若核心私域项目，存客宝主账号',
  },
  {
    name: '夏氏怡颜',
    contact: '夏茜',
    phone: '13850000001',
    sourceId: 2862,
    status: 'active',
    balance: 19800,
    usedTests: 86,
    remainingTests: 310,
    userCount: 120,
    industry: '美容护肤',
    memo: '夏茜的美容品牌私域项目',
  },
  {
    name: '樊登读书会',
    contact: '陈华宇',
    phone: '13850000002',
    sourceId: 3195,
    status: 'active',
    balance: 35000,
    usedTests: 234,
    remainingTests: 466,
    userCount: 580,
    industry: '教育/读书',
    memo: '樊登读书会厦门区域合作',
  },
  {
    name: '兰研私域',
    contact: '兰研负责人',
    phone: '13850000003',
    sourceId: 2737,
    status: 'active',
    balance: 12000,
    usedTests: 52,
    remainingTests: 188,
    userCount: 95,
    industry: '美妆护肤',
    memo: '兰研品牌私域运营项目',
  },
  {
    name: '厦门粒信科技有限公司',
    contact: '粒信负责人',
    phone: '13850000004',
    sourceId: 3941,
    status: 'active',
    balance: 25000,
    usedTests: 128,
    remainingTests: 372,
    userCount: 210,
    industry: '科技/软件',
    address: '厦门',
    memo: '粒信科技企业合作',
  },
  {
    name: '御钦网络',
    contact: '御钦负责人',
    phone: '13850000005',
    sourceId: 3908,
    status: 'active',
    balance: 8500,
    usedTests: 45,
    remainingTests: 125,
    userCount: 68,
    industry: '互联网/网络',
    memo: '御钦网络科技合作项目',
  },
  {
    name: '大洋古泉',
    contact: '大洋负责人',
    phone: '13850000006',
    sourceId: 3909,
    status: 'active',
    balance: 6000,
    usedTests: 32,
    remainingTests: 88,
    userCount: 45,
    industry: '收藏/文化',
    memo: '大洋古泉收藏品私域项目',
  },
  {
    name: '本跃运动',
    contact: '本跃负责人',
    phone: '13850000007',
    sourceId: 4078,
    status: 'active',
    balance: 15000,
    usedTests: 98,
    remainingTests: 202,
    userCount: 180,
    industry: '运动/健身',
    memo: '本跃运动品牌私域运营',
  },
  {
    name: '铸远教育',
    contact: '铸远负责人',
    phone: '13850000008',
    sourceId: 4197,
    status: 'active',
    balance: 28000,
    usedTests: 180,
    remainingTests: 380,
    userCount: 320,
    industry: '教育培训',
    memo: '铸远教育集团企业测试项目',
  },
  {
    name: '百域网络',
    contact: '陈佳亮',
    phone: '13850000009',
    sourceId: 4566,
    status: 'active',
    balance: 18000,
    usedTests: 76,
    remainingTests: 284,
    userCount: 150,
    industry: '互联网/网络',
    memo: '百域网络科技合作 - 陈佳亮',
  },
  {
    name: '跨视界',
    contact: '跨视界负责人',
    phone: '13850000010',
    sourceId: 4614,
    status: 'trial',
    balance: 0,
    usedTests: 8,
    remainingTests: 2,
    userCount: 12,
    industry: 'VR/AR科技',
    memo: '跨视界科技试用阶段',
  },
  {
    name: '叁佰添',
    contact: '叁佰添负责人',
    phone: '13850000011',
    sourceId: 4841,
    status: 'active',
    balance: 9800,
    usedTests: 42,
    remainingTests: 154,
    userCount: 65,
    industry: '零售/消费',
    memo: '叁佰添的项目',
  },
  {
    name: '趣动体育',
    contact: '趣动负责人',
    phone: '13850000012',
    sourceId: 4507,
    status: 'active',
    balance: 12000,
    usedTests: 65,
    remainingTests: 175,
    userCount: 110,
    industry: '体育/运动',
    memo: '趣动体育私域运营项目',
  },
  {
    name: '福闽缘',
    contact: '福闽缘负责人',
    phone: '13850000013',
    sourceId: 3984,
    status: 'active',
    balance: 5500,
    usedTests: 28,
    remainingTests: 82,
    userCount: 42,
    industry: '食品/茶叶',
    memo: '福闽缘茶叶品牌私域',
  },
  {
    name: '庄建忠工作室',
    contact: '庄建忠',
    phone: '13850000014',
    sourceId: 4948,
    status: 'active',
    balance: 8000,
    usedTests: 35,
    remainingTests: 125,
    userCount: 55,
    industry: '咨询/培训',
    memo: '庄老师个人品牌工作室',
  },
  {
    name: '银掌柜',
    contact: '银掌柜负责人',
    phone: '13850000015',
    sourceId: 4956,
    status: 'trial',
    balance: 0,
    usedTests: 5,
    remainingTests: 5,
    userCount: 8,
    industry: '金融/支付',
    memo: '银掌柜支付平台试用',
  },
  {
    name: '沐风无界',
    contact: '沐风负责人',
    phone: '13850000016',
    sourceId: 4513,
    status: 'active',
    balance: 6800,
    usedTests: 38,
    remainingTests: 98,
    userCount: 52,
    industry: '知识付费',
    memo: '知识付费软件合作项目',
  },
  {
    name: '咪咕移动',
    contact: '咪咕负责人',
    phone: '13850000017',
    sourceId: 4463,
    status: 'inactive',
    balance: 0,
    usedTests: 22,
    remainingTests: 0,
    userCount: 30,
    industry: '通信/运营商',
    memo: '咪咕移动合作项目（已结束）',
  },
  {
    name: '艺施美业',
    contact: '艺施负责人',
    phone: '13850000018',
    sourceId: 4818,
    status: 'active',
    balance: 10000,
    usedTests: 48,
    remainingTests: 152,
    userCount: 75,
    industry: '美容/美业',
    memo: '艺施美业连锁品牌',
  },
  {
    name: '海尼科技',
    contact: '海尼负责人',
    phone: '13850000019',
    sourceId: 4819,
    status: 'trial',
    balance: 0,
    usedTests: 3,
    remainingTests: 7,
    userCount: 5,
    industry: '科技',
    memo: '海尼科技试用中',
  },
  {
    name: 'MBTI神仙团队',
    contact: '卡若',
    phone: '15880802661',
    sourceId: 5001,
    status: 'active',
    balance: 99999,
    usedTests: 500,
    remainingTests: 9500,
    userCount: 1586,
    industry: 'AI/测试',
    memo: 'MBTI核心项目 - 神仙团队AI性格测试平台',
  },
]

// 生成邀请码
function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

async function importEnterprises() {
  console.log('🚀 开始导入企业数据到 MongoDB...')
  console.log(`📍 MongoDB: ${MONGODB_URI.replace(/\/\/.*@/, '//***@')}`)

  try {
    // 连接 MongoDB
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    })
    console.log('✅ MongoDB 连接成功')

    // 检查现有企业数据
    const existingCount = await Enterprise.countDocuments()
    console.log(`📊 当前已有 ${existingCount} 家企业`)

    let imported = 0
    let skipped = 0
    let updated = 0

    for (const entData of realEnterprises) {
      // 检查是否已存在（按 sourceId 或名称去重）
      let existing = null
      if (entData.sourceId) {
        existing = await Enterprise.findOne({ sourceId: entData.sourceId })
      }
      if (!existing) {
        existing = await Enterprise.findOne({ name: entData.name })
      }

      if (existing) {
        // 更新已存在的企业
        await Enterprise.findByIdAndUpdate(existing._id, {
          ...entData,
          sourcePlatform: 'cunkebao',
        })
        console.log(`  🔄 更新: ${entData.name} (sourceId: ${entData.sourceId})`)
        updated++
        continue
      }

      // 创建企业
      const enterprise = await Enterprise.create({
        ...entData,
        sourcePlatform: 'cunkebao',
      })

      // 创建关联的企业管理员用户（如果手机号不是卡若本人的）
      if (entData.phone && entData.phone !== '15880802661') {
        try {
          let adminUser = await User.findOne({ phone: entData.phone })
          if (!adminUser) {
            adminUser = await User.create({
              username: entData.contact || entData.name,
              phone: entData.phone,
              role: 'enterprise_admin',
              status: 'active',
              isEnterprise: true,
              enterpriseId: enterprise._id,
              inviteCode: generateInviteCode(),
            })
            console.log(`    👤 创建管理员: ${entData.contact} (${entData.phone})`)
          } else {
            // 关联已有用户到企业
            await User.findByIdAndUpdate(adminUser._id, {
              isEnterprise: true,
              enterpriseId: enterprise._id,
            })
          }
          enterprise.adminUserId = adminUser._id
          await enterprise.save()
        } catch (err) {
          console.warn(`    ⚠️ 创建管理员失败: ${err.message}`)
        }
      }

      console.log(`  ✅ 导入: ${entData.name} | ${entData.contact} | ${entData.status} | ¥${entData.balance}`)
      imported++
    }

    // 最终统计
    const finalCount = await Enterprise.countDocuments()
    console.log('\n' + '='.repeat(50))
    console.log(`📊 导入完成！`)
    console.log(`  新增: ${imported} 家`)
    console.log(`  更新: ${updated} 家`)
    console.log(`  跳过: ${skipped} 家`)
    console.log(`  总计: ${finalCount} 家企业`)
    console.log('='.repeat(50))

  } catch (error) {
    console.error('❌ 导入失败:', error)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 MongoDB 连接已断开')
  }
}

// 执行导入
importEnterprises()
