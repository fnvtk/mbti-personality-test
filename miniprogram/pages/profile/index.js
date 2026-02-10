// pages/profile/index.js - 我的页面
const app = getApp()

Page({
  data: {
    hasLogin: false,
    userInfo: null,
    balance: 0,
    testCount: 0,
    hasResults: false,
    mbtiType: '',
    discType: '',
    pdpType: ''
  },

  onLoad() { this.loadData() },
  onShow() { this.loadData() },

  loadData() {
    const userInfo = wx.getStorageSync('userInfo')
    const token = wx.getStorageSync('token')
    const mbtiResult = wx.getStorageSync('mbtiResult')
    const discResult = wx.getStorageSync('discResult')
    const pdpResult = wx.getStorageSync('pdpResult')

    let testCount = 0
    if (mbtiResult) testCount++
    if (discResult) testCount++
    if (pdpResult) testCount++

    this.setData({
      hasLogin: !!token || !!userInfo,
      userInfo: userInfo || null,
      testCount,
      hasResults: testCount > 0,
      mbtiType: mbtiResult?.type || mbtiResult?.mbtiType || '',
      discType: discResult?.type || discResult?.dominantType || '',
      pdpType: pdpResult?.type || pdpResult?.dominantType || ''
    })
  },

  doLogin() {
    app.getUserInfo((info) => {
      if (info) {
        this.setData({ hasLogin: true, userInfo: info })
      }
    })
  },

  goToIndex() { wx.redirectTo({ url: '/pages/index/index' }) },
  goToCamera() { wx.navigateTo({ url: '/pages/ai-test/index' }) },
  goToHistory() { wx.navigateTo({ url: '/pages/history/index' }) },
  goToPurchase() { wx.navigateTo({ url: '/pages/purchase/index' }) },
  goToSettings() {
    wx.showToast({ title: '开发中', icon: 'none' })
  },
  goToFeedback() {
    wx.showModal({ title: '意见反馈', content: '请添加微信: 28533368', showCancel: false })
  },
  goToAbout() {
    wx.showModal({ title: '关于我们', content: '神仙团队AI性格测试\n基于MBTI/PDP/DISC/盖洛普\nAI人脸性格分析系统', showCancel: false })
  },
  shareApp() {
    // 触发分享
  },
  viewMBTI() { wx.navigateTo({ url: '/pages/result/mbti' }) },
  viewDISC() { wx.navigateTo({ url: '/pages/result/disc' }) },
  viewPDP() { wx.navigateTo({ url: '/pages/result/pdp' }) },

  logout() {
    wx.showModal({
      title: '确认退出',
      content: '退出后测试记录仍会保留',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token')
          wx.removeStorageSync('userInfo')
          this.setData({ hasLogin: false, userInfo: null })
        }
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '神仙团队AI性格测试 - 发现你的MBTI类型',
      path: '/pages/index/index'
    }
  }
})
