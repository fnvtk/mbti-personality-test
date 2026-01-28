// pages/history/index.js
Page({
  data: {
    hasHistory: false,
    mbtiResult: null,
    discResult: null,
    pdpResult: null,
    aiResult: null
  },

  onLoad() {
    this.loadHistory()
  },

  onShow() {
    this.loadHistory()
  },

  loadHistory() {
    const mbtiResult = wx.getStorageSync('mbtiResult')
    const discResult = wx.getStorageSync('discResult')
    const pdpResult = wx.getStorageSync('pdpResult')
    const aiResult = wx.getStorageSync('aiResult')
    
    // 格式化时间
    const formatTime = (result) => {
      if (!result || !result.timestamp) return result
      const date = new Date(result.timestamp)
      const testTime = `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
      return { ...result, testTime }
    }
    
    this.setData({
      hasHistory: !!(mbtiResult || discResult || pdpResult || aiResult),
      mbtiResult: formatTime(mbtiResult),
      discResult: formatTime(discResult),
      pdpResult: formatTime(pdpResult),
      aiResult: formatTime(aiResult)
    })
  },

  goToTest() {
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },

  viewMBTIResult() {
    wx.navigateTo({
      url: '/pages/result/mbti'
    })
  },

  viewDISCResult() {
    wx.navigateTo({
      url: '/pages/result/disc'
    })
  },

  viewPDPResult() {
    wx.navigateTo({
      url: '/pages/result/pdp'
    })
  },

  viewAIResult() {
    wx.navigateTo({
      url: '/pages/ai-test/result'
    })
  }
})
