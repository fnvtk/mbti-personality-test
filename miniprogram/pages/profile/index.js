// pages/profile/index.js
const app = getApp()
const payment = require('../../utils/payment')

Page({
  data: {
    userInfo: null,
    isVIP: false,
    vipTypeText: '',
    vipExpireText: '',
    testCount: 0,
    mbtiType: '',
    hasResults: false,
    mbtiResult: null,
    discResult: null,
    pdpResult: null,
    aiResult: null
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    // 用户信息
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
    
    // VIP信息
    const benefits = payment.getUserBenefits()
    let vipTypeText = ''
    let vipExpireText = ''
    
    if (benefits.isVIP && benefits.vipInfo) {
      const typeNames = {
        month: '月度VIP',
        quarter: '季度VIP',
        year: '年度VIP',
        lifetime: '终身VIP'
      }
      vipTypeText = typeNames[benefits.vipInfo.vipType] || 'VIP会员'
      
      if (benefits.vipInfo.vipType === 'lifetime') {
        vipExpireText = '永久有效'
      } else {
        const expireDate = new Date(benefits.vipInfo.expireDate)
        vipExpireText = `${expireDate.getFullYear()}-${String(expireDate.getMonth() + 1).padStart(2, '0')}-${String(expireDate.getDate()).padStart(2, '0')} 到期`
      }
    }
    
    // 测试结果
    const mbtiResult = wx.getStorageSync('mbtiResult')
    const discResult = wx.getStorageSync('discResult')
    const pdpResult = wx.getStorageSync('pdpResult')
    const aiResult = wx.getStorageSync('aiResult')
    
    this.setData({
      userInfo,
      isVIP: benefits.isVIP,
      vipTypeText,
      vipExpireText,
      testCount: benefits.testCount,
      mbtiType: mbtiResult ? mbtiResult.mbtiType : '',
      hasResults: !!(mbtiResult || discResult || pdpResult || aiResult),
      mbtiResult,
      discResult,
      pdpResult,
      aiResult
    })
  },

  // 获取用户信息
  getUserInfo() {
    if (this.data.userInfo) return
    
    wx.getUserProfile({
      desc: '用于展示头像和昵称',
      success: (res) => {
        app.globalData.userInfo = res.userInfo
        wx.setStorageSync('userInfo', res.userInfo)
        this.setData({ userInfo: res.userInfo })
      }
    })
  },

  // 跳转到首页
  goToIndex() {
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },

  // 跳转到历史记录
  goToHistory() {
    wx.navigateTo({
      url: '/pages/history/index'
    })
  },

  // 跳转到购买页面
  goToPurchase() {
    wx.navigateTo({
      url: '/pages/purchase/index'
    })
  },

  // 跳转到设置
  goToSettings() {
    wx.showToast({
      title: '设置功能开发中',
      icon: 'none'
    })
  },

  // 分享
  shareApp() {
    // 触发分享
  },

  // 意见反馈
  goToFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '请联系客服微信：28533368',
      showCancel: false,
      confirmText: '复制微信',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: '28533368',
            success: () => {
              wx.showToast({
                title: '已复制微信号',
                icon: 'success'
              })
            }
          })
        }
      }
    })
  },

  // 关于我们
  goToAbout() {
    wx.showModal({
      title: '神仙团队AI性格测试',
      content: '专业的MBTI、DISC、PDP性格测试平台，助您深度认识自己。\n\n联系我们：28533368',
      showCancel: false
    })
  },

  // 清除缓存
  clearData() {
    wx.showModal({
      title: '清除缓存',
      content: '将清除所有测试记录，是否继续？',
      confirmColor: '#F43F5E',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync()
          app.globalData.mbtiResult = null
          app.globalData.discResult = null
          app.globalData.pdpResult = null
          app.globalData.aiResult = null
          this.loadData()
          wx.showToast({
            title: '已清除',
            icon: 'success'
          })
        }
      }
    })
  },

  // 查看MBTI结果
  viewMBTI() {
    wx.navigateTo({
      url: '/pages/result/mbti'
    })
  },

  // 查看DISC结果
  viewDISC() {
    wx.navigateTo({
      url: '/pages/result/disc'
    })
  },

  // 查看PDP结果
  viewPDP() {
    wx.navigateTo({
      url: '/pages/result/pdp'
    })
  },

  // 查看AI结果
  viewAI() {
    wx.navigateTo({
      url: '/pages/ai-test/result'
    })
  },

  onShareAppMessage() {
    return {
      title: '神仙团队AI性格测试 - 专业MBTI/DISC/PDP测试',
      path: '/pages/index/index'
    }
  }
})
