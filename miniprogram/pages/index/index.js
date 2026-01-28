// pages/index/index.js - 首页逻辑
const app = getApp()

Page({
  data: {
    isEnterprise: false,
    hasResults: false,
    mbtiResult: null,
    discResult: null,
    pdpResult: null
  },

  onLoad() {
    this.loadResults()
  },

  onShow() {
    this.loadResults()
  },

  // 加载历史测试结果
  loadResults() {
    const mbtiResult = wx.getStorageSync('mbtiResult')
    const discResult = wx.getStorageSync('discResult')
    const pdpResult = wx.getStorageSync('pdpResult')

    this.setData({
      mbtiResult: mbtiResult || null,
      discResult: discResult || null,
      pdpResult: pdpResult || null,
      hasResults: !!(mbtiResult || discResult || pdpResult)
    })
  },

  // 切换企业模式
  toggleEnterprise() {
    this.setData({
      isEnterprise: !this.data.isEnterprise
    })
    wx.showToast({
      title: this.data.isEnterprise ? '企业版' : '个人版',
      icon: 'none'
    })
  },

  // 跳转到AI人脸测试
  goToAITest() {
    wx.navigateTo({
      url: '/pages/ai-test/index'
    })
  },

  // 跳转到AI人脸拍照
  goToAIFace() {
    wx.navigateTo({
      url: '/pages/ai-test/camera'
    })
  },

  // 跳转到MBTI测试
  goToMBTI() {
    wx.navigateTo({
      url: '/pages/test/mbti'
    })
  },

  // 跳转到DISC测试
  goToDISC() {
    wx.navigateTo({
      url: '/pages/test/disc'
    })
  },

  // 跳转到PDP测试
  goToPDP() {
    wx.navigateTo({
      url: '/pages/test/pdp'
    })
  },

  // 查看MBTI结果
  viewMBTIResult() {
    wx.navigateTo({
      url: '/pages/result/mbti'
    })
  },

  // 查看DISC结果
  viewDISCResult() {
    wx.navigateTo({
      url: '/pages/result/disc'
    })
  },

  // 查看PDP结果
  viewPDPResult() {
    wx.navigateTo({
      url: '/pages/result/pdp'
    })
  },

  // 跳转到个人中心
  goToProfile() {
    wx.navigateTo({
      url: '/pages/profile/index'
    })
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '神仙团队AI性格测试 - 来测测你的MBTI人格类型吧！',
      path: '/pages/index/index',
      imageUrl: '/images/share.png'
    }
  }
})
