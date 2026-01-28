import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 模拟支付处理
export async function POST(request: NextRequest) {
  try {
    const { amount, paymentMethod, userId, enterpriseId, orderId, productType } = await request.json()

    // 验证必要参数
    if (!amount || !paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          message: "缺少必要参数",
        },
        { status: 400 },
      )
    }

    // 模拟支付处理延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 生成支付结果
    const paymentResult = {
      success: true,
      transactionId: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      amount,
      paymentMethod,
      userId,
      enterpriseId,
      orderId,
      productType,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: "支付成功",
      data: paymentResult,
    })
  } catch (error) {
    console.error("支付处理错误:", error)
    return NextResponse.json(
      {
        success: false,
        message: "支付处理失败",
      },
      { status: 500 },
    )
  }
}

// 获取支付状态
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const transactionId = searchParams.get("transactionId")

    if (!transactionId) {
      return NextResponse.json(
        {
          success: false,
          message: "缺少交易ID",
        },
        { status: 400 },
      )
    }

    // 模拟查询支付状态
    const paymentStatus = {
      transactionId,
      status: "completed", // 可能的状态: pending, completed, failed
      amount: 198,
      paymentMethod: "wechat",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: paymentStatus,
    })
  } catch (error) {
    console.error("查询支付状态错误:", error)
    return NextResponse.json(
      {
        success: false,
        message: "查询支付状态失败",
      },
      { status: 500 },
    )
  }
}
