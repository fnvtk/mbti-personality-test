import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 模拟企业数据存储
const enterpriseData = {
  balance: 0,
  usedTests: 0,
  remainingTests: 0,
  transactions: [],
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { action, amount, enterpriseId, testType } = data

    // 充值操作
    if (action === "recharge") {
      if (!amount || amount < 500) {
        return NextResponse.json({ success: false, message: "充值金额必须大于等于500元" }, { status: 400 })
      }

      // 计算测试次数
      const testCount = Math.floor(amount / 50) // 每500元10次，即每次50元

      // 更新企业账户
      enterpriseData.balance += amount
      enterpriseData.remainingTests += testCount

      // 记录交易
      const transaction = {
        id: `trx-${Date.now()}`,
        type: "recharge",
        amount,
        testCount,
        timestamp: new Date().toISOString(),
      }

      enterpriseData.transactions.push(transaction)

      return NextResponse.json({
        success: true,
        message: `充值成功，增加${testCount}次测试额度`,
        data: {
          balance: enterpriseData.balance,
          remainingTests: enterpriseData.remainingTests,
          transaction,
        },
      })
    }

    // 扣费操作
    if (action === "deduct") {
      if (!testType) {
        return NextResponse.json({ success: false, message: "缺少测试类型" }, { status: 400 })
      }

      // 计算扣费金额
      let deductAmount = 0
      switch (testType) {
        case "face":
          deductAmount = 1 // 人脸测试1元
          break
        case "mbti":
        case "pdp":
        case "disc":
          deductAmount = 3 // MBTI/PDP/DISC测试各3元
          break
        default:
          return NextResponse.json({ success: false, message: "无效的测试类型" }, { status: 400 })
      }

      // 检查余额
      if (enterpriseData.remainingTests <= 0) {
        return NextResponse.json({ success: false, message: "测试次数不足，请充值" }, { status: 400 })
      }

      // 更新企业账户
      enterpriseData.balance -= deductAmount * 0.3 // 按3折成本价扣除
      enterpriseData.usedTests += 1
      enterpriseData.remainingTests -= 1

      // 记录交易
      const transaction = {
        id: `trx-${Date.now()}`,
        type: "deduct",
        testType,
        amount: deductAmount,
        costAmount: deductAmount * 0.3,
        timestamp: new Date().toISOString(),
      }

      enterpriseData.transactions.push(transaction)

      return NextResponse.json({
        success: true,
        message: `测试费用扣除成功`,
        data: {
          balance: enterpriseData.balance,
          remainingTests: enterpriseData.remainingTests,
          usedTests: enterpriseData.usedTests,
          transaction,
        },
      })
    }

    return NextResponse.json({ success: false, message: "无效的操作类型" }, { status: 400 })
  } catch (error) {
    console.error("企业付费处理错误:", error)
    return NextResponse.json({ success: false, message: `处理请求时出错: ${error.message}` }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // 获取企业账户信息
  const searchParams = request.nextUrl.searchParams
  const enterpriseId = searchParams.get("enterpriseId")

  // 在实际应用中，这里应该根据enterpriseId查询数据库

  return NextResponse.json({
    success: true,
    data: enterpriseData,
  })
}
