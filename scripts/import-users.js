// 从KR_人才库导入125个高质量用户到MBTI系统
// 运行方式: docker exec datacenter_mongodb mongosh < /scripts/import-users.js

// 连接MBTI数据库
const mbtiDB = db.getSiblingDB('mbti_test')
const sourceDB = db.getSiblingDB('KR_人才库')

// MBTI 16种类型
const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']
const mbtiNames = { INTJ: '建筑师', INTP: '逻辑学家', ENTJ: '指挥官', ENTP: '辩论家', INFJ: '提倡者', INFP: '调停者', ENFJ: '主人公', ENFP: '竞选者', ISTJ: '物流师', ISFJ: '守卫者', ESTJ: '总经理', ESFJ: '执政官', ISTP: '鉴赏家', ISFP: '探险家', ESTP: '企业家', ESFP: '表演者' }

// PDP类型
const pdpTypes = ['老虎', '孔雀', '无尾熊', '猫头鹰', '变色龙']
// DISC类型
const discTypes = ['D', 'I', 'S', 'C']
const discNames = { D: '力量型', I: '活跃型', S: '和平型', C: '完美型' }

// 随机选取
function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

// 生成维度得分
function genDimensionScores(mbtiType) {
  const dims = mbtiType.split('')
  return {
    E: dims[0] === 'E' ? randomInt(55, 85) : randomInt(15, 45),
    I: dims[0] === 'I' ? randomInt(55, 85) : randomInt(15, 45),
    S: dims[1] === 'S' ? randomInt(55, 85) : randomInt(15, 45),
    N: dims[1] === 'N' ? randomInt(55, 85) : randomInt(15, 45),
    T: dims[2] === 'T' ? randomInt(55, 85) : randomInt(15, 45),
    F: dims[2] === 'F' ? randomInt(55, 85) : randomInt(15, 45),
    J: dims[3] === 'J' ? randomInt(55, 85) : randomInt(15, 45),
    P: dims[3] === 'P' ? randomInt(55, 85) : randomInt(15, 45)
  }
}

print('📋 开始从KR_人才库导入用户到MBTI系统...')

// 从51JOB获取125条有邮箱和手机的高质量数据
const users = sourceDB['51JOB'].find(
  { email: { $ne: null, $ne: '' }, mob: { $ne: null, $ne: '' } },
  { cname: 1, gender: 1, birth: 1, region: 1, email: 1, mob: 1, industry: 1, remark: 1, salary: 1 }
).limit(125).toArray()

print(`找到 ${users.length} 条用户数据`)

// 清除旧数据
mbtiDB.users.deleteMany({ role: 'user' })
mbtiDB.testresults.deleteMany({})
print('已清除旧数据')

let imported = 0

users.forEach((u, idx) => {
  const mbtiType = randomFrom(mbtiTypes)
  const pdpPrimary = randomFrom(pdpTypes)
  const pdpSecondary = randomFrom(pdpTypes.filter(t => t !== pdpPrimary))
  const discPrimary = randomFrom(discTypes)
  const discSecondary = randomFrom(discTypes.filter(t => t !== discPrimary))
  const dimScores = genDimensionScores(mbtiType)
  const confidence = randomInt(65, 95)
  
  // 清理手机号
  let phone = (u.mob || '').replace(/[^\d]/g, '')
  if (phone.length > 11) phone = phone.slice(-11)
  
  const userId = ObjectId()
  const now = new Date()
  const testDate = new Date(now.getTime() - randomInt(1, 30) * 86400000)
  
  // 创建用户
  mbtiDB.users.insertOne({
    _id: userId,
    username: u.cname || `用户${idx + 1}`,
    email: u.email || '',
    phone: phone,
    avatar: '',
    mbtiType: mbtiType,
    discType: `${discPrimary}+${discSecondary}`,
    pdpType: `${pdpPrimary}+${pdpSecondary}`,
    role: 'user',
    status: 'active',
    isEnterprise: false,
    testHistory: [],
    region: u.region || '',
    industry: u.industry || '',
    gender: u.gender || '',
    salary: u.salary || '',
    bio: (u.remark || '').substring(0, 200),
    gallupTop3: [
      randomFrom(['战略', '统率', '成就', '行动', '分析', '信仰', '沟通', '竞争', '关联', '回顾']),
      randomFrom(['纪律', '体谅', '专注', '前瞻', '和谐', '理念', '包容', '个别', '学习', '完美']),
      randomFrom(['积极', '交往', '责任', '排难', '自信', '追求', '思维', '统筹', '取悦', '审慎'])
    ],
    createdAt: testDate,
    updatedAt: now,
    lastLoginAt: now
  })
  
  // 创建测试结果
  const resultId = ObjectId()
  mbtiDB.testresults.insertOne({
    _id: resultId,
    userId: userId,
    sessionId: `session_${idx}_${Date.now()}`,
    mbtiType: mbtiType,
    dimensionScores: dimScores,
    confidence: confidence,
    testDuration: randomInt(180, 900),
    answers: [],
    createdAt: testDate,
    updatedAt: testDate
  })
  
  // 更新用户测试历史
  mbtiDB.users.updateOne({ _id: userId }, { $push: { testHistory: resultId } })
  
  imported++
})

// 确保管理员存在
const adminExists = mbtiDB.users.findOne({ username: 'admin', role: 'superadmin' })
if (!adminExists) {
  // bcrypt hash for 'k123456'
  mbtiDB.users.insertOne({
    username: 'admin',
    email: 'admin@mbti.com',
    password: '$2a$10$WZ8XJxm2Y1Jv5KqN7AoZVe.I1bR3YwR6RqA5q7V8N2X0lK3J1H9Oi',
    role: 'superadmin',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  })
  print('✅ 已创建管理员 admin / k123456')
}

print(`✅ 导入完成！共导入 ${imported} 个用户`)
print(`用户总数: ${mbtiDB.users.countDocuments()}`)
print(`测试结果总数: ${mbtiDB.testresults.countDocuments()}`)
