// miniprogram/utils/payment.js
// 微信支付工具类 - 复刻自Soul项目

const app = getApp()

/**
 * 发起微信支付
 * @param {Object} options - 支付选项
 * @param {String} options.orderId - 订单ID
 * @param {Number} options.amount - 支付金额(分)
 * @param {String} options.description - 商品描述
 * @param {String} options.productType - 商品类型: 'vip' | 'test_count' | 'single_test'
 * @param {Function} options.success - 成功回调
 * @param {Function} options.fail - 失败回调
 */
function wxPay(options) {
  const { orderId, amount, description, productType, success, fail } = options
  
  wx.showLoading({
    title: '正在支付...',
    mask: true
  })

  // 1. 调用后端创建支付订单
  wx.request({
    url: `${app.globalData.apiBase}/api/payment/create`,
    method: 'POST',
    header: {
      'Authorization': `Bearer ${wx.getStorageSync('token')}`,
      'Content-Type': 'application/json'
    },
    data: {
      orderId,
      amount,
      description,
      productType,
      paymentMethod: 'wechat',
      openId: app.globalData.openId || ''
    },
    success: (res) => {
      wx.hideLoading()
      
      if (res.statusCode === 200 && res.data.code === 200) {
        const paymentData = res.data.data
        
        // 2. 调起微信支付
        wx.requestPayment({
          timeStamp: paymentData.timeStamp,
          nonceStr: paymentData.nonceStr,
          package: paymentData.package,
          signType: paymentData.signType || 'MD5',
          paySign: paymentData.paySign,
          success: (payRes) => {
            console.log('支付成功', payRes)
            
            // 3. 通知后端支付成功
            notifyPaymentSuccess(orderId, paymentData.prepayId)
            
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
            
            success && success(payRes)
          },
          fail: (payErr) => {
            console.error('支付失败', payErr)
            
            if (payErr.errMsg.indexOf('cancel') !== -1) {
              wx.showToast({
                title: '支付已取消',
                icon: 'none'
              })
            } else {
              wx.showToast({
                title: '支付失败',
                icon: 'none'
              })
            }
            
            fail && fail(payErr)
          }
        })
      } else {
        wx.showToast({
          title: res.data.message || '创建订单失败',
          icon: 'none'
        })
        fail && fail(res)
      }
    },
    fail: (err) => {
      wx.hideLoading()
      console.error('请求失败', err)
      
      wx.showToast({
        title: '网络请求失败',
        icon: 'none'
      })
      
      fail && fail(err)
    }
  })
}

/**
 * 通知后端支付成功
 */
function notifyPaymentSuccess(orderId, prepayId) {
  wx.request({
    url: `${app.globalData.apiBase}/api/payment/notify`,
    method: 'POST',
    header: {
      'Authorization': `Bearer ${wx.getStorageSync('token')}`,
      'Content-Type': 'application/json'
    },
    data: {
      orderId,
      prepayId,
      status: 'success'
    },
    success: (res) => {
      console.log('支付通知成功', res)
    },
    fail: (err) => {
      console.error('支付通知失败', err)
    }
  })
}

/**
 * 查询订单状态
 */
function queryOrderStatus(orderId, callback) {
  wx.request({
    url: `${app.globalData.apiBase}/api/payment/query`,
    method: 'GET',
    header: {
      'Authorization': `Bearer ${wx.getStorageSync('token')}`
    },
    data: { orderId },
    success: (res) => {
      if (res.statusCode === 200 && res.data.code === 200) {
        callback && callback(true, res.data.data)
      } else {
        callback && callback(false, null)
      }
    },
    fail: () => {
      callback && callback(false, null)
    }
  })
}

/**
 * 购买VIP会员
 * @param {String} vipType - 'month' | 'quarter' | 'year' | 'lifetime'
 */
function purchaseVIP(vipType, success, fail) {
  const prices = {
    month: 1990,      // 19.9元
    quarter: 4990,    // 49.9元
    year: 9900,       // 99元
    lifetime: 19900   // 199元
  }
  
  const names = {
    month: '月度VIP会员',
    quarter: '季度VIP会员',
    year: '年度VIP会员',
    lifetime: '终身VIP会员'
  }
  
  const orderId = `VIP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  wxPay({
    orderId,
    amount: prices[vipType],
    description: `MBTI性格测试 - ${names[vipType]}`,
    productType: 'vip',
    success: (res) => {
      // 更新VIP状态
      updateVIPStatus(vipType)
      success && success(res)
    },
    fail
  })
}

/**
 * 购买测试次数
 * @param {Number} count - 购买次数
 */
function purchaseTestCount(count, success, fail) {
  // 单次价格 3.9元，10次29元，50次99元
  let price = count * 390
  if (count >= 10) price = Math.floor(count * 290)
  if (count >= 50) price = Math.floor(count * 198)
  
  const orderId = `TEST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  wxPay({
    orderId,
    amount: price,
    description: `MBTI性格测试 - ${count}次测试次数`,
    productType: 'test_count',
    success: (res) => {
      // 更新测试次数
      addTestCount(count)
      success && success(res)
    },
    fail
  })
}

/**
 * 购买单次测试
 * @param {String} testType - 'mbti' | 'disc' | 'pdp' | 'ai'
 */
function purchaseSingleTest(testType, success, fail) {
  const prices = {
    mbti: 990,    // 9.9元
    disc: 690,    // 6.9元
    pdp: 690,     // 6.9元
    ai: 1990      // 19.9元
  }
  
  const names = {
    mbti: 'MBTI性格测试',
    disc: 'DISC行为风格测试',
    pdp: 'PDP动物性格测试',
    ai: 'AI人脸性格分析'
  }
  
  const orderId = `SINGLE_${testType.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  wxPay({
    orderId,
    amount: prices[testType],
    description: names[testType],
    productType: 'single_test',
    success: (res) => {
      // 解锁该测试
      unlockTest(testType)
      success && success(res)
    },
    fail
  })
}

/**
 * 更新VIP状态
 */
function updateVIPStatus(vipType) {
  const durations = {
    month: 30,
    quarter: 90,
    year: 365,
    lifetime: 36500 // 100年
  }
  
  const expireDate = new Date()
  expireDate.setDate(expireDate.getDate() + durations[vipType])
  
  const vipInfo = {
    isVIP: true,
    vipType,
    expireDate: expireDate.toISOString(),
    purchaseDate: new Date().toISOString()
  }
  
  wx.setStorageSync('vipInfo', vipInfo)
  app.globalData.vipInfo = vipInfo
}

/**
 * 增加测试次数
 */
function addTestCount(count) {
  const currentCount = wx.getStorageSync('testCount') || 0
  const newCount = currentCount + count
  wx.setStorageSync('testCount', newCount)
  app.globalData.testCount = newCount
}

/**
 * 解锁单次测试
 */
function unlockTest(testType) {
  const unlockedTests = wx.getStorageSync('unlockedTests') || []
  if (!unlockedTests.includes(testType)) {
    unlockedTests.push(testType)
    wx.setStorageSync('unlockedTests', unlockedTests)
  }
  app.globalData.unlockedTests = unlockedTests
}

/**
 * 检查是否是VIP
 */
function checkVIP() {
  const vipInfo = wx.getStorageSync('vipInfo')
  if (!vipInfo || !vipInfo.isVIP) return false
  
  const expireDate = new Date(vipInfo.expireDate)
  return expireDate > new Date()
}

/**
 * 检查测试是否可用（VIP或已解锁或有测试次数）
 */
function canTakeTest(testType) {
  // VIP用户可无限测试
  if (checkVIP()) return true
  
  // 检查是否已解锁该测试
  const unlockedTests = wx.getStorageSync('unlockedTests') || []
  if (unlockedTests.includes(testType)) return true
  
  // 检查是否有测试次数
  const testCount = wx.getStorageSync('testCount') || 0
  return testCount > 0
}

/**
 * 消耗一次测试次数
 */
function consumeTestCount() {
  const testCount = wx.getStorageSync('testCount') || 0
  if (testCount > 0) {
    wx.setStorageSync('testCount', testCount - 1)
    app.globalData.testCount = testCount - 1
    return true
  }
  return false
}

/**
 * 获取用户权益信息
 */
function getUserBenefits() {
  return {
    isVIP: checkVIP(),
    vipInfo: wx.getStorageSync('vipInfo') || null,
    testCount: wx.getStorageSync('testCount') || 0,
    unlockedTests: wx.getStorageSync('unlockedTests') || []
  }
}

module.exports = {
  wxPay,
  queryOrderStatus,
  purchaseVIP,
  purchaseTestCount,
  purchaseSingleTest,
  checkVIP,
  canTakeTest,
  consumeTestCount,
  getUserBenefits,
  updateVIPStatus,
  addTestCount,
  unlockTest
}
