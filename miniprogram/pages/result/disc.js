// pages/result/disc.js
Page({
  data: {
    result: null,
    typeList: [
      { type: 'D', label: 'D型 - 支配型', colorClass: 'fill-d' },
      { type: 'I', label: 'I型 - 影响型', colorClass: 'fill-i' },
      { type: 'S', label: 'S型 - 稳健型', colorClass: 'fill-s' },
      { type: 'C', label: 'C型 - 谨慎型', colorClass: 'fill-c' }
    ]
  },

  onLoad() {
    const result = wx.getStorageSync('discResult')
    if (result) {
      this.setData({ result })
    } else {
      wx.showToast({ title: '暂无测试结果', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
    }
  },

  retakeTest() {
    wx.removeStorageSync('discResult')
    wx.redirectTo({ url: '/pages/test/disc' })
  },

  onShareAppMessage() {
    const result = this.data.result
    return {
      title: `我的DISC类型是${result?.dominantType}型（${result?.description?.title}），来测测你的吧！`,
      path: '/pages/index/index'
    }
  }
})
