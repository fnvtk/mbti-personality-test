import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Enterprise from '@/lib/models/Enterprise'
import User from '@/lib/models/User'

// 获取企业列表
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    // 构建查询条件
    const query: any = {}
    if (status && status !== 'all') {
      query.status = status
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ]
    }

    const total = await Enterprise.countDocuments(query)
    const enterprises = await Enterprise.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    // 统计数据
    const stats = {
      total: await Enterprise.countDocuments(),
      active: await Enterprise.countDocuments({ status: 'active' }),
      trial: await Enterprise.countDocuments({ status: 'trial' }),
      inactive: await Enterprise.countDocuments({ status: 'inactive' }),
      totalBalance: (await Enterprise.aggregate([
        { $group: { _id: null, total: { $sum: '$balance' } } }
      ]))[0]?.total || 0,
      totalTests: (await Enterprise.aggregate([
        { $group: { _id: null, total: { $sum: '$usedTests' } } }
      ]))[0]?.total || 0,
    }

    return NextResponse.json({
      code: 200,
      data: {
        enterprises,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        stats,
      }
    })
  } catch (error: any) {
    console.error('获取企业列表失败:', error)
    return NextResponse.json({
      code: 500,
      message: '获取企业列表失败: ' + error.message
    }, { status: 500 })
  }
}

// 新建企业
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { name, contact, phone, email, memo, balance, remainingTests } = body

    if (!name || !name.trim()) {
      return NextResponse.json({
        code: 400,
        message: '企业名称不能为空'
      }, { status: 400 })
    }

    // 创建企业
    const enterprise = await Enterprise.create({
      name: name.trim(),
      contact: contact?.trim() || '',
      phone: phone?.trim() || '',
      email: email?.trim() || '',
      memo: memo?.trim() || '',
      status: balance > 0 ? 'active' : 'trial',
      balance: balance || 0,
      remainingTests: remainingTests || 10, // 默认试用10次
      usedTests: 0,
      userCount: 0,
      sourcePlatform: 'manual',
    })

    // 如果有联系电话，尝试关联或创建企业管理员用户
    if (phone) {
      let adminUser = await User.findOne({ phone: phone.trim() })
      if (!adminUser) {
        adminUser = await User.create({
          username: contact || name,
          phone: phone.trim(),
          email: email || undefined,
          role: 'enterprise_admin',
          status: 'active',
          isEnterprise: true,
          enterpriseId: enterprise._id,
        })
      } else {
        // 更新已有用户为企业管理员
        await User.findByIdAndUpdate(adminUser._id, {
          isEnterprise: true,
          enterpriseId: enterprise._id,
          role: adminUser.role === 'superadmin' ? 'superadmin' : 'enterprise_admin',
        })
      }
      // 关联企业管理员
      enterprise.adminUserId = adminUser._id
      enterprise.userCount = 1
      await enterprise.save()
    }

    return NextResponse.json({
      code: 200,
      data: enterprise,
      message: '企业创建成功'
    })
  } catch (error: any) {
    console.error('创建企业失败:', error)
    return NextResponse.json({
      code: 500,
      message: '创建企业失败: ' + error.message
    }, { status: 500 })
  }
}

// 删除企业
export async function DELETE(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ code: 400, message: '缺少企业ID' }, { status: 400 })
    }

    const enterprise = await Enterprise.findByIdAndDelete(id)
    if (!enterprise) {
      return NextResponse.json({ code: 404, message: '企业不存在' }, { status: 404 })
    }

    // 解除关联用户的企业绑定
    await User.updateMany(
      { enterpriseId: enterprise._id },
      { $unset: { enterpriseId: 1 }, isEnterprise: false }
    )

    return NextResponse.json({
      code: 200,
      message: '企业删除成功'
    })
  } catch (error: any) {
    return NextResponse.json({
      code: 500,
      message: '删除企业失败: ' + error.message
    }, { status: 500 })
  }
}

// 更新企业（充值等）
export async function PUT(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { id, action, ...updateData } = body

    if (!id) {
      return NextResponse.json({ code: 400, message: '缺少企业ID' }, { status: 400 })
    }

    const enterprise = await Enterprise.findById(id)
    if (!enterprise) {
      return NextResponse.json({ code: 404, message: '企业不存在' }, { status: 404 })
    }

    // 充值操作
    if (action === 'recharge') {
      const { amount } = updateData
      if (!amount || amount < 500) {
        return NextResponse.json({ code: 400, message: '充值金额不能少于500元' }, { status: 400 })
      }

      enterprise.balance += amount
      enterprise.remainingTests += Math.floor(amount / 50) // 50元/次
      enterprise.status = 'active'
      await enterprise.save()

      return NextResponse.json({
        code: 200,
        data: enterprise,
        message: `充值 ¥${amount} 成功，新增 ${Math.floor(amount / 50)} 次测试额度`
      })
    }

    // 普通更新
    Object.assign(enterprise, updateData)
    await enterprise.save()

    return NextResponse.json({
      code: 200,
      data: enterprise,
      message: '更新成功'
    })
  } catch (error: any) {
    return NextResponse.json({
      code: 500,
      message: '更新企业失败: ' + error.message
    }, { status: 500 })
  }
}
