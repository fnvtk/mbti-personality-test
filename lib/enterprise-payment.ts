// 企业付费服务客户端工具

/**
 * 企业充值
 * @param enterpriseId 企业ID
 * @param amount 充值金额
 * @returns 充值结果
 */
export async function rechargeEnterprise(enterpriseId: string, amount: number) {
  try {
    const response = await fetch("/api/enterprise/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "recharge",
        enterpriseId,
        amount,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("企业充值错误:", error)
    return {
      success: false,
      message: `充值失败: ${error.message}`,
    }
  }
}

/**
 * 扣除测试费用
 * @param enterpriseId 企业ID
 * @param testType 测试类型 (face/mbti/pdp/disc)
 * @returns 扣费结果
 */
export async function deductTestFee(enterpriseId: string, testType: "face" | "mbti" | "pdp" | "disc") {
  try {
    const response = await fetch("/api/enterprise/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "deduct",
        enterpriseId,
        testType,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("扣费错误:", error)
    return {
      success: false,
      message: `扣费失败: ${error.message}`,
    }
  }
}

/**
 * 获取企业账户信息
 * @param enterpriseId 企业ID
 * @returns 企业账户信息
 */
export async function getEnterpriseAccount(enterpriseId: string) {
  try {
    const response = await fetch(`/api/enterprise/payment?enterpriseId=${enterpriseId}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error("获取企业账户信息错误:", error)
    return {
      success: false,
      message: `获取账户信息失败: ${error.message}`,
    }
  }
}

/**
 * 计算测试成本
 * @param testTypes 测试类型数组
 * @returns 总成本
 */
export function calculateTestCost(testTypes: ("face" | "mbti" | "pdp" | "disc")[]) {
  return testTypes.reduce((total, type) => {
    switch (type) {
      case "face":
        return total + 1
      case "mbti":
      case "pdp":
      case "disc":
        return total + 3
      default:
        return total
    }
  }, 0)
}
